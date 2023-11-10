import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateTransactionTable1699560275527 implements MigrationInterface {
    name = 'CreateTransactionTable1699560275527'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "transactions" ("id" SERIAL NOT NULL, "status" character varying NOT NULL, "transaction_ref" character varying NOT NULL, "price" numeric(10,2) NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "bid_id" integer, CONSTRAINT "PK_a219afd8dd77ed80f5a862f1db9" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "bids" ADD "transaction_id" integer`);
        await queryRunner.query(`ALTER TABLE "bids" ADD CONSTRAINT "UQ_983503603c5a9ea82923dd0506d" UNIQUE ("transaction_id")`);
        await queryRunner.query(`ALTER TABLE "transactions" ADD CONSTRAINT "FK_b48bf48b683c52828729a46c6c6" FOREIGN KEY ("bid_id") REFERENCES "bids"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "bids" ADD CONSTRAINT "FK_983503603c5a9ea82923dd0506d" FOREIGN KEY ("transaction_id") REFERENCES "transactions"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "bids" DROP CONSTRAINT "FK_983503603c5a9ea82923dd0506d"`);
        await queryRunner.query(`ALTER TABLE "transactions" DROP CONSTRAINT "FK_b48bf48b683c52828729a46c6c6"`);
        await queryRunner.query(`ALTER TABLE "bids" DROP CONSTRAINT "UQ_983503603c5a9ea82923dd0506d"`);
        await queryRunner.query(`ALTER TABLE "bids" DROP COLUMN "transaction_id"`);
        await queryRunner.query(`DROP TABLE "transactions"`);
    }

}
