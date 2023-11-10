import { injectable } from "inversify";
import { createClient } from "redis";
import type { RedisClientType } from "redis";
import logger from "../logger";

@injectable()
export class RedisService {
  private client: RedisClientType;

  constructor() {
    const redisUrl = process.env.REDIS_URL;

    if (!redisUrl) {
      logger.error(`REDIS_URL environment variable is not defined`);
      throw new Error("REDIS_URL environment variable is not defined");
    }

    this.client = createClient({ url: redisUrl });

    this.client.on("error", (err: any) => {
      logger.error(`Error connecting to Redis: ${err.message}`, {
        stack: err.stack,
      });
      throw new Error("Error connecting to Redis");
    });

    this.client.connect();
  }

  public async get(key: string): Promise<string | null> {
    try {
      return (await this.client.get(key)) || null;
    } catch (err: any) {
      const errorMessage = `Error fetching from Redis: ${err.message}`;
      logger.error(errorMessage, { stack: err.stack });
      throw new Error(errorMessage);
    }
  }

  public async setex(
    key: string,
    seconds: number,
    value: string
  ): Promise<void> {
    try {
      await this.client.setEx(key, seconds, value);
    } catch (err: any) {
      const errorMessage = `Error setting value in Redis: ${err.message}`;
      logger.error(errorMessage, { stack: err.stack });
      throw new Error(errorMessage);
    }
  }

  public async del(key: string): Promise<void> {
    try {
      await this.client.del(key);
    } catch (err: any) {
      const errorMessage = `Error deleting key ${key} from Redis: ${err.message}`;
      logger.error(errorMessage, { stack: err.stack });
      throw new Error(errorMessage);
    }
  }
}
