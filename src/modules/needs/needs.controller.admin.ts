import { Controller, Get, Post, Body, Patch, Param, Delete, UsePipes, Query } from '@nestjs/common';
import { NeedsService } from './needs.service';
import { CreateNeedDto } from './dto/create-need.dto';
import { UpdateNeedDto } from './dto/update-need.dto';
import { CreateNeedTransform } from './transform/create-need.transform';
import { ApiMessage } from 'src/common/decorators/api-message.decorator';
import { IdParamTransform } from 'src/core/pipe/id-param.transform';
import { IKey } from 'src/common/interfaces/index.interface';
import { IsPublishedEnum } from 'src/common/enums/index.enum';

@Controller('admin/needs')
export class NeedsControllerAdmin {
  constructor(private readonly needsService: NeedsService) { }

  //CREATE//
  @ApiMessage('create a draft need for admin side')
  @Post('/draft')
  @UsePipes(CreateNeedTransform)
  create(@Body() createNeedDto: CreateNeedDto) {
    return this.needsService.create(createNeedDto);
  }

  //UPDATE//
  @ApiMessage('publish a need for admin side')
  @Patch('/published/:id')
  @UsePipes(IdParamTransform)
  publishOne(@Param('id') id: IKey) {
    return this.needsService.updateIsPublished(id, IsPublishedEnum.PUBLISH);
  }

  @ApiMessage('publish a need for admin side')
  @Patch('/unpublished/:id')
  @UsePipes(IdParamTransform)
  unpublishOne(@Param('id') id: IKey) {
    return this.needsService.updateIsPublished(id, IsPublishedEnum.UNPUBLISH);
  }

  //QUERY//
  @Get()
  findAll(@Query() queryString: any) {
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

}
