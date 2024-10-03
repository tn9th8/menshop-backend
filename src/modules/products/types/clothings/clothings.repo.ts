import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { SoftDeleteModel } from 'soft-delete-plugin-mongoose';
import { CreateAttributesDto } from '../../dto/create-attributes.dto';
import { Clothing, IClothing } from './schema/clothing.schema';

@Injectable()
export class ClothingsRepo {
    constructor(
        @InjectModel(Clothing.name)
        private readonly clothingModel: SoftDeleteModel<IClothing>
    ) { }

    async create(createAttributesDto: CreateAttributesDto): Promise<IClothing> {
        const result = await this.clothingModel.create(createAttributesDto);
        return result;
    }
}
