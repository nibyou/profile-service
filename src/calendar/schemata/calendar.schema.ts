import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Prop, Schema } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { GlobalStatus } from '@nibyou/types';
import * as mongoose from 'mongoose';

export type CalendarDocument = Calendar & Document;

export enum ParticipantType {
  PATIENT = 'PATIENT',
  PRACTITIONER = 'PRACTITIONER',
}

export class Participant {
  @Prop({ type: mongoose.Schema.Types.ObjectId })
  @ApiProperty({
    type: String,
    format: 'uuid',
  })
  id: mongoose.Schema.Types.ObjectId;
  @Prop()
  @ApiProperty({ enum: ParticipantType })
  type: ParticipantType;
}

export class EventDataGeneral {
  @Prop()
  @ApiPropertyOptional({
    type: String,
    format: 'uri',
  })
  url?: string;
  @Prop()
  @ApiPropertyOptional({
    type: String,
  })
  address: string;
  @Prop()
  @ApiPropertyOptional({
    type: String,
    format: 'uri',
  })
  econsultMeeting: string;
}

export enum EventType {
  ONE_OFF = 'ONE_OFF',
  REPEATING = 'REPEATING',
}

export class EventDataOneOff {
  @Prop()
  @ApiProperty()
  startDate: Date;
  @Prop()
  @ApiProperty()
  endDate: Date;
}

export enum RepeatType {
  DAILY = 'DAILY',
  WEEKLY = 'WEEKLY',
  MONTHLY = 'MONTHLY',
  YEARLY = 'YEARLY',
}

// https://www.rfc-editor.org/rfc/rfc5545#section-3.3.10
export class EventDataRepeating {
  @Prop()
  @ApiProperty()
  seriesStartDate: Date;
  @Prop()
  @ApiProperty()
  seriesEndDate: Date;
  @Prop()
  @ApiProperty()
  repeat: RepeatType;
  @Prop()
  @ApiProperty()
  startTime: Date;
  @Prop()
  @ApiProperty()
  endTime: Date;
  @Prop()
  @ApiProperty()
  byDay?: string;
  @Prop()
  @ApiProperty()
  byMonthDay?: string;
  @Prop()
  @ApiProperty()
  byYearDay?: string;
  @Prop()
  @ApiProperty()
  byWeekNo?: string;
  @Prop()
  @ApiProperty()
  byMonth?: string;
}

export class Event {
  @Prop()
  @ApiProperty()
  title: string;
  @Prop({ default: '' })
  @ApiProperty()
  description?: string;
  @Prop()
  @ApiPropertyOptional({ type: () => [Participant] })
  invitees?: Participant[];
  @Prop()
  @ApiProperty({ type: () => Participant })
  inviter: Participant;
  @Prop()
  @ApiProperty({ type: () => EventDataGeneral })
  eventDataGeneral: EventDataGeneral;
  @Prop()
  @ApiProperty({ enum: EventType })
  eventType: EventType;
  @Prop()
  @ApiPropertyOptional()
  eventDataOneOff?: EventDataOneOff;
  @Prop()
  @ApiPropertyOptional()
  eventDataRepeating?: EventDataRepeating;
}

@Schema({ timestamps: true })
export class Calendar {
  @Prop({ type: () => [Event] })
  @ApiProperty()
  events: Event[];
  @Prop()
  @ApiPropertyOptional()
  name?: string;
  @Prop({ type: () => GlobalStatus, default: GlobalStatus.ACTIVE })
  @ApiProperty()
  status: GlobalStatus;
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
