import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  BaseEntity,
  ManyToOne,
  OneToMany,
  JoinColumn,
  OneToOne,
} from "typeorm";
import { House } from "./House";
import { User } from "./User";
import { CounterBid } from "./CounterBids";
import { Transaction } from "./Transaction";

@Entity("bids")
export class Bids extends BaseEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @ManyToOne(() => House, (house) => house.bids)
  @JoinColumn({ name: "house_id" })
  house!: House;

  @ManyToOne(() => User, (user) => user.bids)
  @JoinColumn({ name: "sender" })
  sender!: User;

  @OneToMany(() => CounterBid, (counter_bid) => counter_bid.original_bid)
  counter_bids!: CounterBid[];

  @Column({
    type: "enum",
    enum: ["pending", "accepted", "rejected", "counter"],
    default: "pending",
  })
  status!: string;

  @Column()
  description!: string;

  @Column({ type: "decimal", precision: 10, scale: 2 })
  price!: number;

  @OneToOne(() => Transaction, (transaction) => transaction.bid)
  @JoinColumn({ name: "transaction_id" })
  transaction!: Transaction;

  @Column({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
  created_at!: Date;

  @Column({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
  updated_at!: Date;
}
