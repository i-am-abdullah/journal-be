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
  
  private readonly allowedMimeTypes = [
    // Images
    'image/jpeg',
    'image/png',
    'image/webp',
    
    // PDFs
    'application/pdf',

    // Word Documents (MS + Google Docs export)
    'application/msword', // .doc
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document', // .docx

    // Excel (MS Excel + Google Sheets export)
    'application/vnd.ms-excel', // .xls
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', // .xlsx

    // PowerPoint (MS PowerPoint + Google Slides export)
    'application/vnd.ms-powerpoint', // .ppt
    'application/vnd.openxmlformats-officedocument.presentationml.presentation', // .pptx
  ];

  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  async uploadFile(@UploadedFile() file: Express.Multer.File): Promise<{ url: string }> {
    if (!file) {
      throw new BadRequestException('No file uploaded');
    }

    if (!this.allowedMimeTypes.includes(file.mimetype)) {
      throw new BadRequestException(
        `Unsupported file type: ${file.mimetype}`,
      );
    }

    const maxSizeBytes = 10 * 1024 * 1024;
    if (file.size > maxSizeBytes) {
      throw new BadRequestException('File size exceeds 10MB');
    }

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