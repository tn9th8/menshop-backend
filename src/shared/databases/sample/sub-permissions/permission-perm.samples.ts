export const PermissionPIdEnum = {
    admin: {
        CREATE_ONE: '6724d29d5d1217e484b53dfb',
        UPDATE_ONE: '6724d6d7536523777f944074',
        DELETE_ONE: '6724d702536523777f944077',
        GET_ONE: '6724d729536523777f94407a',
        GET_ALL: '6724d738536523777f94407d'
    }
}

export const PERMISSION_PERMISSION_SAMPLES = () => {
    const isActive = true;
    return [
        {
            _id: PermissionPIdEnum.admin.CREATE_ONE,
            name: 'create a permission',
            slug: 'COXX-PE-AD1',
            version: 'v1',
            group: 'admin',
            module: 'permissions',
            apiMethod: 'CREATE',
            apiPath: '/api/v1/admin/permissions'
        },
        {
            _id: PermissionPIdEnum.admin.UPDATE_ONE,
            name: 'update a permission',
            slug: 'UOXX-PE-AD1',
            version: 'v1',
            group: 'admin',
            module: 'permissions',
            apiMethod: 'PATCH',
            apiPath: '/api/v1/admin/permissions'
        },
        {
            _id: PermissionPIdEnum.admin.DELETE_ONE,
            name: 'delete a permission',
            slug: 'DOXX-PE-AD1',
            version: 'v1',
            group: 'admin',
            module: 'permissions',
            apiMethod: 'DELETE',
            apiPath: '/api/v1/admin/permissions/:id'
        },
        {
            _id: PermissionPIdEnum.admin.GET_ALL,
            name: 'find all permissions',
            slug: 'FAXX-PE-AD1',
            version: 'v1',
            group: 'admin',
            module: 'permissions',
            apiMethod: 'GET',
            apiPath: '/api/v1/admin/permissions'
        },
        {
            _id: PermissionPIdEnum.admin.GET_ONE,
            name: 'find a permission',
            slug: 'FOXX-PE-AD1',
            version: 'v1',
            group: 'admin',
            module: 'permissions',
            apiMethod: 'GET',
            apiPath: '/api/v1/admin/permissions/:id'
        }
    ];
};