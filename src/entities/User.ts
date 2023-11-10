import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  BaseEntity,
  BeforeInsert,
  OneToMany,
} from "typeorm";
import * as bcrypt from "bcrypt";
import { House } from "./House";
import { Bids } from "./Bids";
import { CounterBid } from "./CounterBids";

@Entity("users")
export class User extends BaseEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  first_name!: string;

  @Column()
  last_name!: string;

  @Column({ unique: true })
  email!: string;

  @Column()
  password!: string;

  @Column()
  profile_picture!: string;

  @Column()
  signup_token!: string;

  @Column({ nullable: true })
  reset_password_token!: string;

  @Column({ type: "timestamp", nullable: true })
  reset_password_token_expires!: Date | null;

  @Column({ default: false })
  email_confirmed!: boolean;

  @Column({
    type: "enum",
    enum: ["admin", "landlord", "tenant"],
    default: "landlord",
  })
  role!: string;

  @Column({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
  created_at!: Date;

  @Column({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
  updated_at!: Date;

  @OneToMany(() => House, (house) => house.user)
  houses!: House[];

  @OneToMany(() => Bids, (bid) => bid.sender)
  bids!: Bids[];

  @OneToMany(() => CounterBid, (counter_bid) => counter_bid.sender)
  counter_bids!: CounterBid[];

  @BeforeInsert()
  async hashPassword() {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
  }
}
