import { PartialType } from '@nestjs/mapped-types';
import { CreateDiscountDto } from './create-discount.dto';
import { IKey } from 'src/common/interfaces/index.interface';
import { IsObjectId } from 'src/common/decorators/is-object-id.decorator';
import { isObjectIdMessage } from 'src/common/utils/validator.util';

export class UpdateDiscountDto extends PartialType(CreateDiscountDto) {
    @IsObjectId(isObjectIdMessage('id'))
    id: IKey;
}
