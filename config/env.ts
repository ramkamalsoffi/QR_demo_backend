// Environment configuration
export const env = {
  NODE_ENV: process.env.NODE_ENV || 'development',
  DATABASE_URL: process.env.DATABASE_URL || '',
  JWT_SECRET: process.env.JWT_SECRET || '',
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || '7d',
  API_URL: process.env.API_URL || 'http://localhost:3000',
  PORT: process.env.PORT || '3000',
  // S3 Configuration
  BUCKET_NAME: process.env.BUCKET_NAME || '',
  S3_REGION: process.env.NEW_REGION || 'blr1',
  S3_ACCESS_KEY_ID: process.env.NEW_ACCESS_KEY || '',
  S3_SECRET_ACCESS_KEY: process.env.SECRET_ACCESS_KEY || '',
  S3_ENDPOINT: process.env.S3_ENDPOINT || 'https://blr1.digitaloceanspaces.com',
  S3_FORCE_PATH_STYLE: process.env.S3_FORCE_PATH_STYLE === 'true',
  S3_MAKE_PUBLIC: process.env.S3_MAKE_PUBLIC !== 'false',
};

