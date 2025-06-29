import { MigrationInterface, QueryRunner } from "typeorm";

export class AddNewFieldToPost21748304284464 implements MigrationInterface {
    name = 'AddNewFieldToPost21748304284464'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "posts" RENAME COLUMN "absract" TO "abstract"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "posts" RENAME COLUMN "abstract" TO "absract"`);
    }

}
