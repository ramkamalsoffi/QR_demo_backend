import { NextRequest } from 'next/server';
import { S3UploadService, S3UploadConfig } from '@/services/s3-upload.service';
import { ApiResult } from '@/utils/api-result';
import { authenticate, UserCategory } from '@/utils/auth-helper';
import { parseFormData } from '@/utils/file-upload';
import { env } from '@/config/env';

// Initialize S3 Upload Service
const getS3UploadService = () => {
  const config: S3UploadConfig = {
    bucketName: env.BUCKET_NAME || '',
    region: env.S3_REGION || 'blr1',
    accessKeyId: env.S3_ACCESS_KEY_ID || '',
    secretAccessKey: env.S3_SECRET_ACCESS_KEY || '',
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
      'video/x-msvideo',
    ],
    endpoint: env.S3_ENDPOINT || 'https://blr1.digitaloceanspaces.com',
    forcePathStyle: env.S3_FORCE_PATH_STYLE,
    makePublic: env.S3_MAKE_PUBLIC,
  };

  return new S3UploadService(config);
};

/**
 * Upload single file to S3 with NEW FOLDER NAME
 * POST /api/uploads/s3-upload
 */
export async function POST(request: NextRequest) {
  try {
    // Authenticate user
    const auth = authenticate([UserCategory.CLIENT, UserCategory.ADMIN, UserCategory.SUPERADMIN]);
    const { user, authorized } = auth(request);

    if (!authorized || !user) {
      return ApiResult.error('Unauthorized', 401).toResponse();
    }

    // Parse form data
    const { file, fields } = await parseFormData(request);

    if (!file) {
      return ApiResult.error('No file uploaded', 400).toResponse();
    }

    // 🔥 NEW FOLDER NAME HERE
    const NEW_FOLDER = 'QR-REPORT';

    // 🔥 replace path dynamically
    file.originalname = `${NEW_FOLDER}/${file.originalname}`;

    // Get S3 upload service
    const s3UploadService = getS3UploadService();

    // Upload file
    const result = await s3UploadService.uploadFile(file);

    if (!result.success) {
      return ApiResult.error(result.error || 'Upload failed', 500).toResponse();
    }

    return ApiResult.success(
      {
        imageUrl: result.imageUrl,
        fileName: result.fileName,
        fileSize: result.fileSize,
        folder: NEW_FOLDER,
      },
      'File uploaded successfully to new folder'
    ).toResponse();
  } catch (err: any) {
    console.error('Error (uploadSingleFileNewFolder):', err);
    return ApiResult.error(err?.message || 'Internal server error', 500).toResponse();
  }
}

