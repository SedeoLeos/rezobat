import { Injectable } from '@nestjs/common';
import { CreateSubCategoryDto } from './dto/create-sub-category.dto';
import { UpdateSubCategoryDto } from './dto/update-sub-category.dto';
import { InjectModel } from '@nestjs/mongoose';
import {
  SubCategory,
  SubCategoryDocument,
} from './schemas/sub-category.schema';
import { Model } from 'mongoose';

@Injectable()
export class SubCategoryService {
  constructor(
    @InjectModel(SubCategory.name) private model: Model<SubCategoryDocument>,
  ) {}
  async create(createSubCategoryDto: CreateSubCategoryDto) {
    return await new this.model({ ...createSubCategoryDto }).save();
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

  async update(id: string, updateSubCategoryDto: UpdateSubCategoryDto) {
    return await this.model.findByIdAndUpdate(id, { ...updateSubCategoryDto });
  }

  async remove(id: string) {
    return await this.model.findByIdAndDelete(id).exec();
  }
}
