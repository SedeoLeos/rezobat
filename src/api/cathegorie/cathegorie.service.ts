import { Injectable } from '@nestjs/common';
import { CreateCathegorieDto } from './dto/create-cathegorie.dto';
import { UpdateCathegorieDto } from './dto/update-cathegorie.dto';

@Injectable()
export class CathegorieService {
  create(createCathegorieDto: CreateCathegorieDto) {
    return 'This action adds a new cathegorie';
  }

  findAll() {
    return `This action returns all cathegorie`;
  }

  findOne(id: number) {
    return `This action returns a #${id} cathegorie`;
  }

  update(id: number, updateCathegorieDto: UpdateCathegorieDto) {
    return `This action updates a #${id} cathegorie`;
  }

  remove(id: number) {
    return `This action removes a #${id} cathegorie`;
  }
}
