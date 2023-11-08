import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateUserTable1699451468540 implements MigrationInterface {
    name = 'CreateUserTable1699451468540'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "users" ("id" SERIAL NOT NULL, "first_name" character varying NOT NULL, "last_name" character varying NOT NULL, "email" character varying NOT NULL, "password" character varying NOT NULL, "profile_picture" character varying NOT NULL, "signup_token" character varying NOT NULL, "reset_password_token" character varying NOT NULL, "reset_password_token_expires" TIMESTAMP, "email_confirmed" boolean NOT NULL DEFAULT false, "role" character varying NOT NULL DEFAULT 'landlord', "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_97672ac88f789774dd47f7c8be3" UNIQUE ("email"), CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "users"`);
    }

}
