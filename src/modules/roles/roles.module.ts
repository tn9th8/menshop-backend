import { Module } from '@nestjs/common';
import { RolesService } from './roles.service';
import { RolesControllerAdmin } from './roles.controller.admin';
import { RolesRepository } from './roles.repository';
import { MongooseModule } from '@nestjs/mongoose';
import { Role, RoleSchema } from './schemas/role.schema';

@Module({
  controllers: [RolesControllerAdmin],
  providers: [RolesService, RolesRepository],
  imports: [MongooseModule.forFeature([{ name: Role.name, schema: RoleSchema }])],
  exports: [RolesService, RolesRepository]
})
export class RolesModule { }
