import { Request, Response, NextFunction } from 'express';
import { ApiResult } from '../utils/api-result';

export function Authenticate(categories: string[] = []) {
  return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
    const originalMethod = descriptor.value;

    descriptor.value = async function (req: Request, res: Response, next: NextFunction) {
      try {
        // Demo authentication - accept mock token from frontend
        const authHeader = req.headers.authorization;

        // For demo purposes, accept any token or no token
        if (!authHeader || authHeader === 'Bearer mock-token-admin') {
          // Mock user for demo
          (req as any).user = {
            id: 'demo-user-id',
            category: 'ADMIN' // Allow all categories for demo
          };
        } else {
          // If there's a real token, you could validate it here
          (req as any).user = {
            id: 'authenticated-user-id',
            category: 'ADMIN'
          };
        }

        return originalMethod.apply(this, [req, res, next]);
      } catch (error: any) {
        return ApiResult.error(error?.message || 'Authentication failed', 401).send(res);
      }
    };
  };
}

