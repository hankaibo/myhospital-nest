import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Query,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { HospitalsService } from './hospitals.service';
import { CreateHospitalDto } from './dto/create-hospital.dto';
import { UpdateHospitalDto } from './dto/update-hospital.dto';
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';
import { Hospital } from './domain/hospital';
import { Roles } from '../roles/roles.decorator';
import { RoleEnum } from '../roles/roles.enum';
import { RolesGuard } from '../roles/roles.guard';
import { AuthGuard } from '@nestjs/passport';
import {
  InfinityPaginationResponse,
  InfinityPaginationResponseDto,
} from '../utils/dto/infinity-pagination-response.dto';
import {
  PaginationResponse,
  PaginationResponseDto,
} from '../utils/dto/pagination-response.dto';
import { infinityPagination } from '../utils/infinity-pagination';
import { pagination } from '../utils/pagination';
import { FindAllHospitalsDto } from './dto/find-all-hospitals.dto';

@ApiTags('Hospitals')
@ApiBearerAuth()
@Controller({
  path: 'hospitals',
  version: '1',
})
export class HospitalsController {
  constructor(private readonly hospitalsService: HospitalsService) {}

  @Post()
  @ApiCreatedResponse({
    type: Hospital,
  })
  create(@Body() createHospitalDto: CreateHospitalDto) {
    return this.hospitalsService.create(createHospitalDto);
  }

  @Get()
  @ApiOkResponse({
    type: InfinityPaginationResponse(Hospital),
  })
  @Roles(RoleEnum.admin)
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @HttpCode(HttpStatus.OK)
  async findAll(
    @Query() query: FindAllHospitalsDto,
  ): Promise<InfinityPaginationResponseDto<Hospital>> {
    const page = query?.page ?? 1;
    let limit = query?.limit ?? 10;
    if (limit > 50) {
      limit = 50;
    }

    return infinityPagination(
      await this.hospitalsService.findAllWithPagination({
        paginationOptions: {
          page,
          limit,
        },
      }),
      { page, limit },
    );
  }

  @Get(':id')
  @ApiParam({
    name: 'id',
    type: String,
    required: true,
  })
  @ApiOkResponse({
    type: Hospital,
  })
  @Roles(RoleEnum.admin)
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  findById(@Param('id') id: string) {
    return this.hospitalsService.findById(id);
  }

  @Patch(':id')
  @ApiParam({
    name: 'id',
    type: String,
    required: true,
  })
  @ApiOkResponse({
    type: Hospital,
  })
  @Roles(RoleEnum.admin)
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  update(
    @Param('id') id: string,
    @Body() updateHospitalDto: UpdateHospitalDto,
  ) {
    return this.hospitalsService.update(id, updateHospitalDto);
  }

  @Delete(':id')
  @ApiParam({
    name: 'id',
    type: String,
    required: true,
  })
  @Roles(RoleEnum.admin)
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  remove(@Param('id') id: string) {
    return this.hospitalsService.remove(id);
  }

  @ApiOkResponse({
    type: PaginationResponse(Hospital),
  })
  @Roles(RoleEnum.admin)
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Get('all')
  @HttpCode(HttpStatus.OK)
  async find(
    @Query() query: FindAllHospitalsDto,
  ): Promise<PaginationResponseDto<Hospital>> {
    const { page = 1, limit = 10 } = query;

    const [data, total] =
      await this.hospitalsService.findAllAndCountWithPagination({
        sortOptions: query?.sort,
        paginationOptions: {
          page,
          limit,
        },
      });
    return pagination(data, { page, limit }, total);
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  findWithCircle(@Query() query: FindAllHospitalsDto): Promise<Hospital[]> {
    const longitude = query?.longitude ?? 116.4074;
    const latitude = query?.latitude ?? 39.9042;
    const radius = query?.radius ?? 500;

    return this.hospitalsService.findByCircle({
      circleOptions: {
        longitude,
        latitude,
        radius,
      },
    });
  }
}
