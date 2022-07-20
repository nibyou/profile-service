import { Module } from '@nestjs/common';
import { PracticeService } from './practice.service';
import { PracticeController } from './practice.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { PracticeSchema } from './schemata/practice.schema';

@Module({
  controllers: [PracticeController],
  providers: [PracticeService],
  imports: [
    MongooseModule.forFeature([{ name: 'Practice', schema: PracticeSchema }]),
  ],
})
export class PracticeModule {}
