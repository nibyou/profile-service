import { Injectable } from '@nestjs/common';

@Injectable()
export class PractitionerSearchService {
  private static async getGeoLocation(
    address: string,
  ): Promise<{ lat: number; lon: number }> {
    const response = await fetch(`https://geocode.maps.co/search?q=${address}`);
    const json = await response.json();
    const lat = json[0].lat;
    const lon = json[0].lon;
    return {
      lat,
      lon,
    };
  }
}
