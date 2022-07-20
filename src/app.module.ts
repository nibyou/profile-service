import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { KeycloakModule } from '@nibyou/keycloak';
import { ProfileModule } from './profile/profile.module';
import { MongooseModule, MongooseModuleOptions } from '@nestjs/mongoose';
import { PracticeModule } from './practice/practice.module';
import { PractitionerModule } from './practitioner/practitioner.module';

const mongoOptions: MongooseModuleOptions = {
  user: process.env.MONGO_USER || '',
  pass: process.env.MONGO_PASS || '',
  useNewUrlParser: true,
  dbName: process.env.MONGO_DB || '',
};

@Module({
  imports: [
    KeycloakModule,
    MongooseModule.forRoot(process.env.MONGO_URL, mongoOptions),
    ProfileModule,
    PracticeModule,
    PractitionerModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
