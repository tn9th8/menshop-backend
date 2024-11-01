import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { IBaseDocument } from 'src/common/interfaces/index.interface';
import { IPageQuery } from 'src/common/interfaces/query.interface';

export type PermissionDocument = HydratedDocument<Permission>;
export type PermissionDoc = PermissionDocument & IBaseDocument;
export type PermissionPartial = Partial<Permission>;
export type PermissionQuery = Pick<Permission,
    'name' | 'slug' | 'version' | 'group' | 'module' | 'apiMethod' | 'apiPath'> & IPageQuery;

@Schema({ timestamps: true })
export class Permission {
    @Prop()
    name: string;
    @Prop()
    slug: string;
    @Prop()
    version: string;//v1
    @Prop()
    group: string; //admin, seller, client
    @Prop()
    module: string;
    @Prop()
    apiMethod: string; //post, patch, get, delete
    @Prop()
    apiPath: string; //1 endpoint = apiMethod + apiPath
}

export const PermissionSchema = SchemaFactory.createForClass(Permission);
