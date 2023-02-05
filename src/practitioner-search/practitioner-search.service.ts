import { Injectable } from '@nestjs/common';
import { GeolocationDto } from './dto/geolocation.dto';
import axios from 'axios';
import { GeoLocation } from '../profile/schemata/profile.schema';
import { InjectModel } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';
import { Model } from 'mongoose';
import { Practice } from '../practice/schemata/practice.schema';
import Fuse from 'fuse.js';
import * as fs from 'node:fs/promises';
import { Icd10SearchDto, ICD10SearchResult } from './dto/icd10-search.dto';

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

  async fuzzySearchICD10(
    search: string,
    limit: number,
  ): Promise<Icd10SearchDto> {
    const options = {
      includeScore: true,
      keys: ['code', 'name'],
    };

    console.log('fuse:', Fuse);

    const icd10 = JSON.parse(
      await fs.readFile(__dirname + '/data/icd10gm_code_name.json', {
        encoding: 'utf-8',
      }),
    );

    const index = Fuse.parseIndex(
      JSON.parse(
        await fs.readFile(__dirname + '/data/fuse-index.json', {
          encoding: 'utf-8',
        }),
      ),
    );

    const fuse = new Fuse(icd10, options, index);

    return {
      results: fuse.search(search).slice(0, limit) as ICD10SearchResult[],
    };
  }
}
