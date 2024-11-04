import { PermissionPIdEnum } from "./sub-permissions/permission-perm.samples";

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
            _id: RoleIdEnum.SUPER_ADMIN,
            name: "Super Admin",
            description: "Super Admin là một role có thể truy cập mọi tài nguyên",
            group: "admin",
            permissions: [
                PermissionPIdEnum.admin.CREATE_ONE,
                PermissionPIdEnum.admin.UPDATE_ONE,
                PermissionPIdEnum.admin.DELETE_ONE,
                PermissionPIdEnum.admin.GET_ALL,
                PermissionPIdEnum.admin.GET_ONE
            ],
            isActive
        },
        {
            _id: RoleIdEnum.NORMAL_ADMIN,
            name: "Normal Admin",
            description: "Normal Admin truy cập các tài nguyên để có thể quản lý hệ thống",
            group: "admin",
            permissions: [],
            isActive
        },
        {
            _id: RoleIdEnum.NORMAL_SELLER,
            name: "Normal Seller",
            description: "Normal Seller truy cập các tài nguyên để có thể bán sản phẩm",
            group: "seller",
            permissions: [],
            isActive
        },
        {
            _id: RoleIdEnum.NORMAL_CLIENT,
            name: "Normal Client",
            description: "Normal Client truy cập các tài nguyên để có thể mua sản phẩm",
            group: "client",
            permissions: [],
            isActive
        },
    ];
};