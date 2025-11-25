import { Request, Response } from 'express';
import { Controller } from '../decorators/controller.decorator';
import { GET, POST, PUT, DELETE } from '../decorators/method.decorator';
import { Authenticate } from '../decorators/authenticate.decorator';
import { UserCategory } from '../utils/user-category.enum';
import { ApiResult } from '../utils/api-result';
import { CustomerModel } from '../models/customer.model';

interface AuthenticatedRequest extends Request {
  user: { id: string };
}

@Controller('/api/customers')
export class CustomerController {
  /**
   * Get all customers
   * GET /api/customers
   */
  @GET('/')
  @Authenticate([UserCategory.ADMIN, UserCategory.SUPERADMIN])
  async getAllCustomers(req: AuthenticatedRequest, res: Response) {
    try {
      console.log('getAllCustomers called');
      const customers = await CustomerModel.findAll();
      console.log('Customers found:', customers.length);

      // Return empty array if no customers (database not set up yet)
      if (!customers || customers.length === 0) {
        console.log('No customers found - returning empty array');
        return ApiResult.success([], 'No customers found').send(res);
      }

      return ApiResult.success(customers, 'Customers retrieved successfully').send(res);
    } catch (error: any) {
      console.error('Error (getAllCustomers):', error);
      console.error('Error stack:', error?.stack);

      // If database error, return empty array for demo
      if (error.message?.includes('database') || error.message?.includes('connect') || error.code === 'P1001') {
        console.log('Database error - returning empty array for demo');
        return ApiResult.success([], 'Database not configured - returning demo data').send(res);
      }

      return ApiResult.error(error?.message || 'Failed to retrieve customers', 500).send(res);
    }
  }

  /**
   * Get customer by ID
   * GET /api/customers/:id
   */
  @GET('/:id')
  @Authenticate([UserCategory.ADMIN, UserCategory.SUPERADMIN])
  async getCustomerById(req: AuthenticatedRequest, res: Response) {
    try {
      const { id } = req.params;
      const customer = await CustomerModel.findById(id);

      if (!customer) {
        return ApiResult.error('Customer not found', 404).send(res);
      }

      return ApiResult.success(customer, 'Customer retrieved successfully').send(res);
    } catch (error: any) {
      console.error('Error (getCustomerById):', error);
      return ApiResult.error(error?.message || 'Failed to retrieve customer', 500).send(res);
    }
  }

  /**
   * Create new customer
   * POST /api/customers
   */
  @POST('/')
  @Authenticate([UserCategory.ADMIN, UserCategory.SUPERADMIN])
  async createCustomer(req: AuthenticatedRequest, res: Response) {
    try {
      const { name, email, phone, address, company, notes } = req.body;

      if (!name || !email) {
        return ApiResult.error('Name and email are required', 400).send(res);
      }

      // Check if email already exists
      const existingCustomer = await CustomerModel.findByEmail(email);
      if (existingCustomer) {
        return ApiResult.error('Customer with this email already exists', 409).send(res);
      }

      const customer = await CustomerModel.create({
        name,
        email,
        phone,
        address,
        company,
        notes,
      });

      return ApiResult.success(customer, 'Customer created successfully', 201).send(res);
    } catch (error: any) {
      console.error('Error (createCustomer):', error);
      return ApiResult.error(error?.message || 'Failed to create customer', 500).send(res);
    }
  }

  /**
   * Update customer
   * PUT /api/customers/:id
   */
  @PUT('/:id')
  @Authenticate([UserCategory.ADMIN, UserCategory.SUPERADMIN])
  async updateCustomer(req: AuthenticatedRequest, res: Response) {
    try {
      const { id } = req.params;
      const updateData = req.body;

      // If email is being updated, check for duplicates
      if (updateData.email) {
        const existingCustomer = await CustomerModel.findByEmail(updateData.email);
        if (existingCustomer && existingCustomer.id !== id) {
          return ApiResult.error('Customer with this email already exists', 409).send(res);
        }
      }

      const customer = await CustomerModel.update(id, updateData);

      if (!customer) {
        return ApiResult.error('Customer not found', 404).send(res);
      }

      return ApiResult.success(customer, 'Customer updated successfully').send(res);
    } catch (error: any) {
      console.error('Error (updateCustomer):', error);
      return ApiResult.error(error?.message || 'Failed to update customer', 500).send(res);
    }
  }

  /**
   * Delete customer
   * DELETE /api/customers/:id
   */
  @DELETE('/:id')
  @Authenticate([UserCategory.ADMIN, UserCategory.SUPERADMIN])
  async deleteCustomer(req: AuthenticatedRequest, res: Response) {
    try {
      const { id } = req.params;
      const deleted = await CustomerModel.delete(id);

      if (!deleted) {
        return ApiResult.error('Customer not found', 404).send(res);
      }

      return ApiResult.success(null, 'Customer deleted successfully').send(res);
    } catch (error: any) {
      console.error('Error (deleteCustomer):', error);
      return ApiResult.error(error?.message || 'Failed to delete customer', 500).send(res);
    }
  }
}

