import { MigrationInterface, QueryRunner } from "typeorm";

export class AddedCreatedAtColinPC1752756673257 implements MigrationInterface {
    name = 'AddedCreatedAtColinPC1752756673257'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "post_contributors" ADD "createdAt" TIMESTAMP NOT NULL DEFAULT now()`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "post_contributors" DROP COLUMN "createdAt"`);
    }

}
