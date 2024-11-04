import { Module } from '@nestjs/common';
import { FilesService } from './files.service';
import { FilesController } from './files.controller';
import { MulterModule } from '@nestjs/platform-express';
import { MulterConfig } from '../../config/multer.config';

@Module({
  controllers: [FilesController],
  providers: [FilesService],
  imports: [MulterModule.registerAsync(MulterConfig)],
})
export class FilesModule { }
