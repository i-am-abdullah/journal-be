import { MigrationInterface, QueryRunner } from "typeorm";

export class AddNewFieldToPost1748298360236 implements MigrationInterface {
    name = 'AddNewFieldToPost1748298360236'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "posts" ADD "imageUrl" character varying`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "posts" DROP COLUMN "imageUrl"`);
    }

}
