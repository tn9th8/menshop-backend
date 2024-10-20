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

  @Get()
  findAll() {
    return this.needsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.needsService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateNeedDto: UpdateNeedDto) {
    return this.needsService.update(+id, updateNeedDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.needsService.remove(+id);
  }
}
