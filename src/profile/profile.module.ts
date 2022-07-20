import { Module } from '@nestjs/common';
import { ProfileService } from './profile.service';
import { ProfileController } from './profile.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { ProfileSchema } from './schemata/profile.schema';

@Module({
  controllers: [ProfileController],
  providers: [ProfileService],
  imports: [
    MongooseModule.forFeature([{ name: 'Profile', schema: ProfileSchema }]),
  ],
})
export class ProfileModule {}
