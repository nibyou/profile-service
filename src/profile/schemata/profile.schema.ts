import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { GlobalStatus } from '@nibyou/types';

export type ProfileDocument = Profile & Document;

export class GeoLocation {
  @ApiProperty({ type: [Number] })
  @Prop([Number])
  coordinates: number[];

  @ApiProperty()
  @Prop({ enum: ['Point'], default: 'Point', required: true })
  type: string;
}

export class PersonalData {
  @ApiProperty()
  @Prop()
  salutation: string;

  @ApiProperty()
  @Prop()
  title: string;

  @ApiProperty()
  @Prop()
  firstName: string;

  @ApiProperty()
  @Prop()
  lastName: string;

  @ApiProperty()
  @Prop()
  birthDate: Date;

  @ApiProperty()
  @Prop()
  sex: string;

  @ApiProperty()
  @Prop()
  gender: string;

  @ApiProperty()
  @Prop()
  healthInsuranceNumber: string;

  @ApiProperty()
  @Prop()
  healthInsuranceInstitute: string;
}

export class Address {
  @ApiProperty()
  @Prop()
  street: string;

  @ApiProperty()
  @Prop()
  houseNumber: string;

  @ApiProperty()
  @Prop()
  zipCode: string;

  @ApiProperty()
  @Prop()
  city: string;

  @ApiProperty()
  @Prop()
  country: string;

  @ApiPropertyOptional()
  @Prop({ nullable: true })
  phoneNumber?: string;

  @ApiProperty()
  @Prop({ type: () => GeoLocation, index: '2dsphere' })
  location: GeoLocation;
}

@Schema({ timestamps: true })
export class Profile {
  @Prop()
  @ApiProperty()
  acceptedTerms: boolean;

  @Prop({ type: () => PersonalData })
  @ApiProperty()
  personalData: PersonalData;

  @Prop({ type: () => Address })
  @ApiProperty()
  address: Address;

  @Prop({ type: () => GlobalStatus, default: GlobalStatus.ACTIVE })
  @ApiProperty()
  status: GlobalStatus;

  @Prop()
  @ApiProperty()
  profileImage: string;

  @ApiProperty({
    type: String,
    format: 'uuid',
  })
  _id: string;

  @Prop()
  @ApiProperty()
  createdAt: Date;

  @Prop()
  @ApiProperty()
  updatedAt: Date;
}

export const ProfileSchema = SchemaFactory.createForClass(Profile);
