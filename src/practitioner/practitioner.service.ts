import { Injectable } from '@nestjs/common';
import { CreatePractitionerDto } from './dto/create-practitioner.dto';
import { UpdatePractitionerDto } from './dto/update-practitioner.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Practitioner, PractitionerData } from './schemata/practitioner.schema';

@Injectable()
export class PractitionerService {
  constructor(
    @InjectModel('Practitioner')
    private readonly practitionerModel: Model<Practitioner>,
  ) {}

  create(createPractitionerDto: CreatePractitionerDto) {
    const practitionerData: PractitionerData = {
      salutation: createPractitionerDto.salutation,
      title: createPractitionerDto.title,
      firstName: createPractitionerDto.firstName,
      lastName: createPractitionerDto.lastName,
      careerPath: createPractitionerDto.careerPath,
    };

    const practitioner: Partial<Practitioner> = {
      practitionerData,
      acceptedTerms: createPractitionerDto.acceptedTerms,
      profileImage: createPractitionerDto.profileImage,
      practices: createPractitionerDto.practices as any,
    };

    return this.practitionerModel.create(practitioner);
  }

  findAll() {
    return this.practitionerModel.find();
  }

  findOne(id: string) {
    return this.practitionerModel
      .findOne({ _id: id })
      .populate({ path: 'practices' });
  }

  findByPractice(practiceId: string) {
    return this.practitionerModel.find({
      practices: practiceId,
    });
  }

  update(id: number, updatePractitionerDto: UpdatePractitionerDto) {
    return `This action updates a #${id} practitioner`;
  }

  remove(id: string) {
    return this.practitionerModel.findByIdAndRemove(id);
  }
}
