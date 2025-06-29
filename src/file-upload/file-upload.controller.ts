import { 
    Controller, 
    Post, 
    UseInterceptors, 
    UploadedFile,
    UploadedFiles,
    BadRequestException,
    UseGuards,
    ParseFilePipe,
    MaxFileSizeValidator,
    FileTypeValidator
  } from '@nestjs/common';
  import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
  import { FileUploadService } from './file-upload.service';
  import { AuthGuard } from 'src/auth/guards/auth.guard';
  
  @Controller('files')
  export class FileUploadController {
    constructor(private readonly fileUploadService: FileUploadService) {}
  
    @Post('upload')
    // @UseGuards(AuthGuard)
    @UseInterceptors(FileInterceptor('file'))
    async uploadFile(
      @UploadedFile(
        new ParseFilePipe({
          validators: [
            new MaxFileSizeValidator({ maxSize: 5 * 1024 * 1024 }), // 5MB
            new FileTypeValidator({ fileType: /.(jpg|jpeg|png|pdf|doc|docx)$/ }),
          ],
        }),
      ) file: Express.Multer.File,
    ): Promise<{ url: string }> {
      try {
        const fileUrl = await this.fileUploadService.uploadFile(file);
        return { url: fileUrl };
      } catch (error) {
        throw new BadRequestException(error.message);
      }
    }
  
    @Post('upload-multiple')
    @UseGuards(AuthGuard)
    @UseInterceptors(FilesInterceptor('files', 10)) // Max 10 files
    async uploadMultipleFiles(
      @UploadedFiles() files: Express.Multer.File[],
    ): Promise<{ urls: string[] }> {
      try {
        const fileUrls = await this.fileUploadService.uploadMultipleFiles(files);
        return { urls: fileUrls };
      } catch (error) {
        throw new BadRequestException(error.message);
      }
    }
  }