import { Controller, Get } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ApiMessage } from 'src/common/decorators/api-message.decorator';
import { NeedsService } from './needs.service';
import { SkipJwt } from 'src/common/decorators/skip-jwt.decorator';

@ApiTags('Needs Module For Admin Side')
@Controller('client/needs')
export class NeedsControllerClient {
  constructor(private readonly needsService: NeedsService) { }

  //QUERY//
  @ApiMessage('find tree needs')
  @Get('/tree')
  @SkipJwt()
  findTree() {
    return this.needsService.findTree();
  }

}
