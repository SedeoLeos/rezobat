import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Contract, ContractDocument } from './schemas/contract.schema';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { Model } from 'mongoose';
import { CreateContractAdminDto } from './dto/create-contract.dto';
import {
  AddFileContractDto,
  UpdateContractAdminDto,
} from './dto/update-contract.dto';
import { Media } from '../media/schemas/media.schema';
const POPULATE = ['client', 'provider', 'job', 'type'];

@Injectable()
export class ContractAdminService {
  constructor(
    @InjectModel(Contract.name)
    private model: Model<ContractDocument>,
    private eventEmiter: EventEmitter2,
  ) {}
  async create(createContractDto: CreateContractAdminDto) {
    const {
      provider_id,
      client_id,
      job_id,
      type_id,
      files: filsMemory,
      ...result
    } = createContractDto;
    const type = type_id ? { _id: type_id } : {};
    const job = job_id ? { _id: job_id } : {};
    const provider = provider_id ? { _id: provider_id } : {};
    const client = client_id ? { _id: client_id } : {};
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
      console.log(client);
      console.log(provider);
      return await (
        await new this.model({
          ...result,
          files,
          client,
          provider,
          job,
          type,
        }).populate(POPULATE)
      ).save();
    }
    return await (
      await new this.model({
        ...result,
        client,
        provider,
        job,
        type,
      }).populate(POPULATE)
    ).save();
  }
  async update(id: string, updateContractDto: UpdateContractAdminDto) {
    const {
      provider_id,
      client_id,
      job_id,
      type_id,

      ...result
    } = updateContractDto;
    const contract = await this.model
      .findOne({ _id: id })
      .populate(POPULATE)
      .exec();
    if (!contract) {
      return;
    }
    const type = { _id: type_id };
    const job = { _id: job_id };
    const provider = { _id: provider_id };
    const client = client_id ? { _id: client_id } : {};

    return await this.model
      .findByIdAndUpdate(id, {
        ...result,

        client: client,
        provider,
        job,
        type,
      })
      .populate(POPULATE)
      .exec();
  }

  async findAll(skip = 0, limit?: number) {
    const count = await this.model.countDocuments({}).exec();
    const page_total = Math.floor((count - 1) / limit) + 1;
    const _query = this.model
      .find()
      .sort({ createdAt: 'desc' })
      .populate(POPULATE)
      .skip(skip);
    if (limit) {
      _query.limit(limit);
    }
    const data = await _query.exec();
    return {
      data: data,
      page_total: page_total,
      status: 200,
    };
  }

  async findOne(id: string) {
    return await this.model.findOne({ id }).exec();
  }
  async setFile(id: string, updateContratDto: AddFileContractDto) {
    const contract = await this.model
      .findOne({ _id: id })
      .populate('files')
      .exec();
    const { files: filsMemory } = updateContratDto;
    if (filsMemory) {
      const medias = filsMemory.map((file) => ({
        file: file,
        forlder: 'contract',
      }));
      for (const media of medias) {
        const filesMedia = await this.eventEmiter.emitAsync(
          'Media.created',
          media,
        );
        if (filesMedia.length == 1) {
          contract.files.push(filesMedia[0]);
        }
      }
      return this.model
        .findByIdAndUpdate(id, { ...contract })
        .populate(POPULATE)
        .exec();
    }
  }

  async remove(id: string) {
    return await this.model.findByIdAndDelete(id).exec();
  }
}
