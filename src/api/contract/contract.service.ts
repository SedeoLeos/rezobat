import { Injectable } from '@nestjs/common';
import { CreateContractDto } from './dto/create-contract.dto';
import { UpdateContractDto } from './dto/update-contract.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Contract, ContractDocument } from './schemas/contract.schema';
import { Model } from 'mongoose';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { User } from '../user/schemas/user.schema';
import { Media } from '../media/schemas/media.schema';

@Injectable()
export class ContractService {
  constructor(
    @InjectModel(Contract.name)
    private model: Model<ContractDocument>,
    private eventEmiter: EventEmitter2,
  ) {}
  async create(createContractDto: CreateContractDto, user: User) {
    const {
      provider_id,
      category_id,
      sub_category_id,
      files: filsMemory,
      ...result
    } = createContractDto;
    const sub_category = { _id: sub_category_id };
    const category = { _id: category_id };
    const provider = { _id: provider_id };
    if (filsMemory) {
      const medias = filsMemory.map((file) => ({
        file: file,
        forlder: 'contract',
      }));
      const files: Media[] = [];
      for (const media of medias) {
        const filesMedia = await this.eventEmiter.emitAsync(
          'Media.created',
          media,
        );
        if (filesMedia.length == 1) {
          files.push(filesMedia[0]);
        }
      }

      return await (
        await new this.model({
          ...result,
          files,
          client: user,
          provider,
          category,
          sub_category,
        }).populate(['client', 'provider', 'category', 'sub_category'])
      ).save();
    }
    return await new this.model({
      ...result,
      provider,
      category,
      sub_category,
    }).save();
  }

  async findAll() {
    return await this.model
      .find()
      .populate(['client', 'provider', 'category', 'sub_category'])
      .exec();
  }

  async findOne(id: string) {
    return await this.model.findOne({ id }).exec();
  }

  update(id: string, updateContratDto: UpdateContractDto) {
    return this.model.findByIdAndUpdate(id, updateContratDto);
  }

  async remove(id: string) {
    return await this.model.findByIdAndDelete(id).exec();
  }
}
