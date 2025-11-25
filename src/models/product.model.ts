import prisma from '../lib/prisma';

export interface Product {
  id: string;
  name: string;
  description?: string | null;
  batchNo: string;
  pdfUrl?: string | null; // S3 URL - PDFs stored only in S3
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateProductDto {
  name: string;
  description?: string;
  batchNo: string;
  pdfUrl?: string;
}

export interface UpdateProductDto {
  name?: string;
  description?: string;
  batchNo?: string;
  pdfUrl?: string;
}

export class ProductModel {
  static async findAll(): Promise<Product[]> {
    try {
      return await prisma.product.findMany({
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

  static async findById(id: string): Promise<Product | null> {
    return await prisma.product.findUnique({
      where: { id },
    });
  }

  static async create(data: CreateProductDto): Promise<Product> {
    return await prisma.product.create({
      data: {
        name: data.name,
        description: data.description,
        batchNo: data.batchNo,
        pdfUrl: data.pdfUrl, // S3 URL stored in DB
      },
    });
  }

  static async update(id: string, data: UpdateProductDto): Promise<Product | null> {
    try {
      const updateData: any = {};
      
      if (data.name !== undefined) updateData.name = data.name;
      if (data.description !== undefined) updateData.description = data.description || null;
      if (data.batchNo !== undefined) updateData.batchNo = data.batchNo;
      if (data.pdfUrl !== undefined) updateData.pdfUrl = data.pdfUrl || null; // S3 URL

      return await prisma.product.update({
        where: { id },
        data: updateData,
      });
    } catch (error) {
      return null;
    }
  }

  static async delete(id: string): Promise<boolean> {
    try {
      await prisma.product.delete({
        where: { id },
      });
      return true;
    } catch (error) {
      return false;
    }
  }
}
