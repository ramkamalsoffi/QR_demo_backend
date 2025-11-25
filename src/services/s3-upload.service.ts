import { S3Client, PutObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3';
import { Upload } from '@aws-sdk/lib-storage';

export interface S3UploadConfig {
  bucketName: string;
  region: string;
  accessKeyId: string;
  secretAccessKey: string;
  rootFolder?: string;
  subFolder?: string;
  maxFileSize?: number;
  allowedMimeTypes?: string[];
  endpoint?: string;
  forcePathStyle?: boolean;
  makePublic?: boolean;
}

export interface UploadResult {
  success: boolean;
  imageUrl?: string;
  fileName?: string;
  fileSize?: number;
  error?: string;
}

export class S3UploadService {
  private s3Client: S3Client;
  private config: S3UploadConfig;

  constructor(config: S3UploadConfig) {
    this.config = config;

    this.s3Client = new S3Client({
      region: config.region,
      credentials: {
        accessKeyId: config.accessKeyId,
        secretAccessKey: config.secretAccessKey,
      },
      endpoint: config.endpoint,
      forcePathStyle: config.forcePathStyle || false,
    });
  }

  async uploadFile(file: Express.Multer.File): Promise<UploadResult> {
    try {
      // Validate file size
      if (this.config.maxFileSize && file.size > this.config.maxFileSize) {
        return {
          success: false,
          error: `File size exceeds maximum allowed size of ${this.config.maxFileSize} bytes`,
        };
      }

      // Validate MIME type
      if (
        this.config.allowedMimeTypes &&
        this.config.allowedMimeTypes.length > 0 &&
        !this.config.allowedMimeTypes.includes(file.mimetype)
      ) {
        return {
          success: false,
          error: `File type ${file.mimetype} is not allowed`,
        };
      }

      // Construct file path
      let filePath = file.originalname;
      if (this.config.rootFolder) {
        filePath = `${this.config.rootFolder}/${filePath}`;
      }
      if (this.config.subFolder) {
        filePath = `${this.config.rootFolder || ''}/${this.config.subFolder}/${file.originalname}`;
      }

      // Upload to S3
      const upload = new Upload({
        client: this.s3Client,
        params: {
          Bucket: this.config.bucketName,
          Key: filePath,
          Body: file.buffer,
          ContentType: file.mimetype,
          ACL: this.config.makePublic ? 'public-read' : 'private',
        },
      });

      await upload.done();

      // Construct URL
      let imageUrl: string;
      if (this.config.endpoint) {
        const endpointUrl = this.config.endpoint.replace('https://', '').replace('http://', '');
        imageUrl = `https://${this.config.bucketName}.${endpointUrl}/${filePath}`;
      } else {
        imageUrl = `https://${this.config.bucketName}.s3.${this.config.region}.amazonaws.com/${filePath}`;
      }

      return {
        success: true,
        imageUrl,
        fileName: file.originalname,
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

  async deleteFile(filePath: string): Promise<boolean> {
    try {
      const command = new DeleteObjectCommand({
        Bucket: this.config.bucketName,
        Key: filePath,
      });

      await this.s3Client.send(command);
      return true;
    } catch (error: any) {
      console.error('S3 Delete Error:', error);
      return false;
    }
  }
}

