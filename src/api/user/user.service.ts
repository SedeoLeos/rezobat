import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User, UserDocument } from './schemas/user.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name) private readonly model: Model<UserDocument>,
  ) {}
  async create(createUserDto: CreateUserDto) {
    return await new this.model({ ...createUserDto }).save();
  }

  async findAll() {
    return await this.model.find().exec();
  }

  async findOne(id: string) {
    return await this.model.findOne({ id });
  }
  async findBy(email: string) {
    return await this.model.findOne({ email });
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    return await this.model.findByIdAndUpdate(id, updateUserDto).exec();
  }
  async remove(id: string) {
    return await this.model.findByIdAndDelete(id).exec();
  }
}
