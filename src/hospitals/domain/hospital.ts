import { ApiProperty } from '@nestjs/swagger';

export class Hospital {
  @ApiProperty({
    type: String,
  })
  id: string;

  @ApiProperty({ type: String })
  name: string | null;

  @ApiProperty({ type: String })
  code: string | null;

  @ApiProperty({ type: String })
  district: string | null;

  @ApiProperty({ type: String })
  type: string | null;

  @ApiProperty({ type: String })
  lvl: string | null;

  @ApiProperty({ type: String })
  address: string | null;

  @ApiProperty({ type: String })
  zipCode: string | null;

  @ApiProperty({ type: String })
  introduction: string | null;

  @ApiProperty({ type: Number })
  lng: number | null;

  @ApiProperty({ type: Number })
  lat: number | null;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}
