import { MigrationInterface, QueryRunner } from "typeorm";

export class AddedKeywordsCol1752137111392 implements MigrationInterface {
    name = 'AddedKeywordsCol1752137111392'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "posts" ADD "keywords" character varying`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "posts" DROP COLUMN "keywords"`);
    }

}
