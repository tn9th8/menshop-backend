import { BadRequestException } from "@nestjs/common";
import mongoose from "mongoose";

export const isObjetId = (id: string): boolean => {
    if (!mongoose.Types.ObjectId.isValid(id)) {
        throw new BadRequestException(`Không thể tìm với id=${id}`)
    }
    return true
}
