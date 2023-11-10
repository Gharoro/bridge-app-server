import { injectable } from "inversify";
import Bull from "bull";
import * as nodemailer from "nodemailer";
import logger from "../logger";

@injectable()
export class MailService {
  private emailQueue: Bull.Queue;
  private transporter: nodemailer.Transporter;

  constructor() {
    this.emailQueue = new Bull("emailQueue", {
      limiter: {
        max: 5,
        duration: 1000,
      },
    });

    // email transport configuration
    this.transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT),
      secure: false,
      auth: {
        user: process.env.SMTP_USERNAME,
        pass: process.env.SMTP_PASSWORD,
      },
    });

    this.emailQueue.process("sendEmail", async (job) => {
      const { recipient, subject, body } = job.data;
      await this.sendEmail(recipient, subject, body);
    });
  }

  // Function to send an email
  async sendEmail(recipient: string, subject: string, body: string) {
    const mailOptions = {
      from: process.env.SMTP_DOMAIN,
      to: recipient,
      subject: subject,
      text: body,
    };

    try {
      const info = await this.transporter.sendMail(mailOptions);
      logger.info(`Email sent: ${info.response}`);
    } catch (error: any) {
      logger.error(`Error sending email: ${error}`, { stack: error.stack });
      throw error;
    }
  }

  // Function to enqueue an email sending task
  async enqueueEmailSending(recipient: string, subject: string, body: string) {
    await this.emailQueue.add("sendEmail", { recipient, subject, body });
  }
}
