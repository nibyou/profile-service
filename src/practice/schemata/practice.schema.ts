import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { GlobalStatus } from '@nibyou/types';
import { Address } from '../../profile/schemata/profile.schema';

export type PracticeDocument = Practice & Document;

export enum PracticeAddressTypes {
  MAIN = 'MAIN',
}

export class ICD10Item {
  @Prop()
  @ApiProperty()
  code: string;

  @Prop()
  @ApiProperty()
  name: string;
}

export class Rating {
  @Prop()
  @ApiProperty()
  therapy: string;

  @Prop()
  @ApiProperty()
  stars: number;
}

export class MarketingInformation {
  @Prop()
  @ApiProperty()
  description: string;

  @Prop({ type: () => [ICD10Item] })
  @ApiProperty()
  icd10: ICD10Item[];

  @Prop()
  @ApiProperty()
  additionalTherapyTopics: string;

  @Prop({ type: () => [Rating] })
  @ApiProperty()
  ratings: Rating[];

  @Prop({ type: () => [Address] })
  @ApiProperty()
  additionalAddresses: Address[];
}

@Schema({ timestamps: true })
export class Practice {
  @Prop({ type: () => Address })
  @ApiProperty()
  address: Address;

  @Prop()
  @ApiProperty()
  name: string;

  @Prop()
  @ApiProperty()
  email: string;

  @Prop({ nullable: true })
  @ApiPropertyOptional()
  mobileNumber?: string;

  @Prop({ nullable: true })
  @ApiPropertyOptional()
  website?: string;

  @Prop({ type: () => GlobalStatus, default: GlobalStatus.ACTIVE })
  @ApiProperty()
  status: GlobalStatus;

  @Prop()
  @ApiProperty()
  logo: string;

  @Prop({ type: () => [String] })
  @ApiPropertyOptional()
  admins?: string[];

  @Prop({ type: () => MarketingInformation })
  @ApiPropertyOptional()
  marketingInformation?: MarketingInformation;

  @ApiPropertyOptional()
  meanRating: number;

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

export const PracticeSchema = SchemaFactory.createForClass(Practice);

PracticeSchema.virtual('meanRating').get(function () {
  if (this.marketingInformation == null) return 0;
  if (this.marketingInformation.ratings.length === 0) return 0;
  const ratings = this.marketingInformation.ratings;
  const sum = ratings.reduce((acc, cv) => acc + cv.stars, 0);
  return sum / ratings.length;
});
