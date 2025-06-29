import { Injectable, BadRequestException, OnModuleInit } from '@nestjs/common';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { ConfigService } from '@nestjs/config';
import * as crypto from 'crypto';

@Injectable()
export class FileUploadService implements OnModuleInit {
  private s3Client: S3Client;
  private bucketName: string;
  private region: string;

  constructor(private configService: ConfigService) {}

  onModuleInit() {
    const bucketName = this.configService.get<string>('AWS_S3_BUCKET_NAME');
    const region = this.configService.get<string>('AWS_REGION');
    const accessKeyId = this.configService.get<string>('AWS_ACCESS_KEY_ID');
    const secretAccessKey = this.configService.get<string>('AWS_SECRET_ACCESS_KEY');
    
    // Validate required configuration
    if (!bucketName || !region || !accessKeyId || !secretAccessKey) {
      throw new Error('Missing AWS S3 configuration. Check your environment variables.');
    }
    
    this.bucketName = bucketName;
    this.region = region;
    
    this.s3Client = new S3Client({
      region,
      credentials: {
        accessKeyId,
        secretAccessKey,
      },
    });
  }

  /**
   * Generate a unique filename for S3 uploads
   */
  private generateUniqueFileName(originalName: string): string {
    const fileExtension = originalName.split('.').pop() || 'unknown';
    const randomString = crypto.randomBytes(16).toString('hex');
    const timestamp = Date.now();
    return `${timestamp}-${randomString}.${fileExtension}`;
  }

  /**
   * Upload file to S3 bucket and return the direct URL
   */
  async uploadFile(file: Express.Multer.File): Promise<string> {
    if (!file) {
      throw new BadRequestException('File is required');
    }

    try {
      const key = `uploads/${this.generateUniqueFileName(file.originalname)}`;
      
      // Upload file to S3 with public-read ACL
      await this.s3Client.send(
        new PutObjectCommand({
          Bucket: this.bucketName,
          Key: key,
          Body: file.buffer,
          ContentType: file.mimetype,
          ContentDisposition: 'inline',
        }),
      );
      
      // Return direct URL instead of signed URL
      const url = `https://${this.bucketName}.s3.${this.region}.amazonaws.com/${key}`;
      
      return url;
    } catch (error) {
      throw new BadRequestException(`Failed to upload file: ${error.message}`);
    }
  }
  
  /**
   * Upload multiple files to S3 bucket and return the direct URLs
   */
  async uploadMultipleFiles(files: Express.Multer.File[]): Promise<string[]> {
    if (!files || files.length === 0) {
      throw new BadRequestException('Files are required');
    }
    
    const uploadPromises = files.map(file => this.uploadFile(file));
    return Promise.all(uploadPromises);
  }
}