import { MigrationInterface, QueryRunner } from 'typeorm';

export class UpdateHospitalTable1725937996657 implements MigrationInterface {
  name = 'UpdateHospitalTable1725937996657';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "hospital" ALTER COLUMN "name" DROP NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "hospital" ALTER COLUMN "code" DROP NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "hospital" ALTER COLUMN "lvl" DROP NOT NULL`,
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
      `ALTER TABLE "hospital" ALTER COLUMN "lvl" SET NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "hospital" ALTER COLUMN "code" SET NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "hospital" ALTER COLUMN "name" SET NOT NULL`,
    );
  }
}
