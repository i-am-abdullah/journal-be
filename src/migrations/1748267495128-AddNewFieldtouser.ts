import { MigrationInterface, QueryRunner } from "typeorm";

export class AddNewFieldtouser1748267495128 implements MigrationInterface {
    name = 'AddNewFieldtouser1748267495128'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" ADD "location" character varying`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "location"`);
    }

}
