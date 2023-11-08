import { Request, Response } from "express";
import {
  interfaces,
  controller,
  httpGet,
  httpPost,
  request,
  response,
} from "inversify-express-utils";
import { UserService } from "../services/user.service";

@controller("/user")
export default class UserController implements interfaces.Controller {
  constructor(private userService: UserService) {} // Inject the UserService

  @httpGet("/")
  public async index(
    @request() req: Request,
    @response() res: Response
  ): Promise<Response> {
    const users = await this.userService.getAll();
    return res.status(200).json({
      success: true,
      message: `Found ${users.length} users`,
      data: users,
    });
  }

  @httpPost("/")
  public async create(@request() req: Request, @response() res: Response) {
    try {
      return res.status(200).json({
        success: true,
        data: req.body,
      });
    } catch (err: any) {
      return res.status(500).json({ success: false, error: err.message });
    }
  }
}
