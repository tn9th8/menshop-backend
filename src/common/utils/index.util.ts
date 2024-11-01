import { BadRequestException } from "@nestjs/common";
import { isGreaterMessage, isRequiredMessage, isTruthyMessage, notEmptyMessage } from "./exception.util";
import { IPageQuery } from "../interfaces/query.interface";
import { SortEnum } from "../enums/index.enum";

export const toPageQuery = (query: IPageQuery) => {
    let { page, limit, sort } = query;
    [page, limit] = toNumbers([page, limit]);
    sort = toEnum(sort, SortEnum);
    return { page, limit, sort };
}

export const trim = (value: string): string | "" | null => {
    //check !falsy, because null.trim() => bug
    if (!value) return null;
    const clean = value.trim();
    return clean;
}
export const trims = (items: string[]): string[] | ''[] | null[] => {
    items = items.map((item) => trim(item));
    return items;
}

/**
 * is !'', if not throw exception not empty
 * pass each null, undefined
 * @param items
 * @param names
 */
export const isNotEmptyOrException = (items: any[], names: string[]) => {
    items.map((item, index) => {
        if (item === '')
            throw new BadRequestException(notEmptyMessage(names[index]));
    });
}

/**
 * default isGreaterThan 0
 * pass each null, undefined
 * @param items
 * @param names
 * @param oppositeItem
 */
export const isGreaterOrException = (items: any[], names: string[], oppositeItem = 0) => {
    items = items.map((item, index) => {
        if (item === null || item === undefined || isNaN(item))
            return null;
        if (!(item > oppositeItem)) {
            //case: item is null, undefine, NaN => item chuyển thành 0 để so sánh
            throw new BadRequestException(isGreaterMessage(names[index], 0));
        }
        return item;
    });
    return items;
}
export const toNumbers = (items: number[]): number[] | null[] => {
    items = items.map((item) => toNumber(item));
    return items;
}
export const toNumber = (item: any): number => {
    return +item || null; //failure +value is NaN => null
}

/**
 * startDate > endDate
 * startDate, endDate >= today
 * pass each null, undefined
 * @param array : [startDate, endDate]: Date[]
 * @param names : string
 * @returns [startDate, endDate]
 */
export const isDatePairOrException = ([startDate, endDate]: Date[], names: string) => {
    //startDate, endDate: lớn hơn nhau, lớn hơn ngày hiện tại, not null //note: date bằng null sẽ chuyển đổi thành 0 khi so sánh
    if (startDate === null || startDate === undefined || endDate === null || endDate === undefined)
        return [null, null];
    startDate = toDate(startDate);
    endDate = toDate(endDate);
    if (!(startDate < endDate))
        throw new BadRequestException(`${names} không hợp lệ`);
    const today = new Date(new Date().setHours(0, 0, 0, 0));
    if (
        !(startDate >= today) ||
        !(endDate >= today)
    )
        throw new BadRequestException(`${names} không hợp lệ`);
    return [startDate, endDate];
}

export const isGreaterThanToday = (dates: Date[]) => {
    let isGreater = true;
    const today = new Date(new Date().setHours(0, 0, 0, 0));
    dates.map(item => {
        if (!(item >= today))
            isGreater = false;
    })
    return isGreater;
}

export const toDate = (value: any): Date | null => {
    //fail new Date(value) is Invalid Date => .getFullYear() is NaN => null
    const date = new Date(value);
    return date.getFullYear() ? date : null;
}


export const toEnum = <T>(value: T, type: any): T | null => {
    return Object.values(type).includes(value) //string
        ? value
        : Object.keys(type).includes(value as any) //number
            ? +value as any
            : null;
}

export const toBoolean = (value: any): boolean | null => {
    return value === 'true'
        ? true
        : value === 'false'
            ? false
            : null;
}

export const cleanNullishNestedAttrs = <T>(object: T) => {
    const final: any = {};
    Object.keys(object).forEach(key => {
        if (object[key] === null || object[key] === undefined) {
            return;
        }
        if ((object[key] instanceof Object) && !(object[key] instanceof Array) && !(object[key] instanceof Date)) {
            const cleanObject = cleanNullishNestedAttrs(object[key]);
            Object.keys(cleanObject).forEach(i => {
                final[`${key}.${i}`] = cleanObject[i];
            });
            return;
        };
        final[key] = object[key];

    })
    return final;
}
//safe than cleanNullishNestedAttrs because it pass attrs is object
export const cleanNullishAttrs = <T>(object: T) => {
    const final: any = {};
    Object.keys(object).forEach(key => {
        if (object[key] === null || object[key] === undefined) return;
        final[key] = object[key];
    })
    return final;
}

//use delete => should not
export const badRemoveNullishAttrs = <T>(object: T) => {
    Object.keys(object).forEach(key => {
        if (object[key] === null || object[key] === undefined) {
            delete object[key];
        } else if (typeof object[key] === 'object' && !Array.isArray(object[key])) {
            object[key] = cleanNullishNestedAttrs(object[key]);
            if (Object.keys(object[key]).length === 0) {
                delete object[key];
            }
        }
    });
    return object;
}

/**
 * get and join all values of enum to string
 * @param enumType enum
 * @param join default ", "
 * @returns a enum values string
 */
export const joinEnumValues = <T>(enumType: T, join: string = ", ") => {
    const enumValues = Object.keys(enumType)
        .filter((key) => {
            const enumKey = isNaN(Number(key));
            return enumKey;
        })
        .map((key) => {
            //Type Safety: chỉ định key là 1 key type theo enum. So, ts suy ra value type. So, tránh lỗi runtime
            const enumValue = enumType[key as keyof typeof enumType];
            return enumValue;
        })
        .join(join);
    return enumValues;
}

/**
 * don't use
 */
export const isTruthyOrException = (items: any[], names: string[]) => {
    items.map((item, index) => {
        if (!item)
            throw new BadRequestException(isTruthyMessage(names[index]));

    });
}

export const isRequiredOrException = (items: any[], names: string[]) => {
    items.map((item, index) => {
        if (item === '' || item === null || item === undefined)
            throw new BadRequestException(isRequiredMessage(names[index]));

    });
}