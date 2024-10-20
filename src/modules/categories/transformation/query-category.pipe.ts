import { Injectable, PipeTransform } from '@nestjs/common';
import { CategoryLevelEnum } from 'src/common/enums/category.enum';
import { CategorySortEnum } from 'src/common/enums/query.enum';
import { convertToObjetId } from 'src/common/utils/mongo.util';

@Injectable()
export class QueryCategoryPipe implements PipeTransform {
    transform(query: any) {
        const { page, limit, sort, level, isPublished, child } = query;

        let limitNumber: number;
        if (limit) {
            limitNumber = Number(limit) || undefined;
            // if (isNaN(limit)) {
            //     throw new BadRequestException('Invalid limit value');
            // }
        }

        let pageNumber: Number;
        if (page) {
            pageNumber = Number(page) || undefined;
        }

        let sortEnum: CategorySortEnum;
        if (sort) {
            const enumValues = Object.values(CategorySortEnum);
            if (!enumValues.includes(sort)) {
                sortEnum = undefined;
            } else {
                sortEnum = CategorySortEnum[CategorySortEnum[sort]]
            }
        }

        let levelObj: object;
        if (level) {
            const enumValues = Object.values(CategoryLevelEnum);
            if (!enumValues.includes(Number(level))) {
                levelObj = {};
            } else {
                levelObj = { level: CategoryLevelEnum[CategoryLevelEnum[level]] };
            }
        }

        let isPublishedObj: object;
        if (isPublished) {
            if (isPublished === 'true') {
                isPublishedObj = { isPublished: true };
            } else if (isPublished === 'false') {
                isPublishedObj = { isPublished: false };
            } else {
                isPublishedObj = {};
            }
        }

        let childIdObj: object;
        if (child) {
            const value = convertToObjetId(child);
            childIdObj = value ? { child: value } : {}
        }
        const transformed = {
            page: pageNumber,
            limit: limitNumber,
            sort: sortEnum,
            ...levelObj,
            ...isPublishedObj,
            ...childIdObj
        }
        return transformed;
    }
}
