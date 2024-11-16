import { BadRequestException, Injectable, PipeTransform } from '@nestjs/common';
import { cleanNullishAttrs } from 'src/common/utils/index.util';
import { CategoriesRepository } from '../categories.repository';
import { CreateCategoryDto } from '../dto/create-category.dto';
import { trim } from 'src/common/utils/validator.util';
import { isExistMessage, notEmptyMessage } from 'src/common/utils/exception.util';
import { toObjetId } from 'src/common/utils/mongo.util';

@Injectable()
export class CreateCategoryTransform implements PipeTransform {
    constructor(private readonly cateRepo: CategoriesRepository) { }

    async transform(value: CreateCategoryDto) {
        let { name, description, level, attributes, specifications, children, parent, search } = value;

        //name: trim, not empty, not exist
        name = trim(name);
        if (!name) {
            throw new BadRequestException(notEmptyMessage('name'));
        }
        if (await this.cateRepo.isExistByQuery({ name })) {
            throw new BadRequestException(isExistMessage('name'));
        }

        //description: trim
        description = trim(description);

        //level is validated, default level 1

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

        const cleaned: CreateCategoryDto = cleanNullishAttrs(
            { name, description, level, attributes, specifications, children, parent, search });
        return cleaned;
    }
}
