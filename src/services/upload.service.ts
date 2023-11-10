import { injectable } from "inversify";
import S3 from "aws-sdk/clients/s3";
import logger from "../logger";

@injectable()
export class UploadService {
  AWS_S3_BUCKET = process.env.AWS_S3_BUCKET;
  s3 = new S3({
    accessKeyId: process.env.AWS_S3_ACCESS_KEY,
    secretAccessKey: process.env.AWS_S3_KEY_SECRET,
  });

  async uploadFile(file: Express.Multer.File): Promise<string> {
    try {
      const { originalname, mimetype, path } = file;
      const params: S3.PutObjectRequest = {
        Bucket: this.AWS_S3_BUCKET!,
        Key: String(originalname),
        Body: path,
        ACL: "public-read",
        ContentType: mimetype,
        ContentDisposition: "inline",
      };

      let s3Response = await this.s3.upload(params).promise();
      return s3Response.Location;
    } catch (err: any) {
      logger.error(`Error uploading file to aws s3: ${err.message}`, {
        stack: err.stack,
      });
      throw new Error(`Error uploading file to aws s3`);
    }
  }
}
