export enum IsPublishedEnum {
    PUBLISHED = 1,
    DRAFT = 0,
}

export enum IsActiveEnum {
    ACTIVE = 1,
    DISABLE = 0
}

export enum IsValidEnum {
    VALID = 1,
    EXPIRED = 0
}

export enum ForUserEnum {
    ADMIN = 0,
    SELLER = 1,
    CLIENT = 2
}

export enum IsSelectEnum {
    SELECT = 0,
    UNSELECT = 1,
}

export enum SortEnum {
    NAME_AZ = 'nameAz',
    NAME_ZA = 'nameZa',
    LATEST = 'latest',
    OLDEST = 'oldest'
}

export enum Jwt {
    ACCESS_TOKEN_SECRET = 'JWT_ACCESS_SECRET',
    ACCESS_TOKEN_EXPIRES = 'JWT_ACCESS_EXPIRES',
    REFRESH_TOKEN_SECRET = 'JWT_REFRESH_SECRET',
    REFRESH_TOKEN_EXPIRES = 'JWT_REFRESH_EXPIRES',
    VERIFY_TOKEN_SECRET = 'JWT_VERIFY_SECRET',
    VERIFY_TOKEN_EXPIRES = 'JWT_VERIFY_EXPIRES',
}