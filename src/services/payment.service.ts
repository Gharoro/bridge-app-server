import { injectable } from "inversify";
import axios from "axios";
import logger from "../logger";

@injectable()
export class PaymentService {
  async initiatePayment(params: {
    email: string;
    amount: string;
    callback_url: string;
  }): Promise<any> {
    try {
      const config = {
        method: "POST",
        url: `${process.env.PAYSTACK_BASE_URL}/transaction/initialize`,
        headers: {
          Authorization: `Bearer ${process.env.PAYSTACK_SEC}`,
          "Content-Type": "application/json",
        },
        data: params,
      };

      const response = await axios(config);
      return response.data;
    } catch (err: any) {
      logger.error(`An error occurred: ${err.message}`, { stack: err.stack });
      throw err;
    }
  }

  async verifyPayment(reference: string): Promise<any> {
    try {
      const config = {
        method: "GET",
        url: `${process.env.PAYSTACK_BASE_URL}/transaction/verify/${reference}`,
        headers: {
          Authorization: `Bearer ${process.env.PAYSTACK_SEC}`,
          "Content-Type": "application/json",
        },
      };

      const response = await axios(config);
      return response.data;
    } catch (err: any) {
      logger.error(`An error occurred: ${err.message}`, { stack: err.stack });
      throw err;
    }
  }
}
