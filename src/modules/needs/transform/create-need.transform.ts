import { BadRequestException, Injectable, PipeTransform } from '@nestjs/common';
import { isExistMessage, notEmptyMessage } from 'src/common/utils/exception.util';
import { cleanNullishAttrs } from 'src/common/utils/index.util';
import { toObjetId } from 'src/common/utils/mongo.util';
import { trim } from 'src/common/utils/validator.util';
import { CreateNeedDto } from '../dto/create-need.dto';
import { NeedsRepository } from '../needs.repository';

@Injectable()
export class CreateNeedTransform implements PipeTransform {
    constructor(private readonly needsRepository: NeedsRepository) { }

    async transform(value: CreateNeedDto) {
        let { name, description, level, children, parent } = value

        //name: trim, not empty, not exist
        name = trim(name); //null
        if (!name) {
            throw new BadRequestException(notEmptyMessage('name'));
        }
        if (await this.needsRepository.isExistByQuery({ name })) {
            throw new BadRequestException(isExistMessage('name'));
        }

        //description: trim
        description = trim(description)

        //level is validated, default level 1

        //children, parent to objectId
        parent = toObjetId(parent); //null
        parent = await this.needsRepository.isExistById(parent) ? parent : null;

        if (!Array.isArray(children)) {
            children = null;
        }
        else {
            children = await Promise.all(children.map(async child => {
                child = toObjetId(child);
                if (!child) { return null; }
                const isExist = await this.needsRepository.isExistById(child);
                return isExist ? child : null;
            }));
            children = children.filter(Boolean); //[]
        }

        const cleaned: CreateNeedDto = cleanNullishAttrs({ name, description, level, children, parent });
        return cleaned;
    }
}
