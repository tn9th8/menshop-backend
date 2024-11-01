import { Types } from "mongoose"
import { Expression } from 'mongoose';

export interface IKey extends Types.ObjectId { };

export interface IDbSort extends Record<string, 1 | -1 | Expression.Meta> { };

export interface IReference {
    attribute: string,
    select?: string[],
    unselect?: string[]
}

export interface IBaseDocument {
    _id: IKey;
    isDeleted: false;
    deletedAt: boolean;
    createdAt: Date;
    updatedAt: Date;
    _doc: any;
    __v: any;
}