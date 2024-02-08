import { Injectable } from '@nestjs/common';
import { CreateContractDto } from './dto/create-contract.dto';
import {
  AddFileContractDto,
  UpdateContractDto,
  UpdateContractStatusDto,
} from './dto/update-contract.dto';
import { InjectModel } from '@nestjs/mongoose';
import {
  Contract,
  ContractDocument,
  statusContractArray,
} from './schemas/contract.schema';
import { FilterQuery, Model, Types } from 'mongoose';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { User } from '../user/schemas/user.schema';
import { Media } from '../media/schemas/media.schema';
import { ContractPaginationParams } from './dto/paginate-contract.dto';
import {
  ContractStatus,
  ContractStatusDocument,
} from './schemas/contract-status.schema';

const POPULATE = ['client', 'provider', 'job', 'type', 'statuses'];

@Injectable()
export class ContractService {
  constructor(
    @InjectModel(Contract.name)
    private model: Model<ContractDocument>,
    @InjectModel(ContractStatus.name)
    private contractStatusModel: Model<ContractStatusDocument>,
    private eventEmiter: EventEmitter2,
  ) {}
  async create(createContractDto: CreateContractDto, user: User) {
    const {
      provider_id,
      job_id,
      type_id,
      files: filsMemory,
      ...rest
    } = createContractDto;

    const data = {
      client: user._id ?? user.id,
      provider: provider_id,
      job: job_id,
      type: type_id,
      ...rest,
    } as any;

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
      data.files = files;
    }

    const contract = await this.model.create({ ...data, isClientRead: true });
    await this.contractStatusModel.create({
      status: 'En Cours',
      contract: contract._id,
    });

    return contract;
  }

  async findAll(
    user: User,
    { skip = 0, limit, status, isNotRead = false }: ContractPaginationParams,
  ) {
    const { id, role } = user;
    const query: FilterQuery<Contract> =
      role == 'Client' || role == 'Provider'
        ? { [role.toLowerCase()]: new Types.ObjectId(id) }
        : {};
    if (status) {
      query.status = status;
    }
    if (isNotRead) {
      if (role == 'Client') {
        query.isClientRead = false;
      } else {
        query.isArtisantRead = false;
      }
    }
    const count = await this.model.countDocuments({}).exec();
    const page_total = Math.floor((count - 1) / limit) + 1;
    const _query = this.model
      .find({ ...query })
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
    return await this.model
      .findOne({ _id: new Types.ObjectId(id) })
      .populate(POPULATE)
      .exec();
  }

  async update(user: User, id: string, updateContratDto: UpdateContractDto) {
    const name = user.role.toLowerCase();
    const contract = await this.model
      .findOne({ _id: id, [name]: { _id: user.id } })
      .exec();
    if (!contract) {
      return;
    }
    const { provider_id, job_id, type_id, ...result } = updateContratDto;
    const type = { _id: type_id };
    const job = { _id: job_id };
    const provider = { _id: provider_id };

    return await (
      await this.model
        .findByIdAndUpdate(
          id,
          {
            ...result,
            provider,
            job,
            type,
            isClientRead: true,
          },
          { new: true },
        )
        .populate(POPULATE)
    ).save();
  }
  async readContract(user: User, id: string) {
    const name = user.role.toLowerCase();
    const contract = await this.model
      .findOne({ _id: id, [name]: { _id: user.id } })
      .exec();
    if (!contract) {
      return;
    }
    const data =
      user.role == 'Client' ? { isClientRead: true } : { isArtisantRead: true };
    return await (
      await this.model
        .findByIdAndUpdate(
          id,
          {
            ...data,
          },
          { new: true },
        )
        .populate(POPULATE)
    ).save();
  }
  async statusUpdate(
    id: string,
    updateContratStatusDto: UpdateContractStatusDto,
  ) {
    const existingContract = await this.model
      .findOne({ _id: id })
      .populate(POPULATE)
      .exec();
    if (!existingContract) {
      return;
    }
    const { status } = updateContratStatusDto;
    /**
     * TODO: I let this to you :)
     * Enforce status verification rules.
     * E.g: A cancelled contract cannot be 'En cours' again...
     */
    if (status == existingContract.status) {
      return existingContract;
    }
    const [contract] = await Promise.all([
      this.model.findOneAndUpdate(
        {
          _id: new Types.ObjectId(id),
        },
        {
          $set: {
            status,
            isClientRead: false,
            isArtisantRead: true,
          },
        },
        {
          populate: POPULATE,
          new: true,
        },
      ),
      this.contractStatusModel.create({
        status,
        contract: existingContract._id,
      }),
    ]);
    return contract;
  }
  async notReadCount(user: User) {
    const { id, role } = user;
    const query: FilterQuery<Contract> =
      role == 'Client' || role == 'Provider'
        ? { [role.toLowerCase()]: new Types.ObjectId(id) }
        : {};

    if (role == 'Client') {
      query.isClientRead = false;
    } else {
      query.isArtisantRead = false;
    }
    const count = await this.model.countDocuments({ ...query }).exec();
    return { count };
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

  /**
   * Get the user contracts stats (counts by status).
   */
  async getUserStats(user: User) {
    const { id: userId, role } = user;
    const query: FilterQuery<Contract> =
      role == 'Client' || role == 'Provider'
        ? { [role.toLowerCase()]: new Types.ObjectId(userId) }
        : {};

    const counts = await Promise.all(
      statusContractArray.map(async (status) => {
        const count = await this.model.countDocuments({ status, ...query });
        return { [status]: count };
      }),
    );

    return counts.reduce((acc, curr) => {
      for (const key in curr) {
        acc[key] = curr[key];
      }

      return acc;
    }, {});
  }

  async getInProgressCount(user: User) {
    const { id: userId, role } = user;
    const query: FilterQuery<Contract> =
      role == 'Client' || role == 'Provider'
        ? {
            [role.toLowerCase()]: new Types.ObjectId(userId),
            status: 'En Cours',
          }
        : {};

    return await this.model.countDocuments(query);
  }
}
