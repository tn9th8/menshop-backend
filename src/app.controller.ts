import { Controller, Get, UseGuards } from '@nestjs/common';
import { AppService } from './app.service';
import { SkipJwt } from './common/decorators/skip-jwt.decorator';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) { }

  @SkipJwt()
  @Get()
  getHello(): string {
    return this.appService.getHello();
  }
}
