import express, { Express } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
// Import controllers to ensure decorators execute
import { ProductController } from './controllers/product.controller';
import { CustomerController } from './controllers/customer.controller';
import { S3UploadSingleController } from './controllers/s3-upload.controller';
import { SubmissionController } from './controllers/submission.controller';
import { getRouter, getPath } from './decorators/controller.decorator';

// Load environment variables
dotenv.config();

const app: Express = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'OK', message: 'Server is running' });
});

// Test endpoint without authentication
app.get('/test', (req, res) => {
  console.log('Test endpoint called');
  res.json({ success: true, message: 'Test endpoint works', timestamp: new Date().toISOString() });
});

// Register controllers
// Instantiate controllers (decorators already executed during import)
const productController = new ProductController();
const customerController = new CustomerController();
const s3UploadController = new S3UploadSingleController();
const submissionController = new SubmissionController();

// Register routes
const productPath = getPath(ProductController);
const customerPath = getPath(CustomerController);
const s3UploadPath = getPath(S3UploadSingleController);
const submissionPath = getPath(SubmissionController);

const productRouter = getRouter(ProductController);
const customerRouter = getRouter(CustomerController);
const s3UploadRouter = getRouter(S3UploadSingleController);
const submissionRouter = getRouter(SubmissionController);

console.log('\n🚀 Starting server...');
console.log(`📋 Registering routes:`);
console.log(`  Product router exists: ${!!productRouter}`);
console.log(`  Customer router exists: ${!!customerRouter}`);
console.log(`  S3 router exists: ${!!s3UploadRouter}`);

if (productRouter && productPath) {
  app.use(productPath, productRouter);
  console.log(`✅ Product routes: ${productPath}`);
} else {
  console.error('❌ Failed to register Product routes');
  console.error(`  Path: ${productPath}`);
  console.error(`  Router: ${!!productRouter}`);
}

if (customerRouter && customerPath) {
  app.use(customerPath, customerRouter);
  console.log(`✅ Customer routes: ${customerPath}`);
} else {
  console.error('❌ Failed to register Customer routes');
  console.error(`  Path: ${customerPath}`);
  console.error(`  Router: ${!!customerRouter}`);
}

if (s3UploadRouter && s3UploadPath) {
  app.use(s3UploadPath, s3UploadRouter);
  console.log(`✅ S3 Upload routes: ${s3UploadPath}`);
} else {
  console.error('❌ Failed to register S3 Upload routes');
  console.error(`  Path: ${s3UploadPath}`);
  console.error(`  Router: ${!!s3UploadRouter}`);
}

if (submissionRouter && submissionPath) {
  app.use(submissionPath, submissionRouter);
  console.log(`✅ Submission routes: ${submissionPath}`);
} else {
  console.error('❌ Failed to register Submission routes');
  console.error(`  Path: ${submissionPath}`);
  console.error(`  Router: ${!!submissionRouter}`);
}

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found',
    path: req.path
  });
});

// Error handler
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('Unhandled error:', err);
  console.error('Error stack:', err?.stack);
  console.error('Request path:', req.path);
  console.error('Request method:', req.method);
  
  // Don't send response if headers already sent
  if (res.headersSent) {
    return next(err);
  }
  
  res.status(500).json({
    success: false,
    message: 'Internal server error',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined,
    path: req.path
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server is running on http://localhost:${PORT}`);
  console.log(`📚 API Documentation available at http://localhost:${PORT}/api-docs`);
});

export default app;

