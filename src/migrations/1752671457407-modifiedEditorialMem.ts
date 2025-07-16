import { MigrationInterface, QueryRunner } from "typeorm";

export class ModifiedEditorialMem1752671457407 implements MigrationInterface {
    name = 'ModifiedEditorialMem1752671457407'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "editorial_members" DROP COLUMN "name"`);
        await queryRunner.query(`ALTER TABLE "editorial_members" DROP COLUMN "location"`);
        await queryRunner.query(`ALTER TABLE "editorial_members" DROP COLUMN "education"`);
        await queryRunner.query(`ALTER TABLE "editorial_members" DROP COLUMN "affiliation"`);
        await queryRunner.query(`ALTER TABLE "editorial_members" DROP COLUMN "areasOfExpertise"`);
        await queryRunner.query(`ALTER TABLE "editorial_members" ADD "members" character varying`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "editorial_members" DROP COLUMN "members"`);
        await queryRunner.query(`ALTER TABLE "editorial_members" ADD "areasOfExpertise" character varying`);
        await queryRunner.query(`ALTER TABLE "editorial_members" ADD "affiliation" character varying`);
        await queryRunner.query(`ALTER TABLE "editorial_members" ADD "education" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "editorial_members" ADD "location" character varying`);
        await queryRunner.query(`ALTER TABLE "editorial_members" ADD "name" character varying NOT NULL`);
    }

}
