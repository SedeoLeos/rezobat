import { Module } from '@nestjs/common';
import { CathegorieService } from './cathegorie.service';
import { CathegorieController } from './cathegorie.controller';

@Module({
  controllers: [CathegorieController],
  providers: [CathegorieService],
})
export class CathegorieModule {}
