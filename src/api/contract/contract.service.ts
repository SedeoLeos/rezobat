import { Injectable } from '@nestjs/common';
import {
  CreateContractAdminDto,
  CreateContractDto,
} from './dto/create-contract.dto';
import {
  AddFileContractDto,
  UpdateContractDto,
} from './dto/update-contract.dto';
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
      job_id,
      type_id,
      files: filsMemory,
      ...result
    } = createContractDto;
    const type = { _id: type_id };
    const job = { _id: job_id };
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
          job,
          type,
        }).populate(['client', 'provider', 'job', 'type'])
      ).save();
    }
    return await new this.model({
      ...result,
      provider,
      job,
      type,
    }).save();
  }
  async createAdmin(createContractDto: CreateContractAdminDto) {
    const {
      provider_id,
      client_id,
      job_id,
      type_id,
      files: filsMemory,
      ...result
    } = createContractDto;
    const type = { _id: type_id };
    const job = { _id: job_id };
    const provider = { _id: provider_id };
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

      return await (
        await new this.model({
          ...result,
          files,
          client: client,
          provider,
          job,
          type,
        }).populate(['client', 'provider', 'job', 'type'])
      ).save();
    }
    return await new this.model({
      ...result,
      provider,
      job,
      type,
    }).save();
  }

  async findAll(user: User, skip = 0, limit?: number) {
    const { _id, role } = user;
    const query =
      role == 'Client' || role == 'Provider'
        ? { [role.toLowerCase()]: { _id } }
        : {};
    const count = await this.model.countDocuments({}).exec();
    const page_total = Math.floor((count - 1) / limit) + 1;
    const _query = this.model
      .find({ ...query })
      .populate(['client', 'provider', 'job', 'sub_category'])
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

  async update(id: string, updateContratDto: UpdateContractDto) {
    const contract = await this.model.findOne({ _id: id }).exec();
    if (!contract) {
      return;
    }
    const { provider_id, job_id, type_id, ...result } = updateContratDto;
    const type = { _id: type_id };
    const job = { _id: job_id };
    const provider = { _id: provider_id };

    return await (
      await this.model
        .findByIdAndUpdate(id, {
          ...result,
          provider,
          job,
          type,
        })
        .populate(['client', 'provider', 'job', 'sub_category'])
    ).save();
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
        .populate(['client', 'provider', 'category', 'sub_category'])
        .exec();
    }
  }

  async remove(id: string) {
    return await this.model.findByIdAndDelete(id).exec();
  }
}
