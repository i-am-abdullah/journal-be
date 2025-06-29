import { MigrationInterface, QueryRunner } from "typeorm";

export class Initv11747799739448 implements MigrationInterface {
    name = 'Initv11747799739448'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" RENAME COLUMN "orcid_id" TO "orc_id"`);
        await queryRunner.query(`ALTER TABLE "users" RENAME CONSTRAINT "UQ_81c0978e1cd3403cc6d9e1566dd" TO "UQ_06cfafb00f003895ac0d9a997cd"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" RENAME CONSTRAINT "UQ_06cfafb00f003895ac0d9a997cd" TO "UQ_81c0978e1cd3403cc6d9e1566dd"`);
        await queryRunner.query(`ALTER TABLE "users" RENAME COLUMN "orc_id" TO "orcid_id"`);
    }

}
