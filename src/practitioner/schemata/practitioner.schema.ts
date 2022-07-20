import { ApiProperty } from '@nestjs/swagger';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { GlobalStatus } from '@nibyou/types';
import { Practice } from '../../practice/schemata/practice.schema';
import * as mongoose from 'mongoose';

export type PractitionerDocument = Practitioner & Document;

export enum QualificationName {
  DIETICIAN = 'DIETICIAN',
  DIPLOMA_ECOTROPHOLOGIST = 'DIPLOMA_ECOTROPHOLOGIST',
  NUTRICIONIST = 'NUTRICIONIST',
  DIPLOMA_MEDICAL_EDUCATOR = 'DIPLOMA_MEDICAL_EDUCATOR',
  PHYSIOTHERAPIST = 'PHYSIOTHERAPIST',
  PSYCHOTHERAPIST = 'PSYCHOTHERAPIST',
  DIETCOOK = 'DIETCOOK',
  NUTRICINAL_SCIENTIST = 'NUTRICINAL_SCIENTIST',
}

export const QualificationNameArray = Object.values(QualificationName);

export class Qualification {
  @ApiProperty({ enum: QualificationNameArray })
  @Prop()
  name: QualificationName;

  @ApiProperty()
  @Prop()
  url: string;
}

export class PractitionerData {
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
  @Prop({ type: () => [Qualification] })
  careerPath: Qualification[];
}

@Schema({ timestamps: true })
export class Practitioner {
  @Prop()
  @ApiProperty()
  acceptedTerms: boolean;

  @Prop({ type: () => PractitionerData })
  @ApiProperty()
  practitionerData: PractitionerData;

  @Prop({ type: () => GlobalStatus, default: GlobalStatus.ACTIVE })
  @ApiProperty()
  status: GlobalStatus;

  @ApiProperty()
  @Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Practice' }] })
  practices: Practice[];

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

export const PractitionerSchema = SchemaFactory.createForClass(Practitioner);
