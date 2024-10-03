import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { SoftDeleteModel } from 'soft-delete-plugin-mongoose';
import { CreateAttributesDto } from '../../dto/create-attributes.dto';
import { Clock, IClock } from './schema/clock.schema';

@Injectable()
export class ClocksRepo {
    constructor(
        @InjectModel(Clock.name)
        private readonly clockModel: SoftDeleteModel<IClock>
    ) { }

    async create(createAttributesDto: CreateAttributesDto): Promise<IClock> {
        const result = await this.clockModel.create(createAttributesDto);
        return result;
    }
}
