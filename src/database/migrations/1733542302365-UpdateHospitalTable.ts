import { MigrationInterface, QueryRunner } from 'typeorm';

export class UpdateHospitalTable1733542302365 implements MigrationInterface {
  name = 'UpdateHospitalTable1733542302365';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "hospital" ADD "city" character varying`,
    );
    await queryRunner.query(
      `ALTER TABLE "hospital" ALTER COLUMN "lng_lat" TYPE geometry`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "hospital" ALTER COLUMN "lng_lat" TYPE geometry(GEOMETRY,0)`,
    );
    await queryRunner.query(`ALTER TABLE "hospital" DROP COLUMN "city"`);
  }
}
