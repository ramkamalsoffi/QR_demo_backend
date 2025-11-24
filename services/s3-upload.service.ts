import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { env } from '@/config/env';

export interface S3UploadConfig {
  bucketName: string;
  region: string;
  accessKeyId: string;
  secretAccessKey: string;
  rootFolder: string;
  subFolder: string;
  maxFileSize: number;
  allowedMimeTypes: string[];
  endpoint: string;
  forcePathStyle: boolean;
  makePublic: boolean;
}

export interface UploadResult {
  success: boolean;
  imageUrl?: string;
  fileName?: string;
  fileSize?: number;
  error?: string;
}

export interface FileUpload {
  buffer: Buffer;
  originalname: string;
  mimetype: string;
  size: number;
}

export class S3UploadService {
  private s3Client: S3Client;
  private config: S3UploadConfig;

  constructor(config: S3UploadConfig) {
    this.config = config;
    this.s3Client = new S3Client({
      region: config.region,
      endpoint: config.endpoint,
      forcePathStyle: config.forcePathStyle,
      credentials: {
        accessKeyId: config.accessKeyId,
        secretAccessKey: config.secretAccessKey,
      },
    });
  }

  /**
   * Validate file before upload
   */
  private validateFile(file: FileUpload): { valid: boolean; error?: string } {
    // Check file size
    if (file.size > this.config.maxFileSize) {
      return {
        valid: false,
        error: `File size exceeds maximum allowed size of ${this.config.maxFileSize / (1024 * 1024)}MB`,
      };
    }

    // Check MIME type
    if (!this.config.allowedMimeTypes.includes(file.mimetype)) {
      return {
        valid: false,
        error: `File type ${file.mimetype} is not allowed. Allowed types: ${this.config.allowedMimeTypes.join(', ')}`,
      };
    }

    return { valid: true };
  }

  /**
   * Generate unique file name
   */
  private generateFileName(originalName: string): string {
    const timestamp = Date.now();
    const randomString = Math.random().toString(36).substring(2, 15);
    const extension = originalName.split('.').pop();
    const nameWithoutExt = originalName.replace(/\.[^/.]+$/, '');
    return `${nameWithoutExt}_${timestamp}_${randomString}.${extension}`;
  }

  /**
   * Upload file to S3
   */
  async uploadFile(file: FileUpload): Promise<UploadResult> {
    try {
      // Validate file
      const validation = this.validateFile(file);
      if (!validation.valid) {
        return {
          success: false,
          error: validation.error,
        };
      }

      // Generate file path
      const fileName = this.generateFileName(file.originalname);
      const filePath = `${this.config.rootFolder}/${this.config.subFolder}/${fileName}`;

      // Prepare upload parameters
      const uploadParams: any = {
        Bucket: this.config.bucketName,
        Key: filePath,
        Body: file.buffer,
        ContentType: file.mimetype,
      };

      // Make public if configured
      if (this.config.makePublic) {
        uploadParams.ACL = 'public-read';
      }

      // Upload to S3
      const command = new PutObjectCommand(uploadParams);
      await this.s3Client.send(command);

      // Generate public URL
      let imageUrl: string;
      if (this.config.forcePathStyle) {
        imageUrl = `${this.config.endpoint}/${this.config.bucketName}/${filePath}`;
      } else {
        imageUrl = `${this.config.endpoint}/${filePath}`;
      }

      return {
        success: true,
        imageUrl,
        fileName,
        fileSize: file.size,
      };
    } catch (error: any) {
      console.error('S3 Upload Error:', error);
      return {
        success: false,
        error: error?.message || 'Failed to upload file to S3',
      };
    }
  }

  /**
   * Delete file from S3
   */
  async deleteFile(filePath: string): Promise<UploadResult> {
    try {
      const { DeleteObjectCommand } = await import('@aws-sdk/client-s3');
      const command = new DeleteObjectCommand({
        Bucket: this.config.bucketName,
        Key: filePath,
      });

      await this.s3Client.send(command);

      return {
        success: true,
      };
    } catch (error: any) {
      console.error('S3 Delete Error:', error);
      return {
        success: false,
        error: error?.message || 'Failed to delete file from S3',
      };
    }
  }
}

