import { Request, Response } from 'express';
import { Controller } from '../decorators/controller.decorator';
import { POST } from '../decorators/method.decorator';
import { Authenticate } from '../decorators/authenticate.decorator';
import { SingleFileUpload } from '../decorators/file-upload.decorator';
import { UserCategory } from '../utils/user-category.enum';
import { ApiResult } from '../utils/api-result';
import { S3UploadService, S3UploadConfig } from '../services/s3-upload.service';

interface AuthenticatedRequest extends Request {
  user: { id: string };
  file?: Express.Multer.File;
}

@Controller('/s3-upload')
export class S3UploadSingleController {
  private s3UploadService: S3UploadService;

  constructor() {
    // S3 CONFIG — SAME AS YOUR OLD ONE
    const config: S3UploadConfig = {
      bucketName: process.env.BUCKET_NAME || '',
      region: process.env.NEW_REGION || 'blr1',
      accessKeyId: process.env.NEW_ACCESS_KEY || '',
      secretAccessKey: process.env.SECRET_ACCESS_KEY || '',
      rootFolder: 'amaramba',
      subFolder: 'user_documents',
      maxFileSize: 10 * 1024 * 1024, // 10MB
      allowedMimeTypes: [
        'image/jpeg',
        'image/jpg',
        'image/png',
        'image/gif',
        'image/webp',
        'application/pdf',
        'video/mp4',
        'video/quicktime',
        'video/x-msvideo'
      ],
      endpoint: process.env.S3_ENDPOINT || 'https://blr1.digitaloceanspaces.com',
      forcePathStyle: process.env.S3_FORCE_PATH_STYLE === 'true',
      makePublic: process.env.S3_MAKE_PUBLIC !== 'false'
    };

    this.s3UploadService = new S3UploadService(config);
  }

  /**
   * Upload single file to S3 with NEW FOLDER NAME
   * POST /s3-upload/upload-single-new-folder
   */
  @POST('/upload-single-new-folder')
  @Authenticate([UserCategory.CLIENT, UserCategory.ADMIN, UserCategory.SUPERADMIN])
  @SingleFileUpload('file')
  async uploadSingleFileNewFolder(req: AuthenticatedRequest, res: Response) {
    try {
      if (!req.file) {
        return ApiResult.error('No file uploaded', 400).send(res);
      }

      // 🔥 NEW FOLDER NAME HERE
      const NEW_FOLDER = 'QRSCAN';

      // 🔥 replace path dynamically
      req.file.originalname = `${NEW_FOLDER}/${req.file.originalname}`;

      // Upload file
      const result = await this.s3UploadService.uploadFile(req.file);

      if (!result.success) {
        return ApiResult.error(result.error || 'Upload failed', 500).send(res);
      }

      return ApiResult.success(
        {
          imageUrl: result.imageUrl,
          fileName: result.fileName,
          fileSize: result.fileSize,
          folder: NEW_FOLDER
        },
        'File uploaded successfully to new folder'
      ).send(res);
    } catch (err: any) {
      console.error('Error (uploadSingleFileNewFolder):', err);
      return ApiResult.error(err?.message || 'Internal server error', 500).send(res);
    }
  }

  /**
   * Upload PDF file to S3
   * POST /s3-upload/upload-pdf
   */
  @POST('/upload-pdf')
  @Authenticate([UserCategory.CLIENT, UserCategory.ADMIN, UserCategory.SUPERADMIN])
  @SingleFileUpload('file')
  async uploadPdf(req: AuthenticatedRequest, res: Response) {
    try {
      if (!req.file) {
        return ApiResult.error('No file uploaded', 400).send(res);
      }

      // Validate PDF
      if (req.file.mimetype !== 'application/pdf') {
        return ApiResult.error('Only PDF files are allowed', 400).send(res);
      }

      const NEW_FOLDER = 'QRSCAN/PDFs';
      req.file.originalname = `${NEW_FOLDER}/${req.file.originalname}`;

      const result = await this.s3UploadService.uploadFile(req.file);

      if (!result.success) {
        return ApiResult.error(result.error || 'Upload failed', 500).send(res);
      }

      return ApiResult.success(
        {
          pdfUrl: result.imageUrl,
          fileName: result.fileName,
          fileSize: result.fileSize,
          folder: NEW_FOLDER
        },
        'PDF uploaded successfully'
      ).send(res);
    } catch (err: any) {
      console.error('Error (uploadPdf):', err);
      return ApiResult.error(err?.message || 'Internal server error', 500).send(res);
    }
  }
}

