import { Controller, Get } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ApiMessage } from 'src/common/decorators/api-message.decorator';
import { SkipJwt } from 'src/common/decorators/skip-jwt.decorator';
import { CategoriesService } from './categories.service';

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

}
