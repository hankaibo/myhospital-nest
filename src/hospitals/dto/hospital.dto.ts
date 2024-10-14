import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class HospitalDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  id: string;
}
