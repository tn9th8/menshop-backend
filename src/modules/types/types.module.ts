import { Module } from '@nestjs/common';
import { TypesService } from './types.service';
import { TypesController } from './types.controller';
import { TypesRepo } from './types.repo';
import { MongooseModule } from '@nestjs/mongoose';
import { Type, TypeSchema } from './schemas/type.schema';

@Module({
  controllers: [TypesController],
  providers: [TypesService, TypesRepo],
  imports: [MongooseModule.forFeature([{ name: Type.name, schema: TypeSchema }])]
})
export class TypesModule { }
