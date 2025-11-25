# Database Connection Fix

## Current Error
```
Can't reach database server at `aws-1-ap-northeast-2.pooler.supabase.com:6543`
```

## Issue
The database connection is failing. This could be due to:
1. Incorrect DATABASE_URL in `.env` file
2. Database server is down or unreachable
3. Network/firewall issues
4. Wrong port number (notice it's trying port 6543, not 5432)

## Solutions

### 1. Check Your .env File

Make sure your `.env` file has the correct DATABASE_URL:

**For Supabase (PostgreSQL):**
```env
DATABASE_URL="postgresql://user:password@aws-1-ap-northeast-2.pooler.supabase.com:5432/postgres?schema=public"
DIRECT_URL="postgresql://user:password@aws-1-ap-northeast-2.pooler.supabase.com:5432/postgres?schema=public"
```

**Important Notes:**
- Port should be `5432` for direct connection or `6543` for connection pooling
- Replace `user` and `password` with your actual credentials
- Get the connection string from your Supabase dashboard

### 2. Get Correct Connection String from Supabase

1. Go to your Supabase project dashboard
2. Navigate to Settings → Database
3. Copy the connection string under "Connection string" or "Connection pooling"
4. Use the appropriate one:
   - **Direct connection**: Port 5432 (for migrations)
   - **Connection pooling**: Port 6543 (for application queries)

### 3. Test Database Connection

```bash
# Test connection
npx prisma db pull
```

If this works, your connection is fine.

### 4. Create User Table Manually (If Connection Works)

If you can connect but the User table doesn't exist, run:

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

### 5. Alternative: Use Local Database for Development

If Supabase connection is problematic, use a local PostgreSQL:

```env
DATABASE_URL="postgresql://postgres:password@localhost:5432/qrdemo?schema=public"
DIRECT_URL="postgresql://postgres:password@localhost:5432/qrdemo?schema=public"
```

Then:
```bash
npx prisma db push
npm run prisma:seed
```

## Quick Fix Checklist

- [ ] Check `.env` file has correct DATABASE_URL
- [ ] Verify database server is running/accessible
- [ ] Check if port is correct (5432 vs 6543)
- [ ] Test connection with `npx prisma db pull`
- [ ] Create User table if it doesn't exist
- [ ] Seed admin user: `npm run prisma:seed`
- [ ] Restart server: `npm run dev`

## Error Handling

The code now includes better error messages for database connection failures. You'll see:
- Clear error message if database is unreachable
- Instructions on what to check
- HTTP 503 status for service unavailable

