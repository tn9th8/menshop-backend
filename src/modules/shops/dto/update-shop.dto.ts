import { PartialType } from '@nestjs/mapped-types';
import { CreateShopDto } from './create-shop.dto';
import { IKey } from 'src/common/interfaces/index.interface';

export class UpdateShopDto extends PartialType(CreateShopDto) {
    id: IKey;
}
