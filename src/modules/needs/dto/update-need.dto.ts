import { PartialType } from '@nestjs/mapped-types';
import { OmitType } from '@nestjs/swagger';
import { IKey } from 'src/common/interfaces/index.interface';
import { CreateNeedDto } from './create-need.dto';
import { NeedLevelEnum } from 'src/common/enums/need.enum';

export class UpdateNeedDto extends PartialType(OmitType(CreateNeedDto, ['level'] as const)) {
    id: IKey;
}

export interface IUpdateNeedDto extends UpdateNeedDto {
    level: NeedLevelEnum;
}
