import { Controller, Get, Param, UsePipes } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ApiMessage } from 'src/common/decorators/api-message.decorator';
import { SkipJwt } from 'src/common/decorators/skip-jwt.decorator';
import { CategoriesService } from './categories.service';
import { IdParamTransform } from 'src/middleware/pipe/id-param.transform';
import { IKey } from 'src/common/interfaces/index.interface';
import { GroupUserEnum } from 'src/common/enums/index.enum';

@ApiTags('Categories Module For Client Side')
@Controller('/client/categories')
export class CategoriesControllerClient {
  constructor(private readonly categoriesService: CategoriesService) { }

  //QUERY//
  @ApiMessage('find tree categories')
  @Get('/tree')
  @SkipJwt()
  findTree() {
    return this.categoriesService.findTree();
  }

  @ApiMessage('find one categories')
  @Get('/:id')
  @SkipJwt()
  @UsePipes(IdParamTransform)
  findOne(@Param('id') id: IKey) {
    return this.categoriesService.findOneById(id, GroupUserEnum.CLIENT);
  }


}
