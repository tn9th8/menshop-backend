import { Body, Controller, Get, Param, Patch, Post, Query, UsePipes } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ApiMessage } from 'src/common/decorators/api-message.decorator';
import { IsPublishedEnum } from 'src/common/enums/index.enum';
import { IKey } from 'src/common/interfaces/index.interface';
import { IdParamTransform } from 'src/middleware/pipe/id-param.transform';
import { CreateNeedDto } from './dto/create-need.dto';
import { QueryNeedDto } from './dto/query-need.dto';
import { UpdateNeedDto } from './dto/update-need.dto';
import { NeedsService } from './needs.service';
import { QueryNeedTransform } from './transform/query-need.transform';

@ApiTags('Needs Module For Admin Side')
@Controller('admin/needs')
export class NeedsControllerAdmin {
  constructor(private readonly needsService: NeedsService) { }

  //CREATE//
  @ApiMessage('create a need')
  @Post()
  createOne(@Body() createNeedDto: CreateNeedDto) {
    return this.needsService.createOne(createNeedDto);
  }

  //UPDATE//
  @ApiMessage('update a need')
  @Patch()
  updateOne(@Body() updateNeedDto: UpdateNeedDto) {
    return this.needsService.updateOne(updateNeedDto);
  }

  @ApiMessage('publish a need')
  @Patch('/published/:id([a-f0-9]{24})')
  @UsePipes(IdParamTransform)
  publishOne(@Param('id') id: IKey) {
    return this.needsService.updateIsPublished(id, IsPublishedEnum.PUBLISHED);
  }

  @ApiMessage('draft (unpublished) a need')
  @Patch('/draft/:id([a-f0-9]{24})')
  @UsePipes(IdParamTransform)
  unpublishOne(@Param('id') id: IKey) {
    return this.needsService.updateIsPublished(id, IsPublishedEnum.DRAFT);
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
