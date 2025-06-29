import { MigrationInterface, QueryRunner } from "typeorm";

export class AddNewFieldToPost11748303932383 implements MigrationInterface {
    name = 'AddNewFieldToPost11748303932383'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "posts" ADD "absract" character varying`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "posts" DROP COLUMN "absract"`);
    }

}
