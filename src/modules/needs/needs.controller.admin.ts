import { Controller, Get, Post, Body, Patch, Param, Delete, UsePipes } from '@nestjs/common';
import { NeedsService } from './needs.service';
import { CreateNeedDto } from './dto/create-need.dto';
import { UpdateNeedDto } from './dto/update-need.dto';
import { CreateNeedTransform } from './transform/create-need.transform';
import { ApiMessage } from 'src/common/decorators/api-message.decorator';

@Controller('admin/needs')
export class NeedsControllerAdmin {
  constructor(private readonly needsService: NeedsService) { }

  //CREATE//
  @ApiMessage('create a draft need for admin side')
  @Post('/draft')
  @UsePipes(CreateNeedTransform)
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
