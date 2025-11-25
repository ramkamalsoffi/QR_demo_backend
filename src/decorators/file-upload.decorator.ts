import multer from 'multer';
import { Request, Response, NextFunction } from 'express';

const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB
  }
});

export function SingleFileUpload(fieldName: string = 'file') {
  return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
    const originalMethod = descriptor.value;

    descriptor.value = async function (req: Request, res: Response, next: NextFunction) {
      const uploadMiddleware = upload.single(fieldName);
      
      uploadMiddleware(req, res, (err: any) => {
        if (err) {
          return res.status(400).json({
            success: false,
            message: err.message || 'File upload error',
            error: err
          });
        }
        return originalMethod.apply(this, [req, res, next]);
      });
    };
  };
}

