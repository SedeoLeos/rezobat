import { Injectable } from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Category, CategoryDocument } from './schema/category.schema';
import { Model } from 'mongoose';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { isFile } from 'nestjs-form-data';

@Injectable()
export class CategoryService {
  constructor(
    @InjectModel(Category.name) private model: Model<CategoryDocument>,
    private eventEmitter: EventEmitter2,
  ) {}
  async create(createCategoryDto: CreateCategoryDto) {
    if (isFile(createCategoryDto.image)) {
      const imagePayload = await this.eventEmitter.emitAsync('Media.created', {
        file: createCategoryDto.image,
        folder: 'category',
      });
      if (!imagePayload) {
        return;
      }
      return await new this.model({
        ...createCategoryDto,
        image: imagePayload[0],
      }).save();
    }
    delete createCategoryDto.image;
    return await new this.model({
      ...createCategoryDto,
    }).save();
  }

  async findAll() {
    return await this.model.find().exec();
  }

  async findOne(id: string) {
    const data = await this.model.findOne({ _id: id }).exec();
    console.log(data, id);
    return data;
  }

  async update(id: string, updateCategoryDto: UpdateCategoryDto) {
    const found = await this.model.findOne({ _id: id }).populate('image');
    const { image: file } = updateCategoryDto;
    const { image } = found;
    if (file && isFile(file) && image) {
      const imagePayload = await this.eventEmitter.emitAsync('Media.updated', {
        old: image,
        file,
        folder: 'category',
      });
      if (!imagePayload && !imagePayload[0]) {
      }
      return await this.model
        .findByIdAndUpdate(id, { ...updateCategoryDto, image: imagePayload[0] })
        .exec();
    }
    delete updateCategoryDto.image;
    return await this.model
      .findByIdAndUpdate(id, { ...updateCategoryDto })
      .exec();
  }

  async remove(id: string) {
    return await this.model.findByIdAndDelete(id);
  }
}
