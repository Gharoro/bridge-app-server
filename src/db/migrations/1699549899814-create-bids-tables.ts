import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateBidsTables1699549899814 implements MigrationInterface {
    name = 'CreateBidsTables1699549899814'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."counter_bids_status_enum" AS ENUM('pending', 'accepted', 'rejected')`);
        await queryRunner.query(`CREATE TABLE "counter_bids" ("id" SERIAL NOT NULL, "status" "public"."counter_bids_status_enum" NOT NULL DEFAULT 'pending', "description" character varying NOT NULL, "price" numeric(10,2) NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "originalBidId" integer, "sender" integer, CONSTRAINT "PK_df7238e7b21793d77b98e79dfcc" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "counter_bids" ADD CONSTRAINT "FK_4aa9c2778d7ce81d8e2d12aaabf" FOREIGN KEY ("originalBidId") REFERENCES "bids"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "counter_bids" ADD CONSTRAINT "FK_364475d2486be9966d9baf4c8e4" FOREIGN KEY ("sender") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "counter_bids" DROP CONSTRAINT "FK_364475d2486be9966d9baf4c8e4"`);
        await queryRunner.query(`ALTER TABLE "counter_bids" DROP CONSTRAINT "FK_4aa9c2778d7ce81d8e2d12aaabf"`);
        await queryRunner.query(`DROP TABLE "counter_bids"`);
        await queryRunner.query(`DROP TYPE "public"."counter_bids_status_enum"`);
    }

}
