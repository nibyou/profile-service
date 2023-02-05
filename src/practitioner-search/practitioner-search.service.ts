import { Injectable } from '@nestjs/common';
import { GeolocationDto } from './dto/geolocation.dto';
import axios from 'axios';
import { GeoLocation } from '../profile/schemata/profile.schema';
import { InjectModel } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';
import { Model } from 'mongoose';
import { Practice } from '../practice/schemata/practice.schema';

export type GL = { type: 'Point'; coordinates: [number, number] };

@Injectable()
export class PractitionerSearchService {
  constructor(
    @InjectModel('Practice') private readonly practiceModel: Model<Practice>,
  ) {}
  async getGeoLocation(address: string): Promise<GeolocationDto> {
    const response = await axios.get(
      `https://geocode.maps.co/search?q=${address}`,
    );
    const json = response.data;
    const lat = parseFloat(json[0].lat);
    const lon = parseFloat(json[0].lon);
    return {
      lat,
      lon,
    };
  }

  async getGeoNear(
    loc: GeoLocation,
    sphereKm: number,
    query?: Record<any, any>,
    limit?: number,
    skip?: number,
  ) {
    const pipeline: mongoose.PipelineStage[] = [
      {
        $geoNear: {
          near: loc as GL,
          distanceField: 'dist.calculated',
          maxDistance: sphereKm * 1000, // distance is in meters
          includeLocs: 'dist.location',
          spherical: true,
          query: query || {},
        },
      },
    ];

    if (skip) {
      pipeline.push({
        $skip: skip,
      });
    }

    if (limit) {
      pipeline.push({
        $limit: limit,
      });
    }

    console.log(pipeline);
    return this.practiceModel.aggregate(pipeline);
  }
}
