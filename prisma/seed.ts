import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database...');

  // Create admin user
  const adminEmail = 'admin@qrdemo.com';
  const adminPassword = 'admin123';
  
  const existingAdmin = await prisma.user.findUnique({
    where: { email: adminEmail },
  });

  let adminUser;
  if (!existingAdmin) {
    const hashedPassword = await bcrypt.hash(adminPassword, 10);
    adminUser = await prisma.user.create({
      data: {
        email: adminEmail,
        password: hashedPassword,
        name: 'Admin User',
        category: 'ADMIN',
        isActive: true,
      },
    });
    console.log('✅ Created admin user:', adminEmail);
  } else {
    adminUser = existingAdmin;
    console.log('ℹ️  Admin user already exists:', adminEmail);
  }

  // Create sample products
  const product1 = await prisma.product.create({
    data: {
      name: 'Sample Product 1',
      description: 'This is a sample product',
      price: 99.99,
      category: 'Electronics',
      stock: 100,
    },
  });

  const product2 = await prisma.product.create({
    data: {
      name: 'Sample Product 2',
      description: 'Another sample product',
      price: 149.99,
      category: 'Accessories',
      stock: 50,
    },
  });

  // Create sample customers
  const customer1 = await prisma.customer.create({
    data: {
      name: 'John Doe',
      email: 'john.doe@example.com',
      phone: '+1234567890',
      address: '123 Main St, New York, NY',
      company: 'Example Corp',
    },
  });

  const customer2 = await prisma.customer.create({
    data: {
      name: 'Jane Smith',
      email: 'jane.smith@example.com',
      phone: '+0987654321',
      address: '456 Oak Ave, Los Angeles, CA',
      company: 'Tech Solutions Inc',
    },
  });

  console.log('✅ Seeding completed!');
  console.log('📦 Created products:', { product1, product2 });
  console.log('👥 Created customers:', { customer1, customer2 });
  console.log('🔐 Admin credentials:', { email: adminEmail, password: adminPassword });
}

main()
  .catch((e) => {
    console.error('Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

