import { MigrationInterface, QueryRunner } from "typeorm";

export class Init1747799405074 implements MigrationInterface {
    name = 'Init1747799405074'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "categories" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, "slug" character varying NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_8b0be371d28245da6e4f4b61878" UNIQUE ("name"), CONSTRAINT "UQ_420d9f679d41281f282f5bc7d09" UNIQUE ("slug"), CONSTRAINT "PK_24dbc6126a28ff948da33e97d3b" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "contributors" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "fullName" character varying NOT NULL, "email" character varying, "affiliation" character varying, "orcidId" character varying(19), "profileUrl" text, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_fae4b047ef153486bd3e7bcff6b" UNIQUE ("orcidId"), CONSTRAINT "PK_c94ff4e6bca235dc30625c92c90" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "post_contributors" ("post_id" uuid NOT NULL, "contributor_id" uuid NOT NULL, "role" character varying NOT NULL, CONSTRAINT "PK_431a93858e75dd3f1e4d82d58e1" PRIMARY KEY ("post_id", "contributor_id"))`);
        await queryRunner.query(`CREATE TABLE "post_files" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "url" character varying NOT NULL, "post_id" uuid, CONSTRAINT "PK_3a75ee290763a3bfa3597f05f3e" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "posts" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "title" character varying NOT NULL, "slug" character varying NOT NULL, "excerpt" text, "published" boolean NOT NULL DEFAULT false, "publishedAt" TIMESTAMP, "isArchive" boolean NOT NULL DEFAULT false, "pdfUrl" character varying, "approvedByAdmin" boolean NOT NULL DEFAULT false, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "author_id" uuid NOT NULL, "category_id" uuid NOT NULL, CONSTRAINT "UQ_54ddf9075260407dcfdd7248577" UNIQUE ("slug"), CONSTRAINT "PK_2829ac61eff60fcec60d7274b9e" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "users" ADD "orcid_id" character varying(19)`);
        await queryRunner.query(`ALTER TABLE "users" ADD CONSTRAINT "UQ_81c0978e1cd3403cc6d9e1566dd" UNIQUE ("orcid_id")`);
        await queryRunner.query(`ALTER TABLE "post_contributors" ADD CONSTRAINT "FK_cb0ed522f2bb15a2ddc0721badf" FOREIGN KEY ("post_id") REFERENCES "posts"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "post_contributors" ADD CONSTRAINT "FK_831a65181badfb1cae46fbe71af" FOREIGN KEY ("contributor_id") REFERENCES "contributors"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "post_files" ADD CONSTRAINT "FK_a92645e87cb0c67c1f355db488f" FOREIGN KEY ("post_id") REFERENCES "posts"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "posts" ADD CONSTRAINT "FK_312c63be865c81b922e39c2475e" FOREIGN KEY ("author_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "posts" ADD CONSTRAINT "FK_852f266adc5d67c40405c887b49" FOREIGN KEY ("category_id") REFERENCES "categories"("id") ON DELETE SET NULL ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "posts" DROP CONSTRAINT "FK_852f266adc5d67c40405c887b49"`);
        await queryRunner.query(`ALTER TABLE "posts" DROP CONSTRAINT "FK_312c63be865c81b922e39c2475e"`);
        await queryRunner.query(`ALTER TABLE "post_files" DROP CONSTRAINT "FK_a92645e87cb0c67c1f355db488f"`);
        await queryRunner.query(`ALTER TABLE "post_contributors" DROP CONSTRAINT "FK_831a65181badfb1cae46fbe71af"`);
        await queryRunner.query(`ALTER TABLE "post_contributors" DROP CONSTRAINT "FK_cb0ed522f2bb15a2ddc0721badf"`);
        await queryRunner.query(`ALTER TABLE "users" DROP CONSTRAINT "UQ_81c0978e1cd3403cc6d9e1566dd"`);
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "orcid_id"`);
        await queryRunner.query(`DROP TABLE "posts"`);
        await queryRunner.query(`DROP TABLE "post_files"`);
        await queryRunner.query(`DROP TABLE "post_contributors"`);
        await queryRunner.query(`DROP TABLE "contributors"`);
        await queryRunner.query(`DROP TABLE "categories"`);
    }

}
