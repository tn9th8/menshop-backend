import { PartialType } from '@nestjs/mapped-types';
import { CreateCategoryDto } from './create-category.dto';
import mongoose from 'mongoose';

export class UpdateCategoryDto extends PartialType(CreateCategoryDto) {
    _id: mongoose.Types.ObjectId;
}
