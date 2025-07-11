import { MigrationInterface, QueryRunner } from "typeorm";

export class FeatVolume1752171606770 implements MigrationInterface {
    name = 'FeatVolume1752171606770'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "volumes" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "title" character varying NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_f3d03a6ad79006b028d3eae9e9f" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "posts" ADD "volume_id" uuid`);
        await queryRunner.query(`ALTER TABLE "posts" ADD CONSTRAINT "FK_d54580c602228bea330e190b0d5" FOREIGN KEY ("volume_id") REFERENCES "volumes"("id") ON DELETE SET NULL ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "posts" DROP CONSTRAINT "FK_d54580c602228bea330e190b0d5"`);
        await queryRunner.query(`ALTER TABLE "posts" DROP COLUMN "volume_id"`);
        await queryRunner.query(`DROP TABLE "volumes"`);
    }

}
