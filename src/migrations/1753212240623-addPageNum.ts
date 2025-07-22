import { MigrationInterface, QueryRunner } from "typeorm";

export class AddPageNum1753212240623 implements MigrationInterface {
    name = 'AddPageNum1753212240623'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "posts" ADD "pageNum" character varying`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "posts" DROP COLUMN "pageNum"`);
    }

}
