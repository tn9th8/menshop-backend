import { Module } from '@nestjs/common';
import { NeedsService } from './needs.service';
import { NeedsControllerAdmin } from './needs.controller.admin';
import { MongooseModule } from '@nestjs/mongoose';
import { Need, NeedSchema } from './schemas/need.schema';
import { NeedsRepository } from './needs.repository';
import { NeedsControllerClient } from './needs.controller.client';

@Module({
  controllers: [NeedsControllerAdmin, NeedsControllerClient],
  providers: [NeedsService, NeedsRepository],
  imports: [MongooseModule.forFeature([{ name: Need.name, schema: NeedSchema }])]
})
export class NeedsModule { }
