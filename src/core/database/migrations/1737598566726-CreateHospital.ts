import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateHospital1737598566726 implements MigrationInterface {
  name = 'CreateHospital1737598566726';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "hospital" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "city" character varying, "name" character varying, "code" character varying, "district" character varying, "type" character varying, "lvl" character varying, "address" character varying, "zip_code" character varying, "introduction" character varying, "lng_lat" geometry, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_10f19e0bf17ded693ea0da07d95" PRIMARY KEY ("id"))`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "hospital"`);
  }
}
