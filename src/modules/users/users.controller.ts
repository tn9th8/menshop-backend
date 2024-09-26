import { Body, Controller, Delete, Get, Param, Patch, Post, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ApiMessage } from 'src/common/decorators/api-message.decorator';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UsersService } from './users.service';
import { SkipJwt } from 'src/common/decorators/skip-jwt.decorator';

@ApiTags('Users Module for Admins')
@Controller('adm/users')
export class UsersController {
  constructor(private readonly usersService: UsersService) { }

  @Post()
  @ApiMessage('Create a user')
  async create(@Body() createUserDto: CreateUserDto) {
    const result = await this.usersService.create(createUserDto);
    return result;
  }

  @Get()
  @ApiMessage('Fetch a user with pagination')
  findAll(@Query() queryString: string) { // paginate: page, size
    const result = this.usersService.findAll(queryString);
    return result;
  }

  @Get(':id([a-f0-9]{24})')
  @ApiMessage('Fetch a user by id')
  findOne(@Param('id') id: string) {
    const user = this.usersService.findById(id);
    return user;
  }

  @Patch()
  @ApiMessage('Update a user')
  update(@Body() updateUserDto: UpdateUserDto) {
    const result = this.usersService.update(updateUserDto);
    return result;
  }

  @Delete(':id')
  @ApiMessage('Delete a user')
  remove(@Param('id') id: string) {
    const result = this.usersService.remove(id);
    return result
  }
}