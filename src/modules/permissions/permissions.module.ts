import { Module } from '@nestjs/common';
import { PermissionsService } from './permissions.service';
import { PermissionsControllerAdmin } from './permissions.controller.admin';
import { MongooseModule } from '@nestjs/mongoose';
import { Permission, PermissionSchema } from './schemas/permission.schema';
import { PermissionsRepository } from './permissions.repository';

@Module({
  controllers: [PermissionsControllerAdmin],
  providers: [PermissionsService, PermissionsRepository],
  imports: [MongooseModule.forFeature([{ name: Permission.name, schema: PermissionSchema }])],
})
export class PermissionsModule { }
