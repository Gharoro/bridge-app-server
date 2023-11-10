import { Request, Response } from "express";
import {
  interfaces,
  controller,
  httpPost,
  request,
  response,
  httpGet,
  requestParam,
} from "inversify-express-utils";
import { HouseService } from "../services/house.service";
import { error_response, success_response } from "../utils/responses";
import { createHouseSchema } from "../validations/house";
import { authenticateRole, authenticateToken } from "../middlewares/Authorize";
import upload from "../middlewares/Multer";
import { UploadService } from "../services/upload.service";
import { UserService } from "../services/user.service";
import { RedisService } from "../services/redis.service";
import { REDIS_KEYS } from "../utils/data";
import logger from "../logger";

@controller("/house")
export default class HouseController implements interfaces.Controller {
  constructor(
    private houseService: HouseService,
    private uploadService: UploadService,
    private userService: UserService,
    private redisService: RedisService
  ) {}

  // Get all houses
  @httpGet("/")
  public async get_all(@request() req: Request, @response() res: Response) {
    try {
      // Attempt fetching data from cache
      const cached_data = await this.redisService.get(REDIS_KEYS.HOUSES);

      if (cached_data) {
        return success_response(
          res,
          `Found ${JSON.parse(cached_data).length} ${
            JSON.parse(cached_data).length > 1 ? "houses" : "house"
          }`,
          JSON.parse(cached_data),
          200
        );
      }

      const houses = await this.houseService.findAll();

      if (houses.length > 1) {
        // TTL of 1 hour
        await this.redisService.setex(
          REDIS_KEYS.HOUSES,
          3600,
          JSON.stringify(houses)
        );
      }
      return success_response(
        res,
        `Found ${houses.length} ${houses.length > 1 ? "houses" : "house"}`,
        houses,
        200
      );
    } catch (err: any) {
      logger.error(`An error occurred: ${err.message}`, { stack: err.stack });
      return error_response(res, err.message, 500);
    }
  }

  // Create a house
  @httpPost(
    "/",
    authenticateToken,
    authenticateRole("landlord"),
    upload.array("media", 5)
  )
  public async create(@request() req: Request, @response() res: Response) {
    try {
      // Validate request body
      const { error, value } = createHouseSchema.validate(req.body);
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

      const selectedFiles = req.files as Express.Multer.File[];
      if (selectedFiles.length < 1) {
        return error_response(
          res,
          "Please upload at least one media file",
          400
        );
      }

      if (selectedFiles.length > 5) {
        return error_response(
          res,
          "Can only upload a maximum of 5 media files",
          400
        );
      }

      // Check if selectedFiles contain only images or videos
      const allowedMimetypes = [
        "image/jpeg",
        "image/png",
        "video/mp4",
        "video/quicktime",
      ];
      const isAllValid = selectedFiles.every((file) =>
        allowedMimetypes.includes(file.mimetype)
      );

      if (!isAllValid) {
        return error_response(
          res,
          "Invalid file type. Upload only images or videos.",
          400
        );
      }

      const uploadPromises = selectedFiles.map((file) =>
        this.uploadService.uploadFile(file)
      );
      const uploadedUrls = await Promise.all(uploadPromises);
      value.media = uploadedUrls;
      value.user = user;

      // Create house
      await this.houseService.createHouse(value);
      await this.redisService.del(REDIS_KEYS.HOUSES);
      return success_response(res, "House successfully created", null, 201);
    } catch (err: any) {
      logger.error(`An error occurred: ${err.message}`, { stack: err.stack });
      return error_response(res, err.message, 500);
    }
  }

  // Get single house
  @httpGet("/:id")
  public async get_single(
    @response() res: Response,
    @requestParam("id") id: string
  ) {
    try {
      // Attempt fetching data from cache
      const cached_data = await this.redisService.get(REDIS_KEYS.HOUSE_BY_ID);

      if (cached_data) {
        return success_response(
          res,
          "Successfully found house from cache",
          JSON.parse(cached_data),
          200
        );
      }
      const house = await this.houseService.findOne(parseInt(id));
      if (!house) {
        return error_response(res, "House not found", 404);
      }
      // TTL of 1 hour
      await this.redisService.setex(
        REDIS_KEYS.HOUSE_BY_ID,
        3600,
        JSON.stringify(house)
      );
      return success_response(res, "Successfully found house", house, 200);
    } catch (err: any) {
      logger.error(`An error occurred: ${err.message}`, { stack: err.stack });
      return error_response(res, err.message, 500);
    }
  }
}
