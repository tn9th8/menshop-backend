import { PartialType } from '@nestjs/mapped-types';
import { CreateStockModelDto } from './create-stock-model.dto';

export class UpdateStockModelDto extends PartialType(CreateStockModelDto) {}
