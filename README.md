# QR Demo Backend

Backend API server for QR Demo application with Product and Customer CRUD operations and S3 file upload functionality.

## Features

- ✅ Product CRUD operations
- ✅ Customer CRUD operations
- ✅ S3 file upload (PDF, Images, Videos) - PDFs stored only in S3
- ✅ Prisma ORM with PostgreSQL/MySQL/SQLite support
- ✅ Authentication middleware
- ✅ TypeScript support
- ✅ Express.js with decorators

## Installation

1. Install dependencies:
```bash
npm install
```

2. Create a `.env` file in the root directory with the following variables:
```env
PORT=5000
DATABASE_URL="postgresql://user:password@localhost:5432/qrdemo?schema=public"
# For MySQL: DATABASE_URL="mysql://user:password@localhost:3306/qrdemo"
# For SQLite: DATABASE_URL="file:./dev.db"

BUCKET_NAME=your-bucket-name
NEW_REGION=blr1
NEW_ACCESS_KEY=your-access-key
SECRET_ACCESS_KEY=your-secret-key
S3_ENDPOINT=https://blr1.digitaloceanspaces.com
S3_FORCE_PATH_STYLE=false
S3_MAKE_PUBLIC=true
NODE_ENV=development
```

3. Set up the database:
```bash
# Generate Prisma Client
npm run prisma:generate

# Run database migrations
npm run prisma:migrate

# (Optional) Seed the database with sample data
npm run prisma:seed
```

## Running the Server

### Development Mode
```bash
npm run dev
```

### Production Mode
```bash
npm run build
npm start
```

The server will start on `http://localhost:5000` (or the PORT specified in your `.env` file).

## API Endpoints

### Products
- `GET /api/products` - Get all products
- `GET /api/products/:id` - Get product by ID
- `POST /api/products` - Create new product
- `PUT /api/products/:id` - Update product
- `DELETE /api/products/:id` - Delete product

### Customers
- `GET /api/customers` - Get all customers
- `GET /api/customers/:id` - Get customer by ID
- `POST /api/customers` - Create new customer
- `PUT /api/customers/:id` - Update customer
- `DELETE /api/customers/:id` - Delete customer

### S3 Upload
- `POST /s3-upload/upload-single-new-folder` - Upload single file to S3
- `POST /s3-upload/upload-pdf` - Upload PDF file to S3

### Health Check
- `GET /health` - Check server status

For detailed API documentation, see [API_DOCUMENTATION.md](./API_DOCUMENTATION.md).

## Project Structure

```
QR_demo_backend/
├── prisma/
│   ├── schema.prisma         # Prisma schema definition
│   └── seed.ts               # Database seeding script
├── src/
│   ├── lib/
│   │   └── prisma.ts         # Prisma client instance
│   ├── controllers/          # API controllers
│   │   ├── product.controller.ts
│   │   ├── customer.controller.ts
│   │   └── s3-upload.controller.ts
│   ├── decorators/           # Custom decorators
│   │   ├── controller.decorator.ts
│   │   ├── method.decorator.ts
│   │   ├── authenticate.decorator.ts
│   │   └── file-upload.decorator.ts
│   ├── models/               # Data models (using Prisma)
│   │   ├── product.model.ts
│   │   └── customer.model.ts
│   ├── services/             # Business logic services
│   │   └── s3-upload.service.ts
│   ├── utils/                # Utility functions
│   │   ├── api-result.ts
│   │   └── user-category.enum.ts
│   └── server.ts             # Main server file
├── .env                      # Environment variables
├── package.json
├── tsconfig.json
└── README.md
```

## Dependencies

### Production
- `express` - Web framework
- `@prisma/client` - Prisma ORM client
- `axios` - HTTP client
- `@aws-sdk/client-s3` - AWS S3 client
- `@aws-sdk/lib-storage` - S3 upload library
- `multer` - File upload middleware
- `cors` - CORS middleware
- `dotenv` - Environment variables

### Development
- `prisma` - Prisma CLI
- `typescript` - TypeScript compiler
- `ts-node-dev` - Development server
- `@types/*` - TypeScript type definitions

## Authentication

All endpoints require authentication via Bearer token in the Authorization header:
```
Authorization: Bearer <your-token>
```

**Note:** The current authentication implementation is a mock. Replace the authentication logic in `src/decorators/authenticate.decorator.ts` with your actual JWT verification or session management.

## Prisma Commands

- `npm run prisma:generate` - Generate Prisma Client
- `npm run prisma:migrate` - Create and run database migrations
- `npm run prisma:migrate:deploy` - Deploy migrations (production)
- `npm run prisma:studio` - Open Prisma Studio (database GUI)
- `npm run prisma:seed` - Seed database with sample data

## Notes

- **Database**: Using Prisma ORM with PostgreSQL (can be changed to MySQL or SQLite in `prisma/schema.prisma`)
- **PDF Storage**: PDFs are stored only in S3. The `pdfUrl` field in the database stores the S3 URL reference.
- **S3 Configuration**: Set up for DigitalOcean Spaces (blr1 region). Adjust configuration for other S3-compatible services.
- **File Uploads**: Limited to 10MB by default.
- **Allowed File Types**: Images (JPEG, JPG, PNG, GIF, WEBP), PDF, Videos (MP4, QuickTime, AVI).

## License

ISC

