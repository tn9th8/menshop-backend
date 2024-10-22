import { Controller, Get, Post, Body, Patch, Param, Delete, UsePipes, Query } from '@nestjs/common';
import { NeedsService } from './needs.service';
import { CreateNeedDto } from './dto/create-need.dto';
import { UpdateNeedDto } from './dto/update-need.dto';
import { CreateNeedTransform } from './transform/create-need.transform';
import { ApiMessage } from 'src/common/decorators/api-message.decorator';
import { IdParamTransform } from 'src/core/pipe/id-param.transform';
import { IKey } from 'src/common/interfaces/index.interface';
import { IsPublishedEnum } from 'src/common/enums/index.enum';
import { QueryNeedTransform } from './transform/query-need.transform';
import { QueryNeedDto } from './dto/query-need.dto';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Needs Module For Admin Side')
@Controller('admin/needs')
export class NeedsControllerAdmin {
  constructor(private readonly needsService: NeedsService) { }

  //CREATE//
  @ApiMessage('create a draft need')
  @Post('/draft')
  @UsePipes(CreateNeedTransform)
  createOne(@Body() createNeedDto: CreateNeedDto) {
    return this.needsService.createOne(createNeedDto);
  }

  //UPDATE//
  @ApiMessage('update a need')
  @Patch(':id')
  updateOne(
    @Param('id', IdParamTransform) id: IKey,
    @Body() updateNeedDto: UpdateNeedDto
  ) {
    return this.needsService.updateOne(id, updateNeedDto);
  }

  @ApiMessage('publish a need')
  @Patch('/published/:id')
  @UsePipes(IdParamTransform)
  publishOne(@Param('id') id: IKey) {
    return this.needsService.updateIsPublished(id, IsPublishedEnum.PUBLISH);
  }

  @ApiMessage('unpublish a need')
  @Patch('/unpublished/:id')
  @UsePipes(IdParamTransform)
  unpublishOne(@Param('id') id: IKey) {
    return this.needsService.updateIsPublished(id, IsPublishedEnum.UNPUBLISH);
  }

  //QUERY//
  @ApiMessage('find all draft needs')
  @Get('/draft')
  @UsePipes(QueryNeedTransform)
  findAllDraft(@Query() query: QueryNeedDto) {
    return this.needsService.findAllByQuery(query, IsPublishedEnum.DRAFT);
  }

  @ApiMessage('find all published needs')
  @Get('/published')
  @UsePipes(QueryNeedTransform)
  findAllPublished(@Query() query: QueryNeedDto) {
    return this.needsService.findAllByQuery(query, IsPublishedEnum.PUBLISHED);
  }

  @ApiMessage('find one needs')
  @Get(':id([a-f0-9]{24})')
  @UsePipes(IdParamTransform)
  findOne(@Param('id') id: IKey) {
    return this.needsService.findOneById(id);
  }
}
