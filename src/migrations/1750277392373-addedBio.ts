import { MigrationInterface, QueryRunner } from "typeorm";

export class AddedBio1750277392373 implements MigrationInterface {
    name = 'AddedBio1750277392373'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" ADD "bio" character varying`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "bio"`);
    }

}
