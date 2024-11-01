import { BadRequestException, Injectable, NotFoundException, PipeTransform } from '@nestjs/common';
import { isExistMessage, isObjectIdMessage, notEmptyMessage, notFoundIdMessage } from 'src/common/utils/exception.util';
import { cleanNullishAttrs } from 'src/common/utils/index.util';
import { toObjetId } from 'src/common/utils/mongo.util';
import { trim } from 'src/common/utils/validator.util';
import { CategoriesRepository } from '../categories.repository';
import { IUpdateCategory, UpdateCategoryDto } from '../dto/update-category.dto';

@Injectable()
export class UpdatedCategoryTransform implements PipeTransform {
    constructor(private readonly cateRepo: CategoriesRepository) { }

    async transform(value: UpdateCategoryDto) {
        let { id, name, description, attributes, specifications, children, parent } = value;

        //id: objectId, get level
        id = toObjetId(id);
        if (!id) {
            throw new BadRequestException(isObjectIdMessage('id param', id));
        }
        const { level } = await this.cateRepo.findLeanById(id, ['level']) || { level: null };
        if (!level) {
            throw new NotFoundException(notFoundIdMessage('id param', id));
        }

        //trim name, not empty, not exist
        name = trim(name);
        if (!name) {
            throw new BadRequestException(notEmptyMessage('name'));
        }
        if (await this.cateRepo.isExistByQueryAndExcludeId({ name }, id)) {
            throw new BadRequestException(isExistMessage('name'));
        }

        //description: trim
        description = trim(description);

        //children, parent to objectId
        parent = toObjetId(parent);
        parent = await this.cateRepo.isExistById(parent) ? parent : null;

        if (!Array.isArray(children)) {
            children = null;
        }
        else {
            children = await Promise.all(children.map(async child => {
                child = toObjetId(child);
                if (!child) { return null; }
                const isExist = await this.cateRepo.isExistById(child);
                return isExist ? child : null;
            }));
            children = children.filter(Boolean); //[]
        }

        //attributes, specifications: each is not empty
        if (!Array.isArray(attributes)) {
            attributes = null;
        }
        else {
            attributes = await Promise.all(attributes.map(async attr => {
                attr = trim(attr);
                if (!attr) { return null; }
                return attr;
            }));
            attributes = attributes.filter(Boolean); //[]
        }

        if (!Array.isArray(specifications)) {
            specifications = null;
        }
        else {
            specifications = await Promise.all(specifications.map(async spec => {
                spec = trim(spec);
                if (!spec) { return null; }
                return spec;
            }));
            specifications = specifications.filter(Boolean); //[]
        }

        const cleaned: IUpdateCategory = cleanNullishAttrs(
            { id, name, description, attributes, specifications, children, parent, level });
        return cleaned;
    }
}