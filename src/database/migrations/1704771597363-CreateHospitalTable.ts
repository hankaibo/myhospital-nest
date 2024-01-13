import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateHospitalTable1704771597363 implements MigrationInterface {
  name = 'CreateHospitalTable1704771597363';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "hospital" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, "code" character varying NOT NULL, "district" character varying NOT NULL, "type" character varying NOT NULL, "lvl" character varying NOT NULL, "address" character varying NOT NULL, "zip_code" character varying NOT NULL, "introduction" character varying NOT NULL, "lng_lat" geometry NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, CONSTRAINT "PK_10f19e0bf17ded693ea0da07d95" PRIMARY KEY ("id"))`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "hospital"`);
  }
}
