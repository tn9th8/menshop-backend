import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ShopsService } from './shops.service';
import { CreateShopDto } from './dto/create-shop.dto';
import { UpdateShopDto } from './dto/update-shop.dto';
import { ApiTags } from '@nestjs/swagger';
import { AuthUserDto } from 'src/auth/dto/auth-user.dto';
import { User } from 'src/common/decorators/user.decorator';
import { ApiMessage } from 'src/common/decorators/api-message.decorator';

@ApiTags('Shops Module for Admins')
@Controller('/adm/shops')
export class ShopsControllerClient {
  constructor(private readonly shopsService: ShopsService) { }

}
