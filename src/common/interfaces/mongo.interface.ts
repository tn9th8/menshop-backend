import { Expression } from 'mongoose';

export interface MongoSort extends Record<string, 1 | -1 | Expression.Meta> { }

export interface MongoPage<T> {
    metadata: {
        count: number
    },
    data: T[]
}