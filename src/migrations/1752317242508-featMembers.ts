import { MigrationInterface, QueryRunner } from "typeorm";

export class FeatMembers1752317242508 implements MigrationInterface {
    name = 'FeatMembers1752317242508'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "editorial_members" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, "location" character varying, "education" character varying NOT NULL, "affiliation" character varying, "areasOfExpertise" character varying, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_5a61eb10cb55e6079371bff0587" PRIMARY KEY ("id"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "editorial_members"`);
    }

}
