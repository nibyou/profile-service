import { Injectable } from '@nestjs/common';
import {
  CreateMultiplePracticesReturnDto,
  CreatePracticeDto,
} from './dto/create-practice.dto';
import {
  AddRatingDto,
  UpdatePracticeAddAdminDto,
  UpdatePracticeAddMarketingInformationDto,
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
import { Practice, PracticeAddressTypes } from './schemata/practice.schema';
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
      label: PracticeAddressTypes.MAIN,
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

  async createMultiple(dto: CreatePracticeDto[]) {
    const models = await Promise.all(
      dto.map(async (p) => {
        const address: Address = {
          street: p.street,
          city: p.city,
          country: p.country,
          zipCode: p.zipCode,
          houseNumber: p.houseNumber,
          location: null,
          label: PracticeAddressTypes.MAIN,
        };

        const geoLocation = await PracticeService.getGeoLocation(
          `${address.street},${address.houseNumber},${address.zipCode},${address.city}`,
        );

        address.location = {
          type: 'Point',
          coordinates: [geoLocation.lat, geoLocation.lon],
        };

        return {
          name: p.name,
          address: address,
          email: p.email,
          mobileNumber: p.mobileNumber,
          website: p.website,
          logo: p.logo,
          admins: p.admins,
        } as Partial<Practice>;
      }),
    );

    return {
      practices: await this.practiceModel.insertMany(models),
    };
  }

  async findAll() {
    return (await this.practiceModel.find()).map((p) =>
      p.toObject({ virtuals: true }),
    );
  }

  async findOne(id: string) {
    // if patient is in therapy at this practice, allow it
    return (await this.practiceModel.findById(id).populate('admins')).toObject({
      virtuals: true,
    });
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
      label: PracticeAddressTypes.MAIN,
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

  async addMarketing(
    id: string,
    dto: UpdatePracticeAddMarketingInformationDto,
    user: AuthUser,
  ) {
    const practice = await this.practiceModel.findById(id);
    if (!AuthUser.isAdmin(user) && !practice.admins.includes(user.userId)) {
      throw new Error('You are not authorized to update this practice');
    }
    practice.marketingInformation = {
      description: dto.description,
      icd10: dto.icd10,
      additionalTherapyTopics: dto.additionalTherapyTopics ?? '',
      additionalAddresses: dto.additionalAddresses ?? [],
      ratings: [],
    };

    return practice.save();
  }

  async addRating(id: string, dto: AddRatingDto, user: AuthUser) {
    const practice = await this.practiceModel.findById(id);
    // TODO: find therapy, check if user was part of it, and save to db
    console.log(user.userId);
    /**practice.marketingInformation.ratings.push({
      stars: dto.stars,
      therapy: null,
    });

    const p = await practice.save();**/

    const p = await this.practiceModel.updateOne(
      { _id: id },
      {
        $push: {
          'marketingInformation.ratings': {
            stars: dto.stars,
            therapy: null,
          },
        },
      },
    );

    console.log(p);

    return practice.meanRating;
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
    if (response.status !== 200) {
      console.log(response.data);
      throw new Error('Could not get geo location');
    }
    const json = response.data;
    if (json.length === 0) {
      return {
        lat: 0,
        lon: 0,
      };
    }
    const lat = parseFloat(json[0].lat);
    const lon = parseFloat(json[0].lon);
    return {
      lat,
      lon,
    };
  }
}
