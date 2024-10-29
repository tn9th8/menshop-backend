
import { IsObjectId } from 'src/common/decorators/is-object-id.decorator';
import { IKey } from 'src/common/interfaces/index.interface';
import { CreateCategoryDto } from './create-category.dto';
import { PartialType } from '@nestjs/mapped-types';
import { isObjectIdMessage } from 'src/common/utils/validator.util';
import { CategoryLevelEnum } from 'src/common/enums/category.enum';

export class UpdateCategoryDto extends PartialType(CreateCategoryDto) {
    @IsObjectId(isObjectIdMessage('id'))
    id: IKey;
}

export interface IUpdateCategory extends UpdateCategoryDto {
    level: CategoryLevelEnum;
}
