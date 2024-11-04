import { toObjetId } from "src/common/utils/mongo.util";
import { UserIdEnum } from "./user.samples";

export const USER_KEYS_SAMPLES = () => {
    return [
        {
            _id: toObjetId('672712faab771ab191deb239'),
            user: toObjetId(UserIdEnum.SUPER_ADMIN),
            refreshToken: [],
            verifyToken: null
        },
        {
            _id: toObjetId('672713575dca208e95b86cae'),
            user: toObjetId(UserIdEnum.NORMAL_ADMIN),
            refreshToken: [],
            verifyToken: null
        },
        {
            _id: toObjetId('67271377e3ddbfc958c01cf2'),
            user: toObjetId(UserIdEnum.NORMAL_SELLER),
            refreshToken: [],
            verifyToken: null
        },
        {
            _id: toObjetId('672714a0d9e8d87271062d1d'),
            user: toObjetId(UserIdEnum.NORMAL_CLIENT),
            refreshToken: [],
            verifyToken: null
        }
    ];
};