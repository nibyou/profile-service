import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { GeoLocation } from '../../profile/schemata/profile.schema';

export class GetGeolocationDto {
  @ApiProperty()
  address: string;
}

export class GeolocationDto {
  @ApiProperty()
  lat: number;
  @ApiProperty()
  lon: number;
}

export class GetNearPracticesDto {
  @ApiProperty()
  location: GeoLocation;
  @ApiProperty()
  sphereKm: number;
  @ApiPropertyOptional({
    type: Object,
  })
  query?: Record<string, unknown>;
  @ApiPropertyOptional()
  limit?: number;
  @ApiPropertyOptional()
  skip?: number;
}
