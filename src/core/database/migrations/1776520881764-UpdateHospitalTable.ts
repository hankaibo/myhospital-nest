import { MigrationInterface, QueryRunner } from 'typeorm';

export class UpdateHospitalTable1776520881764 implements MigrationInterface {
  name = 'UpdateHospitalTable1776520881764';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "hospital" ADD "deleted_at" TIMESTAMP`,
    );
    await queryRunner.query(
      `ALTER TABLE "staging_hospital_raw" ALTER COLUMN "crawled_at" SET DEFAULT now()`,
    );
    await queryRunner.query(
      `ALTER TABLE "staging_hospital_raw" ALTER COLUMN "created_at" SET DEFAULT now()`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."uq_hospital_institution_code_address_key"`,
    );
    await queryRunner.query(`ALTER TABLE "hospital" DROP COLUMN "address_key"`);
    await queryRunner.query(
      `ALTER TABLE "hospital" ADD "address_key" text GENERATED ALWAYS AS (COALESCE(UPPER(TRIM(REGEXP_REPLACE(address, '\s+', ' ', 'g'))), '')) STORED NOT NULL`,
    );
    await queryRunner.query(
      `INSERT INTO "typeorm_metadata"("database", "schema", "table", "type", "name", "value") VALUES ($1, $2, $3, $4, $5, $6)`,
      [
        'postgres',
        'public',
        'hospital',
        'GENERATED_COLUMN',
        'address_key',
        "COALESCE(UPPER(TRIM(REGEXP_REPLACE(address, '\\s+', ' ', 'g'))), '')",
      ],
    );
    await queryRunner.query(
      `CREATE UNIQUE INDEX "uq_hospital_institution_code_address_key" ON "hospital" ("institution_code", "address_key") `,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `DROP INDEX "public"."uq_hospital_institution_code_address_key"`,
    );
    await queryRunner.query(
      `DELETE FROM "typeorm_metadata" WHERE "type" = $1 AND "name" = $2 AND "database" = $3 AND "schema" = $4 AND "table" = $5`,
      ['GENERATED_COLUMN', 'address_key', 'postgres', 'public', 'hospital'],
    );
    await queryRunner.query(`ALTER TABLE "hospital" DROP COLUMN "address_key"`);
    await queryRunner.query(
      `ALTER TABLE "hospital" ADD "address_key" text NOT NULL`,
    );
    await queryRunner.query(
      `CREATE UNIQUE INDEX "uq_hospital_institution_code_address_key" ON "hospital" ("address_key", "institution_code") `,
    );
    await queryRunner.query(
      `ALTER TABLE "staging_hospital_raw" ALTER COLUMN "created_at" SET DEFAULT CURRENT_TIMESTAMP`,
    );
    await queryRunner.query(
      `ALTER TABLE "staging_hospital_raw" ALTER COLUMN "crawled_at" SET DEFAULT CURRENT_TIMESTAMP`,
    );
    await queryRunner.query(`ALTER TABLE "hospital" DROP COLUMN "deleted_at"`);
  }
}
