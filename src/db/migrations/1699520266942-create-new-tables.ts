import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateNewTables1699520266942 implements MigrationInterface {
    name = 'CreateNewTables1699520266942'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."bids_status_enum" AS ENUM('pending', 'accepted', 'rejected', 'counter')`);
        await queryRunner.query(`CREATE TABLE "bids" ("id" SERIAL NOT NULL, "status" "public"."bids_status_enum" NOT NULL DEFAULT 'pending', "description" character varying NOT NULL, "price" numeric(10,2) NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "house_id" integer, "sender" integer, CONSTRAINT "PK_7950d066d322aab3a488ac39fe5" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "houses" ("id" SERIAL NOT NULL, "title" character varying NOT NULL, "description" character varying NOT NULL, "location" character varying NOT NULL, "price" numeric(10,2) NOT NULL, "number_of_rooms" integer NOT NULL, "amenities" text array NOT NULL, "media" text array NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "user_id" integer, CONSTRAINT "PK_ee6cacb502a4b8590005eb3dc8d" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "role"`);
        await queryRunner.query(`CREATE TYPE "public"."users_role_enum" AS ENUM('admin', 'landlord', 'tenant')`);
        await queryRunner.query(`ALTER TABLE "users" ADD "role" "public"."users_role_enum" NOT NULL DEFAULT 'landlord'`);
        await queryRunner.query(`ALTER TABLE "bids" ADD CONSTRAINT "FK_06f814659d608f640e07c5e5d56" FOREIGN KEY ("house_id") REFERENCES "houses"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "bids" ADD CONSTRAINT "FK_c2426bb8ce85759690a64fbcc0e" FOREIGN KEY ("sender") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "houses" ADD CONSTRAINT "FK_307de020b40481f780f391df54e" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "houses" DROP CONSTRAINT "FK_307de020b40481f780f391df54e"`);
        await queryRunner.query(`ALTER TABLE "bids" DROP CONSTRAINT "FK_c2426bb8ce85759690a64fbcc0e"`);
        await queryRunner.query(`ALTER TABLE "bids" DROP CONSTRAINT "FK_06f814659d608f640e07c5e5d56"`);
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "role"`);
        await queryRunner.query(`DROP TYPE "public"."users_role_enum"`);
        await queryRunner.query(`ALTER TABLE "users" ADD "role" character varying NOT NULL DEFAULT 'landlord'`);
        await queryRunner.query(`DROP TABLE "houses"`);
        await queryRunner.query(`DROP TABLE "bids"`);
        await queryRunner.query(`DROP TYPE "public"."bids_status_enum"`);
    }

}
