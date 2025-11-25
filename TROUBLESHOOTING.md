# Troubleshooting 500 Error on Login

## Steps to Debug

### 1. Check Server Console Logs
When you start the server, you should see:
```
📋 Registering routes:
  /api/auth -> Auth routes (router found)
✅ Auth routes registered at /api/auth
   Registered auth routes: [ 'POST /api/auth/login', 'POST /api/auth/default-credentials' ]
```

If you see "router NOT found" or "No routes found", the decorators aren't working.

### 2. Check Error Details
The enhanced logging will now show:
- Login endpoint called
- Attempting to login user
- Error details with stack trace
- Error code and message

### 3. Common Issues

#### Issue: Route Not Registered
**Symptoms:** 404 error or "Route not found"
**Solution:** 
- Check console logs for route registration
- Ensure AuthController is imported in server.ts
- Restart server after code changes

#### Issue: Database Connection Error
**Symptoms:** Error message about database connection
**Solution:**
- Check DATABASE_URL in .env
- Verify database server is running
- Test connection: `npx prisma db pull`

#### Issue: User Table Doesn't Exist
**Symptoms:** Error about table "users" not existing
**Solution:**
- Run migration: `npm run prisma:migrate`
- Or push schema: `npx prisma db push`
- Then seed: `npm run prisma:seed`

#### Issue: Prisma Client Not Generated
**Symptoms:** Error about "Cannot read properties of undefined"
**Solution:**
- Run: `npm run prisma:generate`
- Restart server

### 4. Test Endpoints

Test health endpoint first:
```bash
GET http://localhost:5000/health
```

Test login endpoint:
```bash
POST http://localhost:5000/api/auth/login
Content-Type: application/json

{
  "email": "admin@qrdemo.com",
  "password": "admin123"
}
```

### 5. Check Browser Network Tab
- Look at the actual error response body
- Check the status code
- Verify request payload is correct

### 6. Check Server Logs
The server console will now show detailed error information including:
- Error message
- Error stack trace
- Error code
- Request path and method

## Quick Fixes

1. **Restart Server:**
   ```bash
   # Stop server (Ctrl+C)
   npm run dev
   ```

2. **Regenerate Prisma Client:**
   ```bash
   npm run prisma:generate
   ```

3. **Check Database:**
   ```bash
   npx prisma studio
   ```
   Verify User table exists and has admin user

4. **Clear and Rebuild:**
   ```bash
   rm -rf node_modules/.prisma
   npm run prisma:generate
   npm run dev
   ```

