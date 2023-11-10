import { injectable } from "inversify";
import Redis from "ioredis";
import logger from "../logger";

@injectable()
export class RedisService {
  private client: Redis;

  constructor() {
    this.client = new Redis();

    const redisUrl = process.env.REDIS_URL;

    if (!redisUrl) {
      logger.error(`REDIS_URL environment variable is not defined`);
      throw new Error("REDIS_URL environment variable is not defined");
    }

    this.client = new Redis(redisUrl);
  }

  public async get(key: string): Promise<string | null> {
    try {
      const result = await this.client.get(key);
      return result || null;
    } catch (err: any) {
      logger.error(`Error fetching from redis: ${err.message}`, {
        stack: err.stack,
      });
      throw new Error("Error fetching from redis");
    }
  }

  public async setex(
    key: string,
    seconds: number,
    value: string
  ): Promise<void> {
    try {
      await this.client.setex(key, seconds, value);
    } catch (err: any) {
      logger.error(`Error setting value in redis: ${err.message}`, {
        stack: err.stack,
      });
      throw new Error("Error setting value in redis");
    }
  }

  public async del(key: string): Promise<void> {
    try {
      await this.client.del(key);
    } catch (err: any) {
      logger.error(`Error deleting key ${key} from Redis: ${err.message}`, {
        stack: err.stack,
      });
      throw new Error(`Error deleting key ${key} from Redis`);
    }
  }
}
