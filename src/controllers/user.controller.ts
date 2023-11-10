import { Request, Response } from "express";
import {
  interfaces,
  controller,
  httpPost,
  httpPut,
  request,
  response,
} from "inversify-express-utils";
import * as jwt from "jsonwebtoken";
import { UserService } from "../services/user.service";
import {
  confirmEmailSchema,
  signupSchema,
  loginSchema,
} from "../validations/user";
import { error_response, success_response } from "../utils/responses";
import { MailService } from "../services/mail.service";
import { User } from "../entities/User";
import logger from "../logger";

@controller("/user")
export default class UserController implements interfaces.Controller {
  constructor(
    private userService: UserService,
    private mailService: MailService,
    private secretKey: string = process.env.JWT_SECRET || ""
  ) {}

  // Method to Generate JWT auth token
  private async generateJwtAuthToken(user: User): Promise<string> {
    const payload = {
      userId: user.id,
      role: user.role,
    };
    const token = jwt.sign(payload, this.secretKey, {
      expiresIn: "1h",
    });
    return token;
  }

  @httpPost("/")
  public async signup(@request() req: Request, @response() res: Response) {
    try {
      // Validate request body
      const { error, value } = signupSchema.validate(req.body);
      if (error) {
        return error_response(
          res,
          error.details.map((err) => err.message).join(","),
          400
        );
      }
      // Check if user already exists
      const user = await this.userService.findUserByEmail(value.email);
      if (user) {
        return error_response(res, "User already exists. Please login", 400);
      }

      const signup_token = Math.floor(
        100000 + Math.random() * 900000
      ).toString();
      value.signup_token = signup_token;
      value.email = value.email.toLowerCase();

      // Create user
      await this.userService.createUser(value);
      const subject = "Confirm your email";
      const body = `Please enter the code to confirm your email: ${signup_token}`;
      // send email in the background
      await this.mailService.enqueueEmailSending(value.email, subject, body);

      return success_response(
        res,
        "Account created successfully. Please confirm your email.",
        null,
        201
      );
    } catch (err: any) {
      logger.error(`An error occurred: ${err.message}`, { stack: err.stack });
      return error_response(res, err.message, 500);
    }
  }

  @httpPut("/confirm_email")
  public async confirm_email(
    @request() req: Request,
    @response() res: Response
  ) {
    try {
      const { error, value } = confirmEmailSchema.validate(req.body);
      if (error) {
        return error_response(
          res,
          error.details.map((err) => err.message).join(","),
          400
        );
      }

      const user = await this.userService.findUserBySignupCode(
        value.signup_token
      );
      if (!user) {
        return error_response(res, "User not found", 404);
      }

      await this.userService.confirmUser(user);
      return success_response(res, "Email confirmed successfully", null, 200);
    } catch (err: any) {
      logger.error(`An error occurred: ${err.message}`, { stack: err.stack });
      return error_response(res, err.message, 500);
    }
  }

  @httpPost("/login")
  public async login(@request() req: Request, @response() res: Response) {
    try {
      const { error, value } = loginSchema.validate(req.body);
      if (error) {
        return error_response(
          res,
          error.details.map((err) => err.message).join(","),
          400
        );
      }
      const user = await this.userService.authenticateUser(
        value.email.toLowerCase(),
        value.password
      );
      if (!user) {
        return error_response(res, "Invalid credentials", 401);
      }
      const token = await this.generateJwtAuthToken(user);
      return success_response(res, "Login successful", { token }, 200);
    } catch (err: any) {
      logger.error(`An error occurred: ${err.message}`, { stack: err.stack });
      return error_response(res, err.message, 500);
    }
  }
}
