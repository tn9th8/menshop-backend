import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { TypesService } from './types.service';
import { CreateTypeDto } from './dto/create-type.dto';
import { UpdateTypeDto } from './dto/update-type.dto';
import { User } from 'src/common/decorators/user.decorator';
import { AuthUserDto } from 'src/auth/dto/auth-user.dto';
import { ApiMessage } from 'src/common/decorators/api-message.decorator';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Types Module for Admins')
@Controller('/adm/types')
export class TypesController {
  constructor(private readonly typesService: TypesService) { }

  // CREATE //
  /**
   * @desc create a type
   * @param { Dto } createTypeDto
   * @param { Request.user} user
   * @returns { JSON }
   */
  @ApiMessage('create a type')
  @Post()
  create(
    @Body() createTypeDto: CreateTypeDto,
    @User() user: AuthUserDto
  ) {
    return this.typesService.create(createTypeDto);
  }
  // END CREATE //

  @Get()
  findAll() {
    return this.typesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.typesService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateTypeDto: UpdateTypeDto) {
    return this.typesService.update(+id, updateTypeDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.typesService.remove(+id);
  }
}
