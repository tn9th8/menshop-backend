import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, SchemaTypes } from 'mongoose';
import { IBaseDocument, IKey } from 'src/common/interfaces/index.interface';
import { IPageQuery } from 'src/common/interfaces/query.interface';
import { Permission } from 'src/modules/permissions/schemas/permission.schema';

export type RoleDocument = HydratedDocument<Role>;
export type RoleDoc = RoleDocument & IBaseDocument;
export type RolePartial = Partial<Role>;
export type RoleQuery = Pick<Role, 'name' | 'group' | 'isActive'> & IPageQuery;

@Schema({ timestamps: true })
export class Role {
    @Prop()
    name: string;
    @Prop()
    description: string;
    @Prop()
    group: string;
    @Prop({ type: [SchemaTypes.ObjectId], ref: Permission.name })
    permissions: IKey[];
    @Prop()
    isActive: boolean;
}

export const RoleSchema = SchemaFactory.createForClass(Role);

