import { Controller, Get, Render, UseGuards } from '@nestjs/common';
import { AppService } from './app.service';
import { SkipJwt } from './common/decorators/skip-jwt.decorator';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Hello World')
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) { }

  @SkipJwt()
  @Get('hello')
  getHello(): string {
    console.log("xxx");

    return this.appService.getHello();
  }

  @SkipJwt()
  @Get('mvc')
  @Render('index')
  getMVC() { }
}
