import "dotenv/config";
import "reflect-metadata";
import { DataSource } from "typeorm";
import { User } from "../entities/User";
import { House } from "../entities/House";
import { Bids } from "../entities/Bids";
import { CounterBid } from "../entities/CounterBids";
import { Transaction } from "../entities/Transaction";

const port = process.env.DB_PORT as unknown as number | undefined;

export const AppDataSource = new DataSource({
  type: "postgres",
  host: process.env.DB_HOST,
  port: port,
  synchronize: false,
  ssl: true,
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  entities: [User, House, Bids, CounterBid, Transaction],
  migrations: ["dist/db/migrations/*{.ts,.js}"],
});
