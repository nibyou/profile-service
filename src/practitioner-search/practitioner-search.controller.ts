import { Body, Controller, HttpCode } from '@nestjs/common';
import { PractitionerSearchService } from './practitioner-search.service';
import { CreateRequest } from '@nibyou/types';
import {
  GeolocationDto,
  GetGeolocationDto,
  GetNearPracticesDto,
} from './dto/geolocation.dto';
import { ApiProperty, ApiTags } from '@nestjs/swagger';
import { Practice } from '../practice/schemata/practice.schema';
import { GeoLocation } from '../profile/schemata/profile.schema';

export class Dist {
  @ApiProperty()
  calculated: number;
  @ApiProperty()
  location: GeoLocation;
}
export class PracticesNearYou extends Practice {
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
    returnType: [PracticesNearYou],
  })
  @HttpCode(200)
  findNearPractices(@Body() dto: GetNearPracticesDto) {
    return this.practitionerSearchService.getGeoNear(
      dto.location,
      dto.sphereKm,
      dto.query,
      dto.limit,
      dto.skip,
    );
  }
}
