import { MigrationInterface, QueryRunner } from 'typeorm';

export class UpdateHospitalTable1724551657368 implements MigrationInterface {
  name = 'UpdateHospitalTable1724551657368';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "hospital" ALTER COLUMN "district" DROP NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "hospital" ALTER COLUMN "type" DROP NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "hospital" ALTER COLUMN "address" DROP NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "hospital" ALTER COLUMN "zip_code" DROP NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "hospital" ALTER COLUMN "introduction" DROP NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "hospital" ALTER COLUMN "lng_lat" DROP NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "hospital" ALTER COLUMN "lng_lat" TYPE geometry`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "hospital" ALTER COLUMN "lng_lat" TYPE geometry(GEOMETRY,0)`,
    );
    await queryRunner.query(
      `ALTER TABLE "hospital" ALTER COLUMN "lng_lat" SET NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "hospital" ALTER COLUMN "introduction" SET NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "hospital" ALTER COLUMN "zip_code" SET NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "hospital" ALTER COLUMN "address" SET NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "hospital" ALTER COLUMN "type" SET NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "hospital" ALTER COLUMN "district" SET NOT NULL`,
    );
  }
}
