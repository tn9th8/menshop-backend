import { PartialType } from '@nestjs/mapped-types';
import { CreateNeedDto } from './create-need.dto';
import { IKey } from 'src/common/interfaces/index.interface';
import { OmitType } from '@nestjs/swagger';

export class UpdateNeedDto extends PartialType(OmitType(CreateNeedDto, ['level'] as const)) {
    id: IKey
}
