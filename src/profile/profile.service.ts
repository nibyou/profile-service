import { Injectable } from '@nestjs/common';
import { CreateProfileDto } from './dto/create-profile.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';

import {
  Address,
  GeoLocation,
  PersonalData,
  Profile,
} from './schemata/profile.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

export type ProfileImageUrl = {
  url: string;
  s3url: string;
};

@Injectable()
export class ProfileService {
  constructor(
    @InjectModel('Profile') private readonly profileModel: Model<Profile>,
  ) {}

  async create(createProfileDto: CreateProfileDto): Promise<Profile> {
    const address: Address = {
      street: createProfileDto.street,
      houseNumber: createProfileDto.houseNumber,
      zipCode: createProfileDto.zipCode,
      city: createProfileDto.city,
      country: createProfileDto.country,
      phoneNumber: createProfileDto.phoneNumber,
      location: null,
    };

    const geoLocation = await ProfileService.getGeoLocation(
      `${address.street},${address.houseNumber},${address.zipCode},${address.city}`,
    );

    address.location = {
      type: 'Point',
      coordinates: [geoLocation.lat, geoLocation.lon],
    } as GeoLocation;

    const personalData: PersonalData = {
      title: createProfileDto.title,
      salutation: createProfileDto.salutation,
      firstName: createProfileDto.firstName,
      lastName: createProfileDto.lastName,
      birthDate: new Date(createProfileDto.birthDate),
      sex: createProfileDto.sex,
      gender: createProfileDto.gender,
      healthInsuranceInstitute: createProfileDto.healthInsuranceInstitute,
      healthInsuranceNumber: createProfileDto.healthInsuranceNumber,
    };

    const profile = {
      acceptedTerms: createProfileDto.acceptedTerms,
      personalData,
      address,
      profileImage: createProfileDto.profileImage,
    };

    return this.profileModel.create(profile);
  }

  findAll() {
    return this.profileModel.find();
  }

  findOne(id: string) {
    return this.profileModel.findOne({ _id: id });
  }

  update(id: string, updateProfileDto: UpdateProfileDto) {
    return `This action updates a #${id} profile`;
  }

  remove(id: string) {
    return `This action removes a #${id} profile`;
  }

  private static async getGeoLocation(
    address: string,
  ): Promise<{ lat: number; lon: number }> {
    const response = await fetch(`https://geocode.maps.co/search?q=${address}`);
    const json = await response.json();
    console.log(json);
    const lat = parseFloat(json[0].lat);
    const lon = parseFloat(json[0].lon);
    return {
      lat,
      lon,
    };
  }
}
