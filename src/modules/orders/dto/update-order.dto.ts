import { PartialType } from '@nestjs/mapped-types';
import { CreateOrderDto } from './create-order.dto';
import { IKey } from 'src/common/interfaces/index.interface';

export class UpdateOrderDto //extends PartialType(CreateOrderDto) 
{
    _id: IKey;
    status: string; //pending, shipping, completed, cancelled
}
