import { Module } from '@nestjs/common';
import { NeedsService } from './needs.service';
import { NeedsController } from './needs.controller';

@Module({
  controllers: [NeedsController],
  providers: [NeedsService],
})
export class NeedsModule {}
