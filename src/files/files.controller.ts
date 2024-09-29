import { Controller, Post, UploadedFile, UseFilters, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiTags } from '@nestjs/swagger';
import { ApiMessage } from 'src/common/decorators/api-message.decorator';
import { SkipJwt } from 'src/common/decorators/skip-jwt.decorator';
import { HttpExceptionFilter } from 'src/core/filter/http-exception.filter';
import { FilesService } from './files.service';

@ApiTags('Upload Files Module')
@Controller('adm/files')
export class FilesController {
  constructor(private readonly filesService: FilesService) { }

  /**
   * bug: validate file nhưng vẫn upload
   * since:
   * - req => interceptor (upload) => pipe (validate) => res
   */
  @SkipJwt()
  @Post('upload')
  @ApiMessage('Upload single file')
  @UseInterceptors(FileInterceptor('file'))
  @UseFilters(new HttpExceptionFilter())
  uploadFile(@UploadedFile() file: Express.Multer.File) {
    //todo: distinguish exceptions
    //todo: authorize files (access control)
    return { file: file.filename };
  }
}
