import { NextRequest } from 'next/server';
import jwt from 'jsonwebtoken';
import { env } from '@/config/env';

export interface AuthenticatedUser {
  id: string;
  email?: string;
  role?: string;
}

export interface AuthenticatedRequest extends NextRequest {
  user?: AuthenticatedUser;
}

/**
 * User categories/roles
 */
export enum UserCategory {
  CLIENT = 'CLIENT',
  ADMIN = 'ADMIN',
  SUPERADMIN = 'SUPERADMIN',
}

/**
 * Verify JWT token from request
 */
export function verifyToken(request: NextRequest): AuthenticatedUser | null {
  try {
    const authHeader = request.headers.get('authorization');
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return null;
    }

    const token = authHeader.substring(7);
    const decoded = jwt.verify(token, env.JWT_SECRET) as any;

    return {
      id: decoded.id,
      email: decoded.email,
      role: decoded.role,
    };
  } catch (error) {
    return null;
  }
}

/**
 * Check if user has required role
 */
export function hasRole(user: AuthenticatedUser | null, allowedRoles: UserCategory[]): boolean {
  if (!user || !user.role) {
    return false;
  }

  return allowedRoles.includes(user.role as UserCategory);
}

/**
 * Authenticate middleware for Next.js API routes
 */
export function authenticate(allowedRoles: UserCategory[] = []) {
  return (request: NextRequest): { user: AuthenticatedUser | null; authorized: boolean } => {
    const user = verifyToken(request);

    if (!user) {
      return { user: null, authorized: false };
    }

    if (allowedRoles.length > 0 && !hasRole(user, allowedRoles)) {
      return { user, authorized: false };
    }

    return { user, authorized: true };
  };
}

