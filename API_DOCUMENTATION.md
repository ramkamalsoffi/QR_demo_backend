# API Documentation

Base URL: `http://localhost:5000`

All endpoints require authentication via Bearer token in the Authorization header:
```
Authorization: Bearer <your-token>
```

---

## Health Check

### GET /health
Check if the server is running.

**Response:**
```json
{
  "status": "OK",
  "message": "Server is running"
}
```

---

## Product APIs

### 1. Get All Products
**GET** `/api/products`

**Authentication:** Required (CLIENT, ADMIN, SUPERADMIN)

**Response:**
```json
{
  "success": true,
  "message": "Products retrieved successfully",
  "data": [
    {
      "id": "uuid",
      "name": "Product Name",
      "description": "Product Description",
      "price": 99.99,
      "qrCode": "QR_CODE_STRING",
      "pdfUrl": "https://...",
      "imageUrl": "https://...",
      "category": "Category Name",
      "stock": 100,
      "createdAt": "2024-01-01T00:00:00.000Z",
      "updatedAt": "2024-01-01T00:00:00.000Z"
    }
  ]
}
```

### 2. Get Product by ID
**GET** `/api/products/:id`

**Authentication:** Required (CLIENT, ADMIN, SUPERADMIN)

**Parameters:**
- `id` (path) - Product ID

**Response:**
```json
{
  "success": true,
  "message": "Product retrieved successfully",
  "data": {
    "id": "uuid",
    "name": "Product Name",
    "description": "Product Description",
    "price": 99.99,
    "qrCode": "QR_CODE_STRING",
    "pdfUrl": "https://...",
    "imageUrl": "https://...",
    "category": "Category Name",
    "stock": 100,
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  }
}
```

### 3. Create Product
**POST** `/api/products`

**Authentication:** Required (ADMIN, SUPERADMIN)

**Request Body:**
```json
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

**Required Fields:**
- `name` (string)
- `price` (number)

**Response:**
```json
{
  "success": true,
  "message": "Product created successfully",
  "data": {
    "id": "uuid",
    "name": "Product Name",
    "price": 99.99,
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  }
}
```

### 4. Update Product
**PUT** `/api/products/:id`

**Authentication:** Required (ADMIN, SUPERADMIN)

**Parameters:**
- `id` (path) - Product ID

**Request Body:**
```json
{
  "name": "Updated Product Name",
  "price": 149.99,
  "stock": 50
}
```

**Response:**
```json
{
  "success": true,
  "message": "Product updated successfully",
  "data": {
    "id": "uuid",
    "name": "Updated Product Name",
    "price": 149.99,
    "updatedAt": "2024-01-01T00:00:00.000Z"
  }
}
```

### 5. Delete Product
**DELETE** `/api/products/:id`

**Authentication:** Required (ADMIN, SUPERADMIN)

**Parameters:**
- `id` (path) - Product ID

**Response:**
```json
{
  "success": true,
  "message": "Product deleted successfully",
  "data": null
}
```

---

## Customer APIs

### 1. Get All Customers
**GET** `/api/customers`

**Authentication:** Required (ADMIN, SUPERADMIN)

**Response:**
```json
{
  "success": true,
  "message": "Customers retrieved successfully",
  "data": [
    {
      "id": "uuid",
      "name": "Customer Name",
      "email": "customer@example.com",
      "phone": "+1234567890",
      "address": "123 Main St",
      "company": "Company Name",
      "notes": "Additional notes",
      "createdAt": "2024-01-01T00:00:00.000Z",
      "updatedAt": "2024-01-01T00:00:00.000Z"
    }
  ]
}
```

### 2. Get Customer by ID
**GET** `/api/customers/:id`

**Authentication:** Required (ADMIN, SUPERADMIN)

**Parameters:**
- `id` (path) - Customer ID

**Response:**
```json
{
  "success": true,
  "message": "Customer retrieved successfully",
  "data": {
    "id": "uuid",
    "name": "Customer Name",
    "email": "customer@example.com",
    "phone": "+1234567890",
    "address": "123 Main St",
    "company": "Company Name",
    "notes": "Additional notes",
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  }
}
```

### 3. Create Customer
**POST** `/api/customers`

**Authentication:** Required (ADMIN, SUPERADMIN)

**Request Body:**
```json
{
  "name": "Customer Name",
  "email": "customer@example.com",
  "phone": "+1234567890",
  "address": "123 Main St",
  "company": "Company Name",
  "notes": "Additional notes"
}
```

**Required Fields:**
- `name` (string)
- `email` (string)

**Response:**
```json
{
  "success": true,
  "message": "Customer created successfully",
  "data": {
    "id": "uuid",
    "name": "Customer Name",
    "email": "customer@example.com",
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  }
}
```

### 4. Update Customer
**PUT** `/api/customers/:id`

**Authentication:** Required (ADMIN, SUPERADMIN)

**Parameters:**
- `id` (path) - Customer ID

**Request Body:**
```json
{
  "name": "Updated Customer Name",
  "email": "updated@example.com",
  "phone": "+9876543210"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Customer updated successfully",
  "data": {
    "id": "uuid",
    "name": "Updated Customer Name",
    "email": "updated@example.com",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  }
}
```

### 5. Delete Customer
**DELETE** `/api/customers/:id`

**Authentication:** Required (ADMIN, SUPERADMIN)

**Parameters:**
- `id` (path) - Customer ID

**Response:**
```json
{
  "success": true,
  "message": "Customer deleted successfully",
  "data": null
}
```

---

## S3 Upload APIs

### 1. Upload Single File (New Folder)
**POST** `/s3-upload/upload-single-new-folder`

**Authentication:** Required (CLIENT, ADMIN, SUPERADMIN)

**Content-Type:** `multipart/form-data`

**Form Data:**
- `file` (file) - File to upload

**Allowed File Types:**
- Images: JPEG, JPG, PNG, GIF, WEBP
- Documents: PDF
- Videos: MP4, QuickTime, AVI

**Max File Size:** 10MB

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

### 2. Upload PDF File
**POST** `/s3-upload/upload-pdf`

**Authentication:** Required (CLIENT, ADMIN, SUPERADMIN)

**Content-Type:** `multipart/form-data`

**Form Data:**
- `file` (file) - PDF file to upload

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

---

## Error Responses

All endpoints may return error responses in the following format:

```json
{
  "success": false,
  "message": "Error message",
  "error": "Detailed error information (in development mode)"
}
```

**Common HTTP Status Codes:**
- `200` - Success
- `201` - Created
- `400` - Bad Request
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `409` - Conflict (e.g., duplicate email)
- `500` - Internal Server Error

---

## Environment Variables

Required environment variables in `.env`:

```env
PORT=5000
BUCKET_NAME=your-bucket-name
NEW_REGION=blr1
NEW_ACCESS_KEY=your-access-key
SECRET_ACCESS_KEY=your-secret-key
S3_ENDPOINT=https://blr1.digitaloceanspaces.com
S3_FORCE_PATH_STYLE=false
S3_MAKE_PUBLIC=true
NODE_ENV=development
```

