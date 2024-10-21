import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { NeedsService } from './needs.service';
import { CreateNeedDto } from './dto/create-need.dto';
import { UpdateNeedDto } from './dto/update-need.dto';

@Controller('needs')
export class NeedsControllerClient {
  constructor(private readonly needsService: NeedsService) { }

  @Post()
  create(@Body() createNeedDto: CreateNeedDto) {
    return createNeedDto;
    return this.needsService.create(createNeedDto);
  }

}
