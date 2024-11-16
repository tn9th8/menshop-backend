import { Controller, Get } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ApiMessage } from 'src/common/decorators/api-message.decorator';
import { User } from 'src/common/decorators/user.decorator';
import { IAuthUser } from 'src/common/interfaces/auth-user.interface';
import { UsersService } from './users.service';

@ApiTags('Users Module for Seller Side')
@Controller('seller/users')
export class UsersControllerSeller {
  constructor(private readonly usersService: UsersService) { }

  //QUERY//
  @ApiMessage('find my profile')
  @Get('/profile')
  findOne(@User() seller: IAuthUser) {
    return this.usersService.findOwnProfile(seller);
  }
}