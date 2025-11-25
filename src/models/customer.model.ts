import prisma from '../lib/prisma';

export interface Customer {
  id: string;
  email: string;
  batchNo: string;
  ipAddress: string;
  device?: string | null;
  os?: string | null;
  location?: string | null;
  browser?: string | null;
  submittedAt: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateCustomerDto {
  email: string;
  batchNo: string;
  ipAddress: string;
  device?: string;
  os?: string;
  location?: string;
  browser?: string;
}

export interface UpdateCustomerDto {
  email?: string;
  batchNo?: string;
  ipAddress?: string;
  device?: string;
  os?: string;
  location?: string;
  browser?: string;
}

export class CustomerModel {
  static async findAll(): Promise<Customer[]> {
    try {
      return await prisma.customer.findMany({
        orderBy: {
          createdAt: 'desc',
        },
      });
    } catch (error: any) {
      console.error('Database error in findAll:', error);
      // Return empty array if database not available
      return [];
    }
  }

  static async findById(id: string): Promise<Customer | null> {
    return await prisma.customer.findUnique({
      where: { id },
    });
  }

  static async findByEmail(email: string): Promise<Customer | null> {
    return await prisma.customer.findFirst({
      where: { email },
      orderBy: { submittedAt: 'desc' },
    });
  }

  static async findByBatchNo(batchNo: string): Promise<Customer[]> {
    return await prisma.customer.findMany({
      where: { batchNo },
      orderBy: { submittedAt: 'desc' },
    });
  }

  static async create(data: CreateCustomerDto): Promise<Customer> {
    return await prisma.customer.create({
      data: {
        email: data.email,
        batchNo: data.batchNo,
        ipAddress: data.ipAddress,
        device: data.device,
        os: data.os,
        location: data.location,
        browser: data.browser,
      },
    });
  }

  static async update(id: string, data: UpdateCustomerDto): Promise<Customer | null> {
    try {
      const updateData: any = {};
      
      if (data.email !== undefined) updateData.email = data.email;
      if (data.batchNo !== undefined) updateData.batchNo = data.batchNo;
      if (data.ipAddress !== undefined) updateData.ipAddress = data.ipAddress;
      if (data.device !== undefined) updateData.device = data.device || null;
      if (data.os !== undefined) updateData.os = data.os || null;
      if (data.location !== undefined) updateData.location = data.location || null;
      if (data.browser !== undefined) updateData.browser = data.browser || null;

      return await prisma.customer.update({
        where: { id },
        data: updateData,
      });
    } catch (error) {
      return null;
    }
  }

  static async delete(id: string): Promise<boolean> {
    try {
      await prisma.customer.delete({
        where: { id },
      });
      return true;
    } catch (error) {
      return false;
    }
  }
}
