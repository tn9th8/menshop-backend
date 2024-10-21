export const toEnum = <T>(enumValue: T, enumType: any) => {
    return Object.values(enumType).includes(enumValue) //string
        ? enumValue
        : Object.keys(enumType).includes(enumValue as any) //number
            ? +enumValue as any
            : null;
}

export const toBoolean = (value: any): boolean => {
    return value === 'true'
        ? true
        : value === 'false'
            ? false
            : null;
}

export const toNumber = (value: any): number => {
    return +value || null;
}

export const cleanNullishNestedAttrs = <T>(object: T) => {
    const final: any = {};
    Object.keys(object).forEach(key => {
        if (object[key] === null) {
            return;
        }
        if (typeof object[key] === 'object' && !Array.isArray(object[key])) {
            const cleanObject = cleanNullishNestedAttrs(object[key]);
            Object.keys(cleanObject).forEach(i => {
                final[`${key}.${i}`] = cleanObject[i];
            })
        } else {
            final[key] = object[key];
        }

    })
    return final;
}

export const cleanNullishAttrs = <T>(object: T) => {
    const final: any = {};
    Object.keys(object).forEach(key => {
        if (object[key] === null || object[key] === undefined) { return; }
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