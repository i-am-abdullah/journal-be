import { MigrationInterface, QueryRunner } from "typeorm";

export class RemoveUniquefromContributor1752757343715 implements MigrationInterface {
    name = 'RemoveUniquefromContributor1752757343715'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "contributors" DROP CONSTRAINT "UQ_fae4b047ef153486bd3e7bcff6b"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "contributors" ADD CONSTRAINT "UQ_fae4b047ef153486bd3e7bcff6b" UNIQUE ("orcidId")`);
    }

}
