import { PartialType } from '@nestjs/mapped-types';
import { CreateShopDto } from './create-shop.dto';
import { IKey } from 'src/common/interfaces/index.interface';
import { IsMongoId } from 'class-validator';
import { isObjectIdMessage } from 'src/common/utils/validator.util';

export class UpdateShopDto extends PartialType(CreateShopDto) {
    @IsMongoId(isObjectIdMessage('id'))
    id: IKey;
}
