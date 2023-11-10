import { Request, Response } from "express";
import {
  interfaces,
  controller,
  httpPost,
  httpPut,
  request,
  response,
  httpGet,
  requestParam,
  queryParam,
} from "inversify-express-utils";
import { error_response, success_response } from "../utils/responses";
import { authenticateRole, authenticateToken } from "../middlewares/Authorize";
import { UserService } from "../services/user.service";
import { BidService } from "../services/bid.service";
import { createBidSchema, createCounterBidSchema } from "../validations/bid";
import { HouseService } from "../services/house.service";
import { MailService } from "../services/mail.service";
import { PaymentService } from "../services/payment.service";
import { verifyPaymentSchema } from "../validations/payment";
import { TransactionService } from "../services/transaction.service";
import { RedisService } from "../services/redis.service";
import { REDIS_KEYS } from "../utils/data";
import logger from "../logger";

@controller("/bid")
export default class BidController implements interfaces.Controller {
  constructor(
    private bidService: BidService,
    private houseService: HouseService,
    private mailService: MailService,
    private userService: UserService,
    private paymentService: PaymentService,
    private transactionService: TransactionService,
    private redisService: RedisService
  ) {}

  // Get bids for a house
  @httpGet("/:id", authenticateToken, authenticateRole("landlord"))
  public async get_house_bids(
    @response() res: Response,
    @requestParam("id") id: string
  ) {
    try {
      // Attempt fetching data from cache
      const cached_data = await this.redisService.get(REDIS_KEYS.HOUSE_BIDS);
      if (cached_data) {
        return success_response(
          res,
          "Successfully found bids from cache",
          JSON.parse(cached_data),
          200
        );
      }
      const bids = await this.bidService.findByHouseId(parseInt(id));
      if (bids.length > 1) {
        // TTL of 1 hour
        await this.redisService.setex(
          REDIS_KEYS.HOUSE_BIDS,
          3600,
          JSON.stringify(bids)
        );
      }
      return success_response(res, "Successfully found bids", bids, 200);
    } catch (err: any) {
      logger.error(`An error occurred: ${err.message}`, { stack: err.stack });
      return error_response(res, err.message, 500);
    }
  }

  // Create a bid
  @httpPost("/", authenticateToken, authenticateRole("tenant"))
  public async create(@request() req: Request, @response() res: Response) {
    try {
      // Validate request body
      const { error, value } = createBidSchema.validate(req.body);
      if (error) {
        return error_response(
          res,
          error.details.map((err) => err.message).join(","),
          400
        );
      }

      const loggedInuser = (req as any).user;
      const user = await this.userService.findUserById(loggedInuser.userId);
      if (!user) {
        return error_response(res, "User not found", 404);
      }

      const house = await this.houseService.findOne(value.house);
      if (!house) {
        return error_response(res, "House not found", 404);
      }

      if (value.price < house.price) {
        return error_response(
          res,
          "Bid price cannot be less than house price",
          400
        );
      }

      value.sender = user;

      // Create bid
      await this.bidService.createBid(value);
      await this.redisService.del(REDIS_KEYS.HOUSE_BIDS);
      const subject = "New Bid";
      const body = `You have a new bid on your house. Please login to view`;
      await this.mailService.enqueueEmailSending(
        house.user.email,
        subject,
        body
      );

      return success_response(res, "Bid successfully sent", null, 200);
    } catch (err: any) {
      logger.error(`An error occurred: ${err.message}`, { stack: err.stack });
      return error_response(res, err.message, 500);
    }
  }

  // Create a counter bid
  @httpPost("/counter", authenticateToken)
  public async counter_bid(@request() req: Request, @response() res: Response) {
    try {
      // Validate request body
      const { error, value } = createCounterBidSchema.validate(req.body);
      if (error) {
        return error_response(
          res,
          error.details.map((err) => err.message).join(","),
          400
        );
      }

      const loggedInuser = (req as any).user;
      const user = await this.userService.findUserById(loggedInuser.userId);
      if (!user) {
        return error_response(res, "User not found", 404);
      }

      const bid = await this.bidService.findOne(value.bid);
      if (!bid) {
        return error_response(res, "Bid not found", 404);
      }

      value.sender = user;
      value.original_bid = bid;
      // Create counter bid
      const subject = "New Counter Bid";
      const body = `You have a new counter bid on your previous bid. Please login to view`;
      const recipient =
        user.role === "tenant" ? bid.house.user.email : bid.sender.email;
      await this.bidService.createCounterBid(value);
      await this.redisService.del(REDIS_KEYS.HOUSE_BIDS);
      await this.mailService.enqueueEmailSending(recipient, subject, body);
      return success_response(res, "Successfully counter bid", null, 200);
    } catch (err: any) {
      return error_response(res, err.message, 500);
    }
  }

  // Update status of a bid
  @httpPut("/update/:id", authenticateToken)
  public async update_status(
    @request() req: Request,
    @response() res: Response,
    @requestParam("id") id: string,
    @queryParam("bid_type") bid_type: string
  ) {
    try {
      if (!req.body.status) {
        return error_response(res, "Status is required", 400);
      }

      const loggedInuser = (req as any).user;
      const user = await this.userService.findUserById(loggedInuser.userId);
      if (!user) {
        return error_response(res, "User not found", 404);
      }

      const bid = await this.bidService.findOne(parseInt(id));
      if (!bid) {
        return error_response(res, "Bid not found", 404);
      }

      if (bid_type === "bid") {
        // update bid status
        await this.bidService.updateBidStatus(parseInt(id), req.body.status);
        await this.redisService.del(REDIS_KEYS.HOUSE_BIDS);
        if (req.body.status === "accepted") {
          // Initiate a transaction
          const amountToPay = Number(bid.price) * 100;
          const response = await this.paymentService.initiatePayment({
            email: user.email,
            amount: `${amountToPay}`,
            callback_url: `${process.env.BASE_URL}/bid/complete/${id}`,
          });
          return success_response(
            res,
            "Bid successfully accepted. Please pay to complete transaction",
            response.data,
            200
          );
        }

        return success_response(
          res,
          "Successfully updated bid status",
          null,
          200
        );
      } else {
        // update counter bid status
        await this.bidService.updateCounterBidStatus(
          parseInt(id),
          req.body.status
        );
        await this.redisService.del(REDIS_KEYS.HOUSE_BIDS);

        if (req.body.status === "accepted") {
          // Initiate a transaction
          const amountToPay = Number(bid.price) * 100;
          const response = await this.paymentService.initiatePayment({
            email: user.email,
            amount: `${amountToPay}`,
            callback_url: `${process.env.BASE_URL}/bid/complete/${id}`,
          });
          return success_response(
            res,
            "Bid successfully accepted. Please pay to complete transaction",
            response.data,
            200
          );
        }
        // Create a transaction and send email to landlord
        return success_response(
          res,
          "Successfully updated bid status",
          null,
          200
        );
      }
    } catch (err: any) {
      logger.error(`An error occurred: ${err.message}`, { stack: err.stack });
      return error_response(res, err.message, 500);
    }
  }

  // Verify transaction
  @httpPut("/verify_payment")
  public async verify_payment(
    @request() req: Request,
    @response() res: Response
  ) {
    try {
      // Validate request body
      const { error, value } = verifyPaymentSchema.validate(req.body);
      if (error) {
        return error_response(
          res,
          error.details.map((err) => err.message).join(","),
          400
        );
      }

      const response = await this.paymentService.verifyPayment(
        value.transaction_ref
      );

      if (response.data.status !== "success") {
        return error_response(res, "Payment verification failed", 400);
      }

      const bid = await this.bidService.findOne(parseInt(value.bid_id));
      if (!bid) {
        return error_response(res, "Bid not found", 404);
      }

      // create a transaction
      value.transaction_ref = response.data.reference;
      value.status = response.data.status;
      value.price = response.data.amount / 100;
      value.bid = bid;

      await this.transactionService.createTransaction(value);
      await this.redisService.del(REDIS_KEYS.LANDLORD_TRANSACTIONS);
      await this.redisService.del(REDIS_KEYS.TENANT_TRANSACTIONS);

      const subject = "Payment Verification";
      const landLordBody = `Payment of N${value.price} for your house has been verified.`;
      const tenantBody = `Payment of N${value.price} for your bid has been verified.`;

      // landlord email
      await this.mailService.enqueueEmailSending(
        bid.house.user.email,
        subject,
        landLordBody
      );
      // tenant email
      await this.mailService.enqueueEmailSending(
        bid.sender.email,
        subject,
        tenantBody
      );

      return success_response(res, "Payment successfully verified", null, 200);
    } catch (err: any) {
      logger.error(`An error occurred: ${err.message}`, { stack: err.stack });
      return error_response(res, err.message, 500);
    }
  }
}
