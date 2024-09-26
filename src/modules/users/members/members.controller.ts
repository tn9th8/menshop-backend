import { Controller } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Users Module for Members')
@Controller('mem/users')
export class MembersController { }
