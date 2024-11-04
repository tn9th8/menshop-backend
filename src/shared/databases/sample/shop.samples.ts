import { toObjetId } from "src/common/utils/mongo.util";
import { UserIdEnum } from "./user.samples";

export const SHOP_SAMPLES = () => {
    const isActive = true;
    return [
        {
            _id: "66fe7af5efc4a95d4f3684f6",
            name: "Normal Shop",
            description: "Normal Shop là shop của Normal Seller",
            image: "normal-shop-image.png",
            isMall: false,
            seller: toObjetId(UserIdEnum.NORMAL_SELLER),
            isActive
        }
    ];
};