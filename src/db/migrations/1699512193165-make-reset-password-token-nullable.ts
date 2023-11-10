import { MigrationInterface, QueryRunner } from "typeorm";

export class MakeResetPasswordTokenNullable1699512193165 implements MigrationInterface {
    name = 'MakeResetPasswordTokenNullable1699512193165'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" ALTER COLUMN "reset_password_token" DROP NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" ALTER COLUMN "reset_password_token" SET NOT NULL`);
    }

}
