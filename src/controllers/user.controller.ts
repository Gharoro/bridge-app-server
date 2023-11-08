import { Request, Response } from "express";
import {
  interfaces,
  controller,
  httpGet,
  httpPost,
  request,
  response,
} from "inversify-express-utils";

@controller("/user")
export default class UserController implements interfaces.Controller {
  @httpGet("/")
  public async index(
    @request() req: Request,
    @response() res: Response
  ): Promise<Response> {
    return res.status(200).json({
      success: true,
      message: `Hello ${req.query.name}!`,
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
