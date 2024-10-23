import { ArgumentMetadata, BadRequestException, Injectable, NotFoundException, PipeTransform } from '@nestjs/common';
import { isExistMessage, isObjectIdMessage, notEmptyMessage, notFoundIdMessage } from 'src/common/utils/exception.util';
import { toObjetId } from 'src/common/utils/mongo.util';
import { trim } from 'src/common/utils/pipe.util';
import { CreateNeedDto } from '../dto/create-need.dto';
import { NeedsRepository } from '../needs.repository';
import { cleanNullishAttrs } from 'src/common/utils/index.util';
import { IUpdateNeedDto, UpdateNeedDto } from '../dto/update-need.dto';
import { IKey } from 'src/common/interfaces/index.interface';
import { NeedLevelEnum } from 'src/common/enums/need.enum';

@Injectable()
export class UpdateNeedTransform {
    constructor(private readonly needsRepository: NeedsRepository) { }

    async transform(value: UpdateNeedDto) {
        let { id, name, description, children, parent } = value
        const transformed = value;

        //id: objectId, get level
        id = toObjetId(id);
        if (!id) {
            throw new BadRequestException(isObjectIdMessage('id param', id));
        }
        const foundNeed = await this.needsRepository.findLeanById(id, ['level'])
        if (!foundNeed) {
            throw new NotFoundException(notFoundIdMessage('id param', id));
        }
        const { level } = foundNeed;


        //trim name, not empty, not exist
        name = trim(name);
        if (!name) {
            throw new BadRequestException(notEmptyMessage('name'));
        }
        if (await this.needsRepository.isExistByQueryAndExcludeId({ name }, id)) {
            throw new BadRequestException(isExistMessage('name'));
        }
        transformed.name = name;

        //description: trim
        description = trim(description)//null, ""
        transformed.description = description;

        //children, parent to objectId
        parent = toObjetId(parent); //null
        parent = await this.needsRepository.isExistById(parent) ? parent : null;
        transformed.parent = parent;

        if (Array.isArray(children)) {
            children = await Promise.all(children.map(async child => {
                child = toObjetId(child);
                if (!child) { return null; }
                const isExist = await this.needsRepository.isExistById(child);
                return isExist ? child : null;
            }));
            children = children.filter(Boolean);
        } //[]
        else {
            children = null;
        } //item: null
        transformed.children = children;

        const cleaned: IUpdateNeedDto = cleanNullishAttrs({ ...transformed, level });
        return cleaned;
    }
}
