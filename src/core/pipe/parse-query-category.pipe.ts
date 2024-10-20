import { Injectable, PipeTransform } from '@nestjs/common';
import { CategoryLevelEnum } from 'src/common/enums/category.enum';
import { CategorySortEnum } from 'src/common/enums/query.enum';
import { convertToObjetId } from 'src/common/utils/mongo.util';

@Injectable()
export class ParseQueryCategoryPipe implements PipeTransform {
    transform(query: any) {
        const { page, limit, sort, level, isOnBar, child } = query;

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

        let isOnBarObj: object;
        if (isOnBar) {
            if (isOnBar === 'true') {
                isOnBarObj = { isOnBar: true };
            } else if (isOnBar === 'false') {
                isOnBarObj = { isOnBar: false };
            } else {
                isOnBarObj = {};
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
            ...isOnBarObj,
            ...childIdObj
        }
        return transformed;
    }
}
