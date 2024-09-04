import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class CreateHospitalDto {
  @ApiProperty({ type: String })
  @IsNotEmpty()
  name: string | null;

  @ApiProperty({ type: String })
  @IsNotEmpty()
  code: string | null;

  @ApiProperty({ type: String })
  @IsNotEmpty()
  district: string | null;

  @ApiProperty({ type: String })
  @IsNotEmpty()
  type: string | null;

  @ApiProperty({ type: String })
  @IsNotEmpty()
  lvl: string | null;

  @ApiProperty({ type: String })
  @IsNotEmpty()
  address: string | null;

  @ApiProperty({ type: String })
  @IsNotEmpty()
  zipCode: string | null;

  @ApiProperty({ type: String })
  @IsNotEmpty()
  introduction: string | null;
}
