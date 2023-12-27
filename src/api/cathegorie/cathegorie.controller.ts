import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { CathegorieService } from './cathegorie.service';
import { CreateCathegorieDto } from './dto/create-cathegorie.dto';
import { UpdateCathegorieDto } from './dto/update-cathegorie.dto';

@Controller('cathegorie')
export class CathegorieController {
  constructor(private readonly cathegorieService: CathegorieService) {}

  @Post()
  create(@Body() createCathegorieDto: CreateCathegorieDto) {
    return this.cathegorieService.create(createCathegorieDto);
  }

  @Get()
  findAll() {
    return this.cathegorieService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.cathegorieService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateCathegorieDto: UpdateCathegorieDto) {
    return this.cathegorieService.update(+id, updateCathegorieDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.cathegorieService.remove(+id);
  }
}
