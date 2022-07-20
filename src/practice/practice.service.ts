import { Injectable } from '@nestjs/common';
import { CreatePracticeDto } from './dto/create-practice.dto';
import { UpdatePracticeDto } from './dto/update-practice.dto';
import { Model } from 'mongoose';
import { Practice } from './schemata/practice.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Address } from '../profile/schemata/profile.schema';
import fetch from 'node-fetch';
import { AuthUser } from '@nibyou/types';

@Injectable()
export class PracticeService {
  constructor(
    @InjectModel('Practice') private readonly practiceModel: Model<Practice>,
  ) {}

  async create(createPracticeDto: CreatePracticeDto, user: AuthUser) {
    const address: Address = {
      street: createPracticeDto.street,
      city: createPracticeDto.city,
      country: createPracticeDto.country,
      zipCode: createPracticeDto.zipCode,
      houseNumber: createPracticeDto.houseNumber,
      location: null,
    };

    const geoLocation = await PracticeService.getGeoLocation(
      `${address.street},${address.houseNumber},${address.zipCode},${address.city}`,
    );

    address.location = {
      type: 'Point',
      coordinates: [geoLocation.lat, geoLocation.lon],
    };

    const practice: Partial<Practice> = {
      name: createPracticeDto.name,
      address: address,
      email: createPracticeDto.email,
      mobileNumber: createPracticeDto.mobileNumber,
      website: createPracticeDto.website,
      logo: createPracticeDto.logo,
      admins: AuthUser.isAdmin(user) ? createPracticeDto.admins : [],
    };

    return this.practiceModel.create(practice);
  }

  findAll() {
    return this.practiceModel.find();
  }

  findOne(id: string) {
    // if patient is in therapy at this practice, allow it
    return this.practiceModel.findById(id).populate('admins');
  }

  findByPractitioner(practitionerId: string) {
    return this.practiceModel
      .find({
        admins: practitionerId,
      })
      .populate('admins');
  }

  update(id: string, updatePracticeDto: UpdatePracticeDto) {
    return `This action updates a #${id} practice`;
  }

  remove(id: string) {
    return this.practiceModel.findByIdAndRemove(id);
  }

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
