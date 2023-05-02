import { Body, Controller, HttpCode, Query } from '@nestjs/common';
import { PractitionerSearchService } from './practitioner-search.service';
import { CreateRequest, ReadRequest } from '@nibyou/types';
import {
  GeolocationDto,
  GetGeolocationDto,
  GetNearPracticesDto,
} from './dto/geolocation.dto';
import { ApiProperty, ApiTags } from '@nestjs/swagger';
import { Practice } from '../practice/schemata/practice.schema';
import { GeoLocation } from '../profile/schemata/profile.schema';
import {
  GetIcd10SearchResultDto,
  Icd10SearchDto,
} from './dto/icd10-search.dto';

export class Dist {
  @ApiProperty()
  calculated: number;
  @ApiProperty()
  location: GeoLocation;
}
export class PracticeNearYou extends Practice {
  @ApiProperty()
  dist: Dist;
}

@Controller('practitioner-search')
@ApiTags('practitioners-search')
export class PractitionerSearchController {
  constructor(
    private readonly practitionerSearchService: PractitionerSearchService,
  ) {}

  @CreateRequest({
    path: '/geolocate',
    operationId: 'geolocate',
    returnType: GeolocationDto,
    roles: false,
    summary: 'Get coordinates from an address string',
  })
  @HttpCode(200)
  getGeoLocation(@Body() dto: GetGeolocationDto) {
    return this.practitionerSearchService.getGeoLocation(dto.address);
  }

  @CreateRequest({
    path: '/findNearPractices',
    operationId: 'findNearPractices',
    roles: false,
    summary: '',
    returnType: [PracticeNearYou],
  })
  findNearPractices(@Body() dto: GetNearPracticesDto) {
    return this.practitionerSearchService.getGeoNear(
      dto.location,
      dto.sphereKm,
      dto.query,
      dto.limit,
      dto.skip,
    );
  }

  @ReadRequest({
    path: '/icd10match',
    operationId: 'icd10match',
    roles: false,
    summary: 'Get ICD 10 matches by fuzzy search',
    returnType: Icd10SearchDto,
  })
  @HttpCode(200)
  getIcdReq(@Query() q: GetIcd10SearchResultDto) {
    return this.practitionerSearchService.fuzzySearchICD10(q.search, q.limit);
  }
}
