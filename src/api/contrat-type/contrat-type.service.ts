import { Injectable } from '@nestjs/common';
import { CreateContratTypeDto } from './dto/create-contrat-type.dto';
import { UpdateContratTypeDto } from './dto/update-contrat-type.dto';
import {
  ContratType,
  ContrattypeDocument,
} from './schemas/contrat-type.schema';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';

@Injectable()
export class ContratTypeService {
  constructor(
    @InjectModel(ContratType.name) private model: Model<ContrattypeDocument>,
  ) {}
  async create(createContratTypeDto: CreateContratTypeDto) {
    return await new this.model({ ...createContratTypeDto }).save();
  }

  async findAll(skip = 0, limit?: number) {
    const count = await this.model.countDocuments({}).exec();
    const page_total = Math.floor((count - 1) / limit) + 1;
    const query = this.model.find().skip(skip);
    if (limit) {
      query.limit(limit);
    }
    const data = await query.exec();
    return {
      data: data,
      page_total: page_total,
      status: 200,
    };
  }

  async findOne(id: string) {
    return await this.model.findOne({ id }).exec();
  }

  async update(id: string, updateSContratTypeDto: UpdateContratTypeDto) {
    return await this.model.findByIdAndUpdate(id, { ...updateSContratTypeDto });
  }

  async remove(id: string) {
    return await this.model.findByIdAndDelete(id).exec();
  }
}
