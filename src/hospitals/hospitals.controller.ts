import { Controller, Get, Query, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { HospitalsService } from './hospitals.service';
import { QueryHospitalDto } from './dto/query-hospital.dto';
import { Hospital } from './domain/hospital';

@ApiTags('Hospitals')
@Controller({
  path: 'hospitals',
  version: '1',
})
export class HospitalsController {
  constructor(private readonly hospitalsService: HospitalsService) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  findWithCircle(@Query() query: QueryHospitalDto): Promise<Hospital[]> {
    return this.hospitalsService.findManyWithCircle({ circleOptions: query });
  }
}
