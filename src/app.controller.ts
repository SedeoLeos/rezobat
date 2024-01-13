import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service.js';
import { Public } from './core/decorators/public.decorator.js';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  @Public()
  getHello(): Promise<string> {
    return this.appService.getHello();
  }
  @Get('stats-counts')
  getStatic() {
    return this.appService.statistique();
  }
}
