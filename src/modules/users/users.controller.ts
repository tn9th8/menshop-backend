import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { ApiTags } from '@nestjs/swagger';
import { SkipJwt } from 'src/common/decorators/skip-jwt.decorator';

@ApiTags('Users Module')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) { }

  @Post()
  async create(@Body() createUserDto: CreateUserDto) {
    const result = await this.usersService.create(createUserDto);
    return result;
  }

  @SkipJwt()
  @Get()
  findAll(@Query() queryString: string) { // paginate: page, size
    const result = this.usersService.findAll(queryString);
    return result;
  }

  @Get('by-id/:id')
  findOne(@Param('id') id: string) {
    const user = this.usersService.findById(id);
    return user;
  }

  @Patch(':id')
  update(@Body() updateUserDto: UpdateUserDto) {
    const result = this.usersService.update(updateUserDto);
    return result;
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    const result = this.usersService.remove(id);
    return result
  }
}
