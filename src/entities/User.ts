import { Entity, PrimaryGeneratedColumn, Column, BaseEntity } from "typeorm";
import { Role } from "../utils/config";

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

  @Column()
  reset_password_token!: string;

  @Column({ type: "timestamp", nullable: true })
  reset_password_token_expires!: Date | null;

  @Column({ default: false })
  email_confirmed!: boolean;

  @Column({ default: Role.LANDLORD })
  role!: Role;

  @Column({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
  created_at!: Date;

  @Column({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
  updated_at!: Date;
}
