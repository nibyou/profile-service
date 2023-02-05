import { Injectable } from '@nestjs/common';
import { CreatePracticeDto } from './dto/create-practice.dto';
import {
  UpdatePracticeAddAdminDto,
  UpdatePracticeAddressDto,
  UpdatePracticeDto,
  UpdatePracticeEmailDto,
  UpdatePracticeLogoDto,
  UpdatePracticeMobileNumberDto,
  UpdatePracticeNameDto,
  UpdatePracticeRemoveAdminDto,
  UpdatePracticeWebsiteDto,
} from './dto/update-practice.dto';
import { Model } from 'mongoose';
import { Practice } from './schemata/practice.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Address } from '../profile/schemata/profile.schema';
import { AuthUser } from '@nibyou/types';
import axios from 'axios';

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
    return `This action updates a #${id} practice, ${JSON.stringify(
      updatePracticeDto,
    )}`;
  }

  async updateName(id: string, dto: UpdatePracticeNameDto, user: AuthUser) {
    const name = dto.name;
    const practice = await this.practiceModel.findById(id);
    if (!AuthUser.isAdmin(user) && !practice.admins.includes(user.userId)) {
      throw new Error('You are not authorized to update this practice');
    }
    practice.name = name;
    return practice.save();
  }

  async updateEmail(id: string, dto: UpdatePracticeEmailDto, user: AuthUser) {
    const email = dto.email;
    const practice = await this.practiceModel.findById(id);
    if (!AuthUser.isAdmin(user) && !practice.admins.includes(user.userId)) {
      throw new Error('You are not authorized to update this practice');
    }
    practice.email = email;
    return practice.save();
  }

  async updateAddress(
    id: string,
    dto: UpdatePracticeAddressDto,
    user: AuthUser,
  ) {
    const practice = await this.practiceModel.findById(id);
    if (!AuthUser.isAdmin(user) && !practice.admins.includes(user.userId)) {
      throw new Error('You are not authorized to update this practice');
    }

    const address: Address = {
      street: dto.street,
      city: dto.city,
      country: dto.country,
      zipCode: dto.zipCode,
      houseNumber: dto.houseNumber,
      location: null,
    };

    const geoLocation = await PracticeService.getGeoLocation(
      `${address.street},${address.houseNumber},${address.zipCode},${address.city}`,
    );

    address.location = {
      type: 'Point',
      coordinates: [geoLocation.lat, geoLocation.lon],
    };

    practice.address = address;
    return practice.save();
  }

  async updateWebsite(
    id: string,
    dto: UpdatePracticeWebsiteDto,
    user: AuthUser,
  ) {
    const practice = await this.practiceModel.findById(id);
    if (!AuthUser.isAdmin(user) && !practice.admins.includes(user.userId)) {
      throw new Error('You are not authorized to update this practice');
    }
    practice.website = dto.website;
    return practice.save();
  }

  async updateMobileNumber(
    id: string,
    dto: UpdatePracticeMobileNumberDto,
    user: AuthUser,
  ) {
    const practice = await this.practiceModel.findById(id);
    if (!AuthUser.isAdmin(user) && !practice.admins.includes(user.userId)) {
      throw new Error('You are not authorized to update this practice');
    }
    practice.mobileNumber = dto.mobileNumber;
    return practice.save();
  }

  async addAdmin(id: string, dto: UpdatePracticeAddAdminDto, user: AuthUser) {
    const practice = await this.practiceModel.findById(id);
    if (!AuthUser.isAdmin(user) && !practice.admins.includes(user.userId)) {
      throw new Error('You are not authorized to update this practice');
    }
    practice.admins.push(dto.admin);
    return practice.save();
  }

  async removeAdmin(
    id: string,
    dto: UpdatePracticeRemoveAdminDto,
    user: AuthUser,
  ) {
    const practice = await this.practiceModel.findById(id);
    if (!AuthUser.isAdmin(user) && !practice.admins.includes(user.userId)) {
      throw new Error('You are not authorized to update this practice');
    }
    practice.admins = practice.admins.filter((admin) => admin !== dto.admin);
    return practice.save();
  }

  async updateLogo(id: string, dto: UpdatePracticeLogoDto, user: AuthUser) {
    const practice = await this.practiceModel.findById(id);
    if (!AuthUser.isAdmin(user) && !practice.admins.includes(user.userId)) {
      throw new Error('You are not authorized to update this practice');
    }
    practice.logo = dto.logo;
    return practice.save();
  }

  remove(id: string) {
    return this.practiceModel.findByIdAndRemove(id);
  }

  private static async getGeoLocation(
    address: string,
  ): Promise<{ lat: number; lon: number }> {
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
}
