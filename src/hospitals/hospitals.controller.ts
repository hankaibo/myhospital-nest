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
import { QueryHospitalsDto } from './dto/find-all-hospitals.dto';

@ApiTags('Hospitals')
@Controller({
  path: 'hospitals',
  version: '1',
})
export class HospitalsController {
  constructor(private readonly hospitalsService: HospitalsService) {}

  @Get('circle')
  @HttpCode(HttpStatus.OK)
  findWithCircle(@Query() query: QueryHospitalsDto): Promise<Hospital[]> {
    const longitude = query?.filters?.longitude ?? 116.4074;
    const latitude = query?.filters?.latitude ?? 39.9042;
    const radius = query?.filters?.radius ?? 500;

    return this.hospitalsService.findByCircle({
      circleOptions: {
        longitude,
        latitude,
        radius,
      },
    });
  }

  @ApiBearerAuth()
  @Post()
  @ApiCreatedResponse({
    type: Hospital,
  })
  @Roles(RoleEnum.admin)
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  create(@Body() createHospitalDto: CreateHospitalDto) {
    return this.hospitalsService.create(createHospitalDto);
  }

  @ApiBearerAuth()
  @ApiOkResponse({
    type: PaginationResponse(Hospital),
  })
  @Roles(RoleEnum.admin)
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Get('pagination')
  @HttpCode(HttpStatus.OK)
  async find(
    @Query() query: QueryHospitalsDto,
  ): Promise<PaginationResponseDto<Hospital>> {
    const { page = 1, limit = 10 } = query;

    const [data, total] =
      await this.hospitalsService.findAllAndCountWithPagination({
        sortOptions: query?.sort,
        filterOptions: query?.filters,
        paginationOptions: {
          page,
          limit,
        },
      });
    return pagination(data, { page, limit }, total);
  }

  @ApiBearerAuth()
  @Get()
  @ApiOkResponse({
    type: InfinityPaginationResponse(Hospital),
  })
  @Roles(RoleEnum.admin)
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @HttpCode(HttpStatus.OK)
  async findAll(
    @Query() query: QueryHospitalsDto,
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

  @ApiBearerAuth()
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

  @ApiBearerAuth()
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

  @ApiBearerAuth()
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

  @ApiCreatedResponse({
    type: Hospital,
  })
  @Roles(RoleEnum.admin)
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Post(':id/copy')
  @HttpCode(HttpStatus.CREATED)
  copy(@Param('id') id: Hospital['id']): Promise<Hospital> {
    return this.hospitalsService.copy(id);
  }

  @ApiBearerAuth()
  @Roles(RoleEnum.admin)
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Post('copy')
  copyAll(): Promise<void> {
    return this.hospitalsService.copyAll();
  }

  @ApiCreatedResponse({
    type: Hospital,
  })
  @Roles(RoleEnum.admin)
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Get('sync/:name')
  @HttpCode(HttpStatus.OK)
  sync(@Param('name') name: string): Promise<void> {
    return this.hospitalsService.sync(name);
  }
}
