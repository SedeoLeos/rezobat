import { Injectable } from '@nestjs/common';
import { CreateContractTypeDto } from './dto/create-contrat-type.dto';
import { UpdateContractTypeDto } from './dto/update-contrat-type.dto';
import {
  ContractType,
  ContracttypeDocument,
} from './schemas/contract-type.schema';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';

@Injectable()
export class ContractTypeService {
  constructor(
    @InjectModel(ContractType.name) private model: Model<ContracttypeDocument>,
  ) {}
  async create(createContractTypeDto: CreateContractTypeDto) {
    return await new this.model({ ...createContractTypeDto }).save();
  }

  async findAll(skip = 0, limit?: number) {
    const count = await this.model.countDocuments({}).exec();
    const page_total = Math.floor((count - 1) / limit) + 1;
    const query = this.model.find().sort({ createdAt: 'desc' }).skip(skip);
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

  async update(id: string, updateContractTypeDto: UpdateContractTypeDto) {
    return await this.model.findByIdAndUpdate(id, { ...updateContractTypeDto });
  }

  async remove(id: string) {
    return await this.model.findByIdAndDelete(id).exec();
  }
}
