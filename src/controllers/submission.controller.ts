import { Request, Response } from 'express';
import { Controller } from '../decorators/controller.decorator';
import { POST } from '../decorators/method.decorator';
import { ApiResult } from '../utils/api-result';
import { CustomerModel } from '../models/customer.model';
import { ProductModel } from '../models/product.model';
import { getClientIp, getDeviceInfo, getLocationFromIp } from '../utils/ip-utils';

@Controller('/api/submission')
export class SubmissionController {
  /**
   * Submit form with email and batch number
   * POST /api/submission
   * 
   * Body: { email: string, batchNo: string }
   * Returns: { pdfUrl: string }
   */
  @POST('/')
  async submitForm(req: Request, res: Response) {
    try {
      const { email, batchNo } = req.body;

      // Validate input
      if (!email || !batchNo) {
        return ApiResult.error('Email and batch number are required', 400).send(res);
      }

      // Validate email format
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        return ApiResult.error('Invalid email format', 400).send(res);
      }

      // Get IP address
      const ipAddress = getClientIp(req);

      // Get device info from User-Agent
      const deviceInfo = getDeviceInfo(req);

      // Get location from IP
      const locationInfo = getLocationFromIp(ipAddress);

      // Find product by batch number
      const products = await ProductModel.findAll();
      const product = products.find(p => p.batchNo === batchNo);

      if (!product) {
        return ApiResult.error('Product not found for the given batch number', 404).send(res);
      }

      if (!product.pdfUrl) {
        return ApiResult.error('PDF not available for this product', 404).send(res);
      }

      // Store submission in Customer table
      const customer = await CustomerModel.create({
        email,
        batchNo,
        ipAddress,
        device: deviceInfo.device,
        os: deviceInfo.os,
        browser: deviceInfo.browser,
        location: locationInfo.location,
      });

      console.log('Form submission stored:', {
        id: customer.id,
        email: customer.email,
        batchNo: customer.batchNo,
        ipAddress: customer.ipAddress,
        location: customer.location,
      });

      // Return PDF URL
      return ApiResult.success(
        {
          pdfUrl: product.pdfUrl,
          productName: product.name,
          submittedAt: customer.submittedAt,
        },
        'Form submitted successfully'
      ).send(res);
    } catch (error: any) {
      console.error('Error (submitForm):', error);
      return ApiResult.error(error?.message || 'Failed to submit form', 500).send(res);
    }
  }
}

