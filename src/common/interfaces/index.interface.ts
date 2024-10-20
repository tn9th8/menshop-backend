import { Types } from "mongoose"

export interface IKey extends Types.ObjectId { }

export interface IReference {
    attribute: string,
    select: string[],
    unselect: string[]
}