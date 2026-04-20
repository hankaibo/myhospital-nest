import { MigrationInterface, QueryRunner } from 'typeorm';

export class InitialTable1776655748956 implements MigrationInterface {
  name = 'InitialTable1776655748956';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "role" ("id" integer NOT NULL, "name" character varying NOT NULL, CONSTRAINT "PK_b36bcfe02fc8de3c57a8b2391c2" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "status" ("id" integer NOT NULL, "name" character varying NOT NULL, CONSTRAINT "PK_e12743a7086ec826733f54e1d95" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "file" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "path" character varying NOT NULL, CONSTRAINT "PK_36b46d232307066b3a2c9ea3a1d" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "user" ("id" SERIAL NOT NULL, "email" character varying, "password" character varying, "provider" character varying NOT NULL DEFAULT 'email', "socialId" character varying, "firstName" character varying, "lastName" character varying, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "photoId" uuid, "roleId" integer, "statusId" integer, CONSTRAINT "UQ_e12875dfb3b1d92d7d7c5377e22" UNIQUE ("email"), CONSTRAINT "REL_75e2be4ce11d447ef43be0e374" UNIQUE ("photoId"), CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_9bd2fe7a8e694dedc4ec2f666f" ON "user" ("socialId") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_58e4dbff0e1a32a9bdc861bb29" ON "user" ("firstName") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_f0e1b4ecdca13b177e2e3a0613" ON "user" ("lastName") `,
    );
    await queryRunner.query(
      `CREATE TABLE "staging_hospital_raw" ("id" BIGSERIAL NOT NULL, "crawl_batch_id" uuid NOT NULL, "source_spider" character varying(50) NOT NULL, "source_method" character varying(20) NOT NULL DEFAULT 'api', "institution_code" character varying(30), "name" character varying(255), "address" text, "region_code" character varying(20), "city" character varying(50), "district" character varying(50), "raw_payload" jsonb, "normalized_payload" jsonb NOT NULL, "sync_status" character varying(20) NOT NULL DEFAULT 'pending', "sync_error" text, "crawled_at" TIMESTAMP NOT NULL DEFAULT now(), "synced_at" TIMESTAMP, "created_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_bfc3d71432b13acefbefd81135a" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "idx_staging_hospital_raw_batch_id" ON "staging_hospital_raw" ("crawl_batch_id") `,
    );
    await queryRunner.query(
      `CREATE INDEX "idx_staging_hospital_raw_institution_code" ON "staging_hospital_raw" ("institution_code") `,
    );
    await queryRunner.query(
      `CREATE INDEX "idx_staging_hospital_raw_sync_status" ON "staging_hospital_raw" ("sync_status") `,
    );
    await queryRunner.query(
      `CREATE INDEX "idx_staging_hospital_raw_crawled_at" ON "staging_hospital_raw" ("crawled_at") `,
    );
    await queryRunner.query(
      `INSERT INTO "typeorm_metadata"("database", "schema", "table", "type", "name", "value") VALUES ($1, $2, $3, $4, $5, $6)`,
      [
        'postgres',
        'public',
        'hospital',
        'GENERATED_COLUMN',
        'address_key',
        "COALESCE(UPPER(TRIM(REGEXP_REPLACE(address, '[[:space:]]+', ' ', 'g'))), '')",
      ],
    );
    await queryRunner.query(
      `CREATE TABLE "hospital" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "institution_code" character varying(30) NOT NULL, "name" character varying(255) NOT NULL, "type_code" character varying(20), "type_name" character varying(100), "level_code" character varying(10), "level_name" character varying(50), "hospital_grade_code" character varying(10), "address" text, "region_code" character varying(20), "city" character varying(50), "district" character varying(50), "lat" numeric(12,8), "lng" numeric(12,8), "lng_lat" geography(Point,4326), "social_credit_code" character varying(30), "nature" character varying(10), "electronic_insurance_enabled" boolean, "business_capability_levels" jsonb, "zip_code" character varying(10), "introduction" text, "source_method" character varying(20) NOT NULL DEFAULT 'api', "raw_payload" jsonb, "address_valid" boolean NOT NULL DEFAULT true, "address_key" text GENERATED ALWAYS AS (COALESCE(UPPER(TRIM(REGEXP_REPLACE(address, '[[:space:]]+', ' ', 'g'))), '')) STORED NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, CONSTRAINT "PK_10f19e0bf17ded693ea0da07d95" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "idx_hospital_name" ON "hospital" ("name") `,
    );
    await queryRunner.query(
      `CREATE INDEX "idx_hospital_deleted_at" ON "hospital" ("deleted_at") `,
    );
    await queryRunner.query(
      `CREATE INDEX "idx_hospital_region_code" ON "hospital" ("region_code") `,
    );
    await queryRunner.query(
      `CREATE UNIQUE INDEX "uq_hospital_institution_code_address_key" ON "hospital" ("institution_code", "address_key") `,
    );
    await queryRunner.query(
      `CREATE TABLE "hospital_chronic_disease" ("id" SERIAL NOT NULL, "institution_code" character varying(30) NOT NULL, "disease_code" character varying(20) NOT NULL, "disease_name" character varying(200), "created_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_a812c041d28fcb9d4dea69d8ab2" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE UNIQUE INDEX "uq_hospital_chronic_disease_institution_code_disease_code" ON "hospital_chronic_disease" ("institution_code", "disease_code") `,
    );
    await queryRunner.query(
      `CREATE TABLE "hospital_address_geocoding" ("id" SERIAL NOT NULL, "hospital_id" uuid NOT NULL, "geocoding_confidence" character varying(20), "geocoding_poi_type" character varying(50), "geocoding_multiple" boolean NOT NULL DEFAULT false, "original_address" text, "additional_addresses" jsonb, "geocoding_failed" boolean NOT NULL DEFAULT false, "geocoding_error" text, "created_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_49e96884cfa9a311b75e8d93a45" UNIQUE ("hospital_id"), CONSTRAINT "REL_49e96884cfa9a311b75e8d93a4" UNIQUE ("hospital_id"), CONSTRAINT "PK_b1f3d166033c9994cb35e18fd8b" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "session" ("id" SERIAL NOT NULL, "hash" character varying NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "userId" integer, CONSTRAINT "PK_f55da76ac1c3ac420f444d2ff11" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_3d2f174ef04fb312fdebd0ddc5" ON "session" ("userId") `,
    );
    await queryRunner.query(
      `ALTER TABLE "user" ADD CONSTRAINT "FK_75e2be4ce11d447ef43be0e374f" FOREIGN KEY ("photoId") REFERENCES "file"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "user" ADD CONSTRAINT "FK_c28e52f758e7bbc53828db92194" FOREIGN KEY ("roleId") REFERENCES "role"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "user" ADD CONSTRAINT "FK_dc18daa696860586ba4667a9d31" FOREIGN KEY ("statusId") REFERENCES "status"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "hospital_address_geocoding" ADD CONSTRAINT "FK_49e96884cfa9a311b75e8d93a45" FOREIGN KEY ("hospital_id") REFERENCES "hospital"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "session" ADD CONSTRAINT "FK_3d2f174ef04fb312fdebd0ddc53" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "session" DROP CONSTRAINT "FK_3d2f174ef04fb312fdebd0ddc53"`,
    );
    await queryRunner.query(
      `ALTER TABLE "hospital_address_geocoding" DROP CONSTRAINT "FK_49e96884cfa9a311b75e8d93a45"`,
    );
    await queryRunner.query(
      `ALTER TABLE "user" DROP CONSTRAINT "FK_dc18daa696860586ba4667a9d31"`,
    );
    await queryRunner.query(
      `ALTER TABLE "user" DROP CONSTRAINT "FK_c28e52f758e7bbc53828db92194"`,
    );
    await queryRunner.query(
      `ALTER TABLE "user" DROP CONSTRAINT "FK_75e2be4ce11d447ef43be0e374f"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_3d2f174ef04fb312fdebd0ddc5"`,
    );
    await queryRunner.query(`DROP TABLE "session"`);
    await queryRunner.query(`DROP TABLE "hospital_address_geocoding"`);
    await queryRunner.query(
      `DROP INDEX "public"."uq_hospital_chronic_disease_institution_code_disease_code"`,
    );
    await queryRunner.query(`DROP TABLE "hospital_chronic_disease"`);
    await queryRunner.query(
      `DROP INDEX "public"."uq_hospital_institution_code_address_key"`,
    );
    await queryRunner.query(`DROP INDEX "public"."idx_hospital_region_code"`);
    await queryRunner.query(`DROP INDEX "public"."idx_hospital_deleted_at"`);
    await queryRunner.query(`DROP INDEX "public"."idx_hospital_name"`);
    await queryRunner.query(`DROP TABLE "hospital"`);
    await queryRunner.query(
      `DELETE FROM "typeorm_metadata" WHERE "type" = $1 AND "name" = $2 AND "database" = $3 AND "schema" = $4 AND "table" = $5`,
      ['GENERATED_COLUMN', 'address_key', 'postgres', 'public', 'hospital'],
    );
    await queryRunner.query(
      `DROP INDEX "public"."idx_staging_hospital_raw_crawled_at"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."idx_staging_hospital_raw_sync_status"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."idx_staging_hospital_raw_institution_code"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."idx_staging_hospital_raw_batch_id"`,
    );
    await queryRunner.query(`DROP TABLE "staging_hospital_raw"`);
    await queryRunner.query(
      `DROP INDEX "public"."IDX_f0e1b4ecdca13b177e2e3a0613"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_58e4dbff0e1a32a9bdc861bb29"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_9bd2fe7a8e694dedc4ec2f666f"`,
    );
    await queryRunner.query(`DROP TABLE "user"`);
    await queryRunner.query(`DROP TABLE "file"`);
    await queryRunner.query(`DROP TABLE "status"`);
    await queryRunner.query(`DROP TABLE "role"`);
  }
}
