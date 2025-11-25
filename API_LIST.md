# Complete API List

Base URL: `http://localhost:5000`

All endpoints require authentication via Bearer token:
```
Authorization: Bearer <your-token>
```

---

## 📋 Health Check

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/health` | Check server status | No |

---

## 📦 Product APIs

| Method | Endpoint | Description | Auth Required | Roles |
|--------|----------|-------------|---------------|-------|
| GET | `/api/products` | Get all products | Yes | CLIENT, ADMIN, SUPERADMIN |
| GET | `/api/products/:id` | Get product by ID | Yes | CLIENT, ADMIN, SUPERADMIN |
| POST | `/api/products` | Create new product | Yes | ADMIN, SUPERADMIN |
| PUT | `/api/products/:id` | Update product | Yes | ADMIN, SUPERADMIN |
| DELETE | `/api/products/:id` | Delete product | Yes | ADMIN, SUPERADMIN |

### Request/Response Examples

**Create Product:**
```bash
POST /api/products
Content-Type: application/json

{
  "name": "Product Name",
  "description": "Product Description",
  "price": 99.99,
  "qrCode": "QR_CODE_STRING",
  "pdfUrl": "https://...",
  "imageUrl": "https://...",
  "category": "Category Name",
  "stock": 100
}
```

**Update Product:**
```bash
PUT /api/products/:id
Content-Type: application/json

{
  "name": "Updated Name",
  "price": 149.99
}
```

---

## 👥 Customer APIs

| Method | Endpoint | Description | Auth Required | Roles |
|--------|----------|-------------|---------------|-------|
| GET | `/api/customers` | Get all customers | Yes | ADMIN, SUPERADMIN |
| GET | `/api/customers/:id` | Get customer by ID | Yes | ADMIN, SUPERADMIN |
| POST | `/api/customers` | Create new customer | Yes | ADMIN, SUPERADMIN |
| PUT | `/api/customers/:id` | Update customer | Yes | ADMIN, SUPERADMIN |
| DELETE | `/api/customers/:id` | Delete customer | Yes | ADMIN, SUPERADMIN |

### Request/Response Examples

**Create Customer:**
```bash
POST /api/customers
Content-Type: application/json

{
  "name": "Customer Name",
  "email": "customer@example.com",
  "phone": "+1234567890",
  "address": "123 Main St",
  "company": "Company Name",
  "notes": "Additional notes"
}
```

**Update Customer:**
```bash
PUT /api/customers/:id
Content-Type: application/json

{
  "name": "Updated Name",
  "email": "updated@example.com"
}
```

---

## 📤 S3 Upload APIs

| Method | Endpoint | Description | Auth Required | Roles | Max Size |
|--------|----------|-------------|---------------|-------|----------|
| POST | `/s3-upload/upload-single-new-folder` | Upload single file to S3 | Yes | CLIENT, ADMIN, SUPERADMIN | 10MB |
| POST | `/s3-upload/upload-pdf` | Upload PDF file to S3 | Yes | CLIENT, ADMIN, SUPERADMIN | 10MB |

### Request/Response Examples

**Upload Single File:**
```bash
POST /s3-upload/upload-single-new-folder
Content-Type: multipart/form-data

file: <file>
```

**Response:**
```json
{
  "success": true,
  "message": "File uploaded successfully to new folder",
  "data": {
    "imageUrl": "https://...",
    "fileName": "filename.pdf",
    "fileSize": 1024000,
    "folder": "QRSCAN"
  }
}
```

**Upload PDF:**
```bash
POST /s3-upload/upload-pdf
Content-Type: multipart/form-data

file: <pdf-file>
```

**Response:**
```json
{
  "success": true,
  "message": "PDF uploaded successfully",
  "data": {
    "pdfUrl": "https://...",
    "fileName": "document.pdf",
    "fileSize": 2048000,
    "folder": "QRSCAN/PDFs"
  }
}
```

### Allowed File Types

**upload-single-new-folder:**
- Images: JPEG, JPG, PNG, GIF, WEBP
- Documents: PDF
- Videos: MP4, QuickTime, AVI

**upload-pdf:**
- Documents: PDF only

---

## 🔐 Authentication

All endpoints (except `/health`) require authentication. Include the Bearer token in the Authorization header:

```bash
Authorization: Bearer <your-token>
```

### User Roles

- **CLIENT** - Can view products and upload files
- **ADMIN** - Full access to products, customers, and file uploads
- **SUPERADMIN** - Full access to all resources

---

## 📊 Response Format

All APIs return responses in the following format:

**Success Response:**
```json
{
  "success": true,
  "message": "Operation successful",
  "data": { ... }
}
```

**Error Response:**
```json
{
  "success": false,
  "message": "Error message",
  "error": "Detailed error (in development mode)"
}
```

---

## 🚨 HTTP Status Codes

| Code | Description |
|------|-------------|
| 200 | Success |
| 201 | Created |
| 400 | Bad Request |
| 401 | Unauthorized |
| 403 | Forbidden |
| 404 | Not Found |
| 409 | Conflict (e.g., duplicate email) |
| 500 | Internal Server Error |

---

## 📝 Quick Reference

### Product Operations
- List: `GET /api/products`
- View: `GET /api/products/:id`
- Create: `POST /api/products`
- Update: `PUT /api/products/:id`
- Delete: `DELETE /api/products/:id`

### Customer Operations
- List: `GET /api/customers`
- View: `GET /api/customers/:id`
- Create: `POST /api/customers`
- Update: `PUT /api/customers/:id`
- Delete: `DELETE /api/customers/:id`

### File Upload Operations
- Upload any file: `POST /s3-upload/upload-single-new-folder`
- Upload PDF: `POST /s3-upload/upload-pdf`

---

For detailed API documentation with request/response examples, see [API_DOCUMENTATION.md](./API_DOCUMENTATION.md).

