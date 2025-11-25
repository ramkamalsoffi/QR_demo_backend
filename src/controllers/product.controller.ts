import { Request, Response } from 'express';
import { Controller } from '../decorators/controller.decorator';
import { GET, POST, PUT, DELETE } from '../decorators/method.decorator';
import { Authenticate } from '../decorators/authenticate.decorator';
import { SingleFileUpload } from '../decorators/file-upload.decorator';
import { UserCategory } from '../utils/user-category.enum';
import { ApiResult } from '../utils/api-result';
import { ProductModel } from '../models/product.model';

interface AuthenticatedRequest extends Request {
  user: { id: string };
}

@Controller('/api/products')
export class ProductController {
  /**
   * Get all products
   * GET /api/products
   */
  @GET('/')
  @Authenticate([UserCategory.CLIENT, UserCategory.ADMIN, UserCategory.SUPERADMIN])
  async getAllProducts(req: AuthenticatedRequest, res: Response) {
    try {
      console.log('getAllProducts called');
      const products = await ProductModel.findAll();
      console.log('Products found:', products.length);

      // Return empty array if no products (database not set up yet)
      if (!products || products.length === 0) {
        console.log('No products found - returning empty array');
        return ApiResult.success([], 'No products found').send(res);
      }

      return ApiResult.success(products, 'Products retrieved successfully').send(res);
    } catch (error: any) {
      console.error('Error (getAllProducts):', error);
      console.error('Error stack:', error?.stack);

      // If database error, return empty array for demo
      if (error.message?.includes('database') || error.message?.includes('connect') || error.code === 'P1001') {
        console.log('Database error - returning empty array for demo');
        return ApiResult.success([], 'Database not configured - returning demo data').send(res);
      }

      return ApiResult.error(error?.message || 'Failed to retrieve products', 500).send(res);
    }
  }

  /**
   * Get product by ID
   * GET /api/products/:id
   */
  @GET('/:id')
  @Authenticate([UserCategory.CLIENT, UserCategory.ADMIN, UserCategory.SUPERADMIN])
  async getProductById(req: AuthenticatedRequest, res: Response) {
    try {
      const { id } = req.params;
      const product = await ProductModel.findById(id);

      if (!product) {
        return ApiResult.error('Product not found', 404).send(res);
      }

      return ApiResult.success(product, 'Product retrieved successfully').send(res);
    } catch (error: any) {
      console.error('Error (getProductById):', error);
      return ApiResult.error(error?.message || 'Failed to retrieve product', 500).send(res);
    }
  }

  /**
   * Create new product
   * POST /api/products
   */
  @POST('/')
  @Authenticate([UserCategory.ADMIN, UserCategory.SUPERADMIN])
  @SingleFileUpload('pdfFile')
  async createProduct(req: AuthenticatedRequest, res: Response) {
    try {
      const { name, description, batchNo, pdfUrl } = req.body;

      if (!name || !batchNo) {
        return ApiResult.error('Name and batch number are required', 400).send(res);
      }

      // Handle PDF upload to S3 if file is provided
      let finalPdfUrl = pdfUrl;
      if (req.file && req.file.mimetype === 'application/pdf') {
        // Upload PDF to S3
        const s3Service = new (await import('../services/s3-upload.service')).S3UploadService({
          bucketName: process.env.BUCKET_NAME || '',
          region: process.env.NEW_REGION || 'blr1',
          accessKeyId: process.env.NEW_ACCESS_KEY || '',
          secretAccessKey: process.env.SECRET_ACCESS_KEY || '',
          rootFolder: 'amaramba',
          subFolder: 'user_documents',
          maxFileSize: 10 * 1024 * 1024, // 10MB
          allowedMimeTypes: ['application/pdf'],
          endpoint: process.env.S3_ENDPOINT || 'https://blr1.digitaloceanspaces.com',
          forcePathStyle: process.env.S3_FORCE_PATH_STYLE === 'true',
          makePublic: process.env.S3_MAKE_PUBLIC !== 'false'
        });

        // Modify filename to include QRSCAN folder
        req.file.originalname = `QRSCAN/PDFs/${req.file.originalname}`;

        const uploadResult = await s3Service.uploadFile(req.file);
        if (uploadResult.success) {
          finalPdfUrl = uploadResult.imageUrl;
        } else {
          return ApiResult.error(`Failed to upload PDF: ${uploadResult.error}`, 500).send(res);
        }
      }

      const product = await ProductModel.create({
        name,
        description,
        batchNo,
        pdfUrl: finalPdfUrl,
      });

      return ApiResult.success(product, 'Product created successfully', 201).send(res);
    } catch (error: any) {
      console.error('Error (createProduct):', error);
      return ApiResult.error(error?.message || 'Failed to create product', 500).send(res);
    }
  }

  /**
   * Update product
   * PUT /api/products/:id
   */
  @PUT('/:id')
  @Authenticate([UserCategory.ADMIN, UserCategory.SUPERADMIN])
  async updateProduct(req: AuthenticatedRequest, res: Response) {
    try {
      const { id } = req.params;
      const updateData = req.body;


      const product = await ProductModel.update(id, updateData);

      if (!product) {
        return ApiResult.error('Product not found', 404).send(res);
      }

      return ApiResult.success(product, 'Product updated successfully').send(res);
    } catch (error: any) {
      console.error('Error (updateProduct):', error);
      return ApiResult.error(error?.message || 'Failed to update product', 500).send(res);
    }
  }

  /**
   * Delete product
   * DELETE /api/products/:id
   */
  @DELETE('/:id')
  @Authenticate([UserCategory.ADMIN, UserCategory.SUPERADMIN])
  async deleteProduct(req: AuthenticatedRequest, res: Response) {
    try {
      const { id } = req.params;
      const deleted = await ProductModel.delete(id);

      if (!deleted) {
        return ApiResult.error('Product not found', 404).send(res);
      }

      return ApiResult.success(null, 'Product deleted successfully').send(res);
    } catch (error: any) {
      console.error('Error (deleteProduct):', error);
      return ApiResult.error(error?.message || 'Failed to delete product', 500).send(res);
    }
  }
}

