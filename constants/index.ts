// Application constants
export const API_ROUTES = {
  AUTH: '/api/auth',
  USERS: '/api/users',
  QR_CODES: '/api/qr-codes',
  ANALYTICS: '/api/analytics',
  UPLOADS: '/api/uploads',
} as const;

export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  INTERNAL_SERVER_ERROR: 500,
} as const;

