import { Request, Response } from "express";
import {
  interfaces,
  controller,
  request,
  response,
  httpGet,
} from "inversify-express-utils";
import { error_response, success_response } from "../utils/responses";
import { authenticateRole, authenticateToken } from "../middlewares/Authorize";
import { TransactionService } from "../services/transaction.service";
import { RedisService } from "../services/redis.service";
import { REDIS_KEYS } from "../utils/data";
import logger from "../logger";

@controller("/transaction")
export default class TransactionController implements interfaces.Controller {
  constructor(
    private transactionService: TransactionService,
    private redisService: RedisService
  ) {}

  // Get transactions for a landlord
  @httpGet("/landlord", authenticateToken, authenticateRole("landlord"))
  public async get_landlord_transactions(
    @request() req: Request,
    @response() res: Response
  ) {
    try {
      const loggedInuser = (req as any).user;

      // Attempt fetching data from cache
      const cached_data = await this.redisService.get(
        REDIS_KEYS.LANDLORD_TRANSACTIONS
      );

      if (cached_data) {
        return success_response(
          res,
          "Successfully found transactions from cache",
          JSON.parse(cached_data),
          200
        );
      }

      const results = await this.transactionService.findByLandlordId(
        parseInt(loggedInuser.userId)
      );

      // TTL of 1 hour
      await this.redisService.setex(
        REDIS_KEYS.LANDLORD_TRANSACTIONS,
        3600,
        JSON.stringify(results)
      );

      return success_response(
        res,
        "Successfully found transactions",
        results,
        200
      );
    } catch (err: any) {
      logger.error(`An error occurred: ${err.message}`, { stack: err.stack });
      return error_response(res, err.message, 500);
    }
  }

  // Get transactions for a tenant
  @httpGet("/tenant", authenticateToken, authenticateRole("tenant"))
  public async get_tenant_transactions(
    @request() req: Request,
    @response() res: Response
  ) {
    try {
      const loggedInuser = (req as any).user;
      // Attempt fetching data from cache
      const cached_data = await this.redisService.get(
        REDIS_KEYS.TENANT_TRANSACTIONS
      );

      if (cached_data) {
        return success_response(
          res,
          "Successfully found transactions from cache",
          JSON.parse(cached_data),
          200
        );
      }

      const results = await this.transactionService.findByTenantId(
        parseInt(loggedInuser.userId)
      );

      // TTL of 1 hour
      await this.redisService.setex(
        REDIS_KEYS.TENANT_TRANSACTIONS,
        3600,
        JSON.stringify(results)
      );

      return success_response(
        res,
        "Successfully found transactions",
        results,
        200
      );
    } catch (err: any) {
      logger.error(`An error occurred: ${err.message}`, { stack: err.stack });
      return error_response(res, err.message, 500);
    }
  }
}
