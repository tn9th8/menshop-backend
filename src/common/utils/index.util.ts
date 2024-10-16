
export const removeNullishAttrs = <T>(object: T) => {
    const final: any = {};
    Object.keys(object).forEach(key => {
        if (object[key] === null) {
            return;
        }
        if (typeof object[key] === 'object' && !Array.isArray(object[key])) {
            const cleanObject = removeNullishAttrs(object[key]);
            Object.keys(cleanObject).forEach(i => {
                final[`${key}.${i}`] = cleanObject[i];
            })
        } else {
            final[key] = object[key];
        }

    })
    return final;
}

//use delete => should not
export const badRemoveNullishAttrs = <T>(object: T) => {
    Object.keys(object).forEach(key => {
        if (object[key] === null || object[key] === undefined) {
            delete object[key];
        } else if (typeof object[key] === 'object' && !Array.isArray(object[key])) {
            object[key] = removeNullishAttrs(object[key]);
            if (Object.keys(object[key]).length === 0) {
                delete object[key];
            }
        }
    });
    return object;
}