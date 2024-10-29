import { Module } from '@nestjs/common';
import { NeedsService } from './needs.service';
import { NeedsControllerAdmin } from './needs.controller.admin';
import { MongooseModule } from '@nestjs/mongoose';
import { Need, NeedSchema } from './schemas/need.schema';
import { NeedsRepository } from './needs.repository';
import { NeedsControllerClient } from './needs.controller.client';
import { CreateNeedTransform } from './transform/create-need.transform';
import { NeedsFactory } from './factory/needs.factory';
import { Level1NeedsService } from './factory/level1-needs.service';
import { Level2NeedsService } from './factory/level2-needs.service';
import { Level3NeedsService } from './factory/level3-needs.service';
import { DefaultNeedsService } from './factory/default-needs.service';
import { UtilNeedsService } from './factory/needs.factory.helper';
import { UpdateNeedTransform } from './transform/update-need.transform';
import { QueryNeedTransform } from './transform/query-need.transform';

@Module({
  controllers: [NeedsControllerAdmin, NeedsControllerClient],
  providers: [
    NeedsService, NeedsRepository,
    CreateNeedTransform, UpdateNeedTransform,
    NeedsFactory,
    Level1NeedsService, Level2NeedsService, Level3NeedsService, DefaultNeedsService,
    UtilNeedsService
  ],
  imports: [MongooseModule.forFeature([{ name: Need.name, schema: NeedSchema }])],
  exports: [NeedsService, NeedsRepository]
})
export class NeedsModule { }
