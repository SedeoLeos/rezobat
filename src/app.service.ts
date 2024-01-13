import { Injectable } from '@nestjs/common';
import * as argon from 'argon2';
import { Connection } from 'mongoose';
import { User } from './api/user/schemas/user.schema';
import { Contract } from './api/contract/schemas/contract.schema';
import { InjectConnection } from '@nestjs/mongoose';
import { Job } from './api/job/schema/job.schema';
@Injectable()
export class AppService {
  constructor(@InjectConnection() private readonly connection: Connection) {}
  getHello(): Promise<string> {
    return argon.hash('1234');
  }
  async statistique() {
    const providers = await this.connection
      .model(User.name)
      .countDocuments({ role: 'Provider' });
    const clients = await this.connection
      .model(User.name)
      .countDocuments({ role: 'Client' });
    const admins = await this.connection
      .model(User.name)
      .countDocuments({ role: 'Admin' });
    const contracts = await this.connection
      .model(Contract.name)
      .countDocuments();
    const jobs = await this.connection.model(Job.name).countDocuments();
    return {
      contracts,
      clients,
      providers,
      admins,
      jobs,
    };
  }
}
