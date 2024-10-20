import { ArgumentMetadata, BadRequestException, Injectable, PipeTransform } from '@nestjs/common';
import { notEmptyMessage } from 'src/common/utils/exception.util';
import { toObjetId } from 'src/common/utils/mongo.util';
import { trim } from 'src/common/utils/pipe.util';
import { CreateNeedDto } from '../dto/create-need.dto';
import { NeedsRepository } from '../needs.repository';
import { cleanNullishAttrs } from 'src/common/utils/index.util';

@Injectable()
export class CreateNeedTransform implements PipeTransform {
    constructor(private readonly needsRepository: NeedsRepository) { }

    async transform(value: CreateNeedDto, metadata: ArgumentMetadata) {
        let { name, displayName, description, children, parent } = value
        const transformed = value;

        //trim name, displayName, description
        name = trim(name); //null
        if (!name) {
            throw new BadRequestException(notEmptyMessage('name'));
        }
        transformed.name = name;

        displayName = trim(displayName); //null
        if (!displayName) {
            throw new BadRequestException(notEmptyMessage('displayName'));
        }
        transformed.displayName = displayName;

        description = trim(description)//null, ""

        //children, parent to objectId
        parent = toObjetId(parent); //null
        transformed.parent = parent;

        if (Array.isArray(children)) {
            children = await Promise.all(children.map(async child => {
                child = toObjetId(child);
                if (!child) { return null; }
                const isExist = await this.needsRepository.isExistId(child);
                return isExist ? child : null;
            }));
            children = children.filter(Boolean);
        } //[]
        else {
            children = null;
        } //item: null
        transformed.children = children;

        const cleaned: CreateNeedDto = cleanNullishAttrs(transformed);
        return cleaned;
    }
}
