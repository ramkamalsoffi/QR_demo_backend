# Prisma Setup Guide

This guide will help you set up Prisma ORM for the QR Demo Backend.

## Prerequisites

- Node.js installed
- A database (PostgreSQL, MySQL, or SQLite)

## Quick Start

### 1. Install Dependencies

Dependencies are already installed. If you need to reinstall:

```bash
npm install
```

### 2. Configure Database URL

Add the `DATABASE_URL` to your `.env` file:

**PostgreSQL:**
```env
DATABASE_URL="postgresql://user:password@localhost:5432/qrdemo?schema=public"
```

**MySQL:**
```env
DATABASE_URL="mysql://user:password@localhost:3306/qrdemo"
```

**SQLite:**
```env
DATABASE_URL="file:./dev.db"
```

### 3. Generate Prisma Client

```bash
npm run prisma:generate
```

This generates the Prisma Client based on your schema.

### 4. Create Database Migration

```bash
npm run prisma:migrate
```

This will:
- Create a new migration file
- Apply the migration to your database
- Create the `products` and `customers` tables

### 5. (Optional) Seed Database

To populate the database with sample data:

```bash
npm run prisma:seed
```

## Database Schema

### Product Model

```prisma
model Product {
  id          String   @id @default(uuid())
  name        String
  description String?
  price       Float
  qrCode      String?
  pdfUrl      String?  // S3 URL - PDFs stored only in S3
  imageUrl    String?
  category    String?
  stock       Int?
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
}
```

**Important:** The `pdfUrl` field stores only the S3 URL reference. PDFs are stored in S3, not in the database.

### Customer Model

```prisma
model Customer {
  id        String   @id @default(uuid())
  name      String
  email     String   @unique
  phone     String?
  address   String?
  company   String?
  notes     String?
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}
```

## Prisma Commands

| Command | Description |
|---------|-------------|
| `npm run prisma:generate` | Generate Prisma Client |
| `npm run prisma:migrate` | Create and apply migrations |
| `npm run prisma:migrate:deploy` | Deploy migrations (production) |
| `npm run prisma:studio` | Open Prisma Studio (database GUI) |
| `npm run prisma:seed` | Seed database with sample data |

## Changing Database Provider

To change from PostgreSQL to MySQL or SQLite:

1. Edit `prisma/schema.prisma`:
   ```prisma
   datasource db {
     provider = "mysql"  // or "sqlite"
     url      = env("DATABASE_URL")
   }
   ```

2. Update `DATABASE_URL` in `.env`

3. Regenerate Prisma Client:
   ```bash
   npm run prisma:generate
   ```

4. Create a new migration:
   ```bash
   npm run prisma:migrate
   ```

## Troubleshooting

### Error: Can't reach database server

- Check if your database server is running
- Verify `DATABASE_URL` is correct in `.env`
- Check database credentials

### Error: Prisma Client not generated

Run:
```bash
npm run prisma:generate
```

### Error: Migration failed

- Check database connection
- Verify schema syntax in `prisma/schema.prisma`
- Check if tables already exist (may need to reset database)

### Reset Database (Development Only)

```bash
npx prisma migrate reset
```

**Warning:** This will delete all data in your database!

## Production Deployment

1. Set `DATABASE_URL` in your production environment
2. Run migrations:
   ```bash
   npm run prisma:migrate:deploy
   ```
3. Generate Prisma Client:
   ```bash
   npm run prisma:generate
   ```
4. Build and start:
   ```bash
   npm run build
   npm start
   ```

## PDF Storage Architecture

- **PDFs**: Stored in S3 bucket
- **Database**: Stores only the S3 URL in `pdfUrl` field
- **Workflow**:
  1. Upload PDF to S3 via `/s3-upload/upload-pdf`
  2. Get S3 URL from response
  3. Store S3 URL in product's `pdfUrl` field when creating/updating product

This approach ensures:
- PDFs are stored in scalable cloud storage
- Database remains lightweight
- Easy to manage and backup PDFs separately

