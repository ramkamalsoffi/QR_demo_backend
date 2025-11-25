import prisma from '../lib/prisma';
import bcrypt from 'bcryptjs';

export interface User {
  id: string;
  email: string;
  password: string;
  name?: string | null;
  category: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateUserDto {
  email: string;
  password: string;
  name?: string;
  category?: string;
}

export interface LoginDto {
  email: string;
  password: string;
}

export class UserModel {
  static async findByEmail(email: string): Promise<User | null> {
    try {
      return await prisma.user.findUnique({
        where: { email },
      });
    } catch (error: any) {
      console.error('Error finding user by email:', error);
      // Check if it's a connection error
      if (error.message?.includes("Can't reach database server") || error.code === 'P1001') {
        throw new Error('Database connection failed. Please check your DATABASE_URL in .env file and ensure the database server is running.');
      }
      throw error;
    }
  }

  static async findById(id: string): Promise<User | null> {
    return await prisma.user.findUnique({
      where: { id },
    });
  }

  static async create(data: CreateUserDto): Promise<User> {
    try {
      const hashedPassword = await bcrypt.hash(data.password, 10);
      return await prisma.user.create({
        data: {
          email: data.email,
          password: hashedPassword,
          name: data.name,
          category: data.category || 'ADMIN',
        },
      });
    } catch (error: any) {
      console.error('Error creating user:', error);
      // Check if it's a connection error
      if (error.message?.includes("Can't reach database server") || error.code === 'P1001') {
        throw new Error('Database connection failed. Please check your DATABASE_URL in .env file and ensure the database server is running.');
      }
      throw error;
    }
  }

  static async verifyPassword(user: User, password: string): Promise<boolean> {
    return await bcrypt.compare(password, user.password);
  }

  static async login(email: string, password: string): Promise<Omit<User, 'password'> | null> {
    const user = await this.findByEmail(email);
    if (!user || !user.isActive) {
      return null;
    }

    const isValid = await this.verifyPassword(user, password);
    if (!isValid) {
      return null;
    }

    // Return user without password
    const { password: _, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }
}

