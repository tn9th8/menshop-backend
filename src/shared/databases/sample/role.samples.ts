import { toObjetId } from "src/common/utils/mongo.util";

export enum RoleIdEnum {
    SUPER_ADMIN = '67270028882489921392b974',
    NORMAL_ADMIN = '672701aa2f8d80aa32dbbb28',
    NORMAL_SELLER = '672702583fc99fad411eb5e7',
    NORMAL_CLIENT = '672702a9a7b11823367b7206',
}

export const ROLE_SAMPLES = () => {
    const isActive = true;
    return [
        {
            _id: toObjetId(RoleIdEnum.SUPER_ADMIN),
            name: "Super Admin",
            description: "Super Admin là một role có thể truy cập mọi tài nguyên",
            group: "admin",
            permissions: ["6724d29d5d1217e484b53dfb", "6724d6d7536523777f944074", "6724d702536523777f944077", "6724d729536523777f94407a", "6724d738536523777f94407d"],
            isActive
        },
        {
            _id: toObjetId(RoleIdEnum.NORMAL_ADMIN),
            name: "Normal Admin",
            description: "Normal Admin truy cập các tài nguyên để có thể quản lý hệ thống",
            group: "admin",
            permissions: [],
            isActive
        },
        {
            _id: toObjetId(RoleIdEnum.NORMAL_SELLER),
            name: "Normal Seller",
            description: "Normal Seller truy cập các tài nguyên để có thể bán sản phẩm",
            group: "seller",
            permissions: [],
            isActive
        },
        {
            _id: toObjetId(RoleIdEnum.NORMAL_CLIENT),
            name: "Normal Client",
            description: "Normal Client truy cập các tài nguyên để có thể mua sản phẩm",
            group: "client",
            permissions: [],
            isActive
        },
    ];
};