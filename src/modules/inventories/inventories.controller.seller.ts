import { Body, Controller, Post } from '@nestjs/common';
import { InventoriesService } from './inventories.service';
import { ApiMessage } from 'src/common/decorators/api-message.decorator';
import { AddStockToInventory } from './dto/create-inventory.dto';
import { User } from 'src/common/decorators/user.decorator';
import { IAuthUser } from 'src/common/interfaces/auth-user.interface';

@Controller('seller/inventories')
export class InventoriesControllerSeller {
  constructor(private readonly inventoriesService: InventoriesService) { }
}
