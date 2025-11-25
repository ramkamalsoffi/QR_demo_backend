# Migration Instructions for User Model

## Issue
The error "Cannot read properties of undefined (reading 'findUnique')" occurs because:
1. Prisma Client needs to be regenerated after adding the User model ✅ (Done)
2. The User table needs to be created in the database (Pending)

## Steps to Fix

### 1. Prisma Client Generated ✅
```bash
npm run prisma:generate
```
This has been completed.

### 2. Create Database Migration

**Option A: If you want to reset the database (loses all data):**
```bash
npm run prisma:migrate reset
```
Then seed:
```bash
npm run prisma:seed
```

**Option B: If you want to keep existing data:**
```bash
# Create migration file only
npx prisma migrate dev --create-only --name add_user_model

# Edit the migration file in prisma/migrations/[timestamp]_add_user_model/migration.sql
# Add only the User table creation SQL

# Apply the migration
npx prisma migrate deploy
```

**Option C: Manual SQL (if database connection works):**
Run this SQL directly in your database:
```sql
CREATE TABLE IF NOT EXISTS "users" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "name" TEXT,
    "category" TEXT NOT NULL DEFAULT 'ADMIN',
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX IF NOT EXISTS "users_email_key" ON "users"("email");
CREATE INDEX IF NOT EXISTS "users_email_idx" ON "users"("email");
```

### 3. Seed Admin User
After the table is created, run:
```bash
npm run prisma:seed
```

This will create:
- Email: `admin@qrdemo.com`
- Password: `admin123`

### 4. Restart Server
```bash
npm run dev
```

## Verify

1. Check if User table exists:
```bash
npx prisma studio
```
Open the Users table to verify.

2. Test login endpoint:
```bash
POST http://localhost:5000/api/auth/login
Body: {
  "email": "admin@qrdemo.com",
  "password": "admin123"
}
```

## Current Status

- ✅ Prisma schema updated with User model
- ✅ Prisma Client generated
- ✅ User model code created
- ✅ Auth controller created
- ✅ Seed script updated
- ⏳ Database migration pending (User table needs to be created)
- ⏳ Admin user seeding pending

