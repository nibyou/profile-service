import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { GlobalStatus } from '@nibyou/types';
import { Address } from '../../profile/schemata/profile.schema';

export type PracticeDocument = Practice & Document;

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
