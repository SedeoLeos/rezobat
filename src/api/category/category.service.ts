import { Injectable } from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Category, CategoryDocument } from './schema/category.schema';
import { Model } from 'mongoose';

@Injectable()
export class CategoryService {
  constructor(
    @InjectModel(Category.name) private model: Model<CategoryDocument>,
  ) {}
  async create(createCategoryDto: CreateCategoryDto) {
    return await new this.model({ ...createCategoryDto }).save();
  }

  async findAll() {
    return await this.model.find().populate('sub_category').exec();
  }

  async findOne(id: string) {
    const data = await this.model.findOne({ _id: id }).exec();
    console.log(data, id);
    return data;
  }

  async update(id: string, updateCategoryDto: UpdateCategoryDto) {
    return await this.model.findByIdAndUpdate(id, updateCategoryDto).exec();
  }

  async remove(id: string) {
    return await this.model.findByIdAndDelete(id);
  }
}
