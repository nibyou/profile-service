import { Module } from '@nestjs/common';
import { PractitionerService } from './practitioner.service';
import { PractitionerController } from './practitioner.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { PractitionerSchema } from './schemata/practitioner.schema';

@Module({
  controllers: [PractitionerController],
  providers: [PractitionerService],
  imports: [
    MongooseModule.forFeature([
      { name: 'Practitioner', schema: PractitionerSchema },
    ]),
  ],
})
export class PractitionerModule {}
