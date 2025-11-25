# API Payload Guide

This document describes the exact payload structure for all API endpoints, matching the Prisma schema.

## Product API Payloads

### Create Product
**POST** `/api/products`

**Request Body:**
```json
{
  "name": "Product Name",           // Required: string
  "description": "Product description", // Optional: string | null
  "price": 99.99,                   // Required: number (float)
  "qrCode": "QR_CODE_STRING",       // Optional: string | null
  "pdfUrl": "https://s3...",        // Optional: string | null (S3 URL)
  "imageUrl": "https://...",        // Optional: string | null
  "category": "Electronics",         // Optional: string | null
  "stock": 100                      // Optional: number (integer) | null
}
```

**Response:**
```json
{
  "success": true,
  "message": "Product created successfully",
  "data": {
    "id": "uuid",
    "name": "Product Name",
    "description": "Product description",
    "price": 99.99,
    "qrCode": "QR_CODE_STRING",
    "pdfUrl": "https://s3...",
    "imageUrl": "https://...",
    "category": "Electronics",
    "stock": 100,
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  }
}
```

### Update Product
**PUT** `/api/products/:id`

**Request Body:** (All fields optional)
```json
{
  "name": "Updated Name",           // Optional: string
  "description": null,               // Optional: string | null (can set to null)
  "price": 149.99,                  // Optional: number
  "qrCode": null,                   // Optional: string | null
  "pdfUrl": "https://s3...",        // Optional: string | null (S3 URL)
  "imageUrl": null,                 // Optional: string | null
  "category": "Accessories",        // Optional: string | null
  "stock": 50                       // Optional: number | null
}
```

**Note:** To set a field to `null`, explicitly send `null` in the payload. Omitting a field will leave it unchanged.

### Get All Products
**GET** `/api/products`

**Response:**
```json
{
  "success": true,
  "message": "Products retrieved successfully",
  "data": [
    {
      "id": "uuid",
      "name": "Product Name",
      "description": "Product description",
      "price": 99.99,
      "qrCode": "QR_CODE_STRING",
      "pdfUrl": "https://s3...",
      "imageUrl": "https://...",
      "category": "Electronics",
      "stock": 100,
      "createdAt": "2024-01-01T00:00:00.000Z",
      "updatedAt": "2024-01-01T00:00:00.000Z"
    }
  ]
}
```

## Customer API Payloads

### Create Customer
**POST** `/api/customers`

**Request Body:**
```json
{
  "name": "John Doe",               // Required: string
  "email": "john@example.com",      // Required: string (unique)
  "phone": "+1234567890",           // Optional: string | null
  "address": "123 Main St",         // Optional: string | null
  "company": "Example Corp",         // Optional: string | null
  "notes": "VIP customer"           // Optional: string | null
}
```

**Response:**
```json
{
  "success": true,
  "message": "Customer created successfully",
  "data": {
    "id": "uuid",
    "name": "John Doe",
    "email": "john@example.com",
    "phone": "+1234567890",
    "address": "123 Main St",
    "company": "Example Corp",
    "notes": "VIP customer",
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  }
}
```

### Update Customer
**PUT** `/api/customers/:id`

**Request Body:** (All fields optional)
```json
{
  "name": "Jane Doe",               // Optional: string
  "email": "jane@example.com",      // Optional: string (must be unique)
  "phone": null,                    // Optional: string | null
  "address": "456 Oak Ave",         // Optional: string | null
  "company": null,                  // Optional: string | null
  "notes": "Updated notes"          // Optional: string | null
}
```

**Note:** To set a field to `null`, explicitly send `null` in the payload. Omitting a field will leave it unchanged.

### Get All Customers
**GET** `/api/customers`

**Response:**
```json
{
  "success": true,
  "message": "Customers retrieved successfully",
  "data": [
    {
      "id": "uuid",
      "name": "John Doe",
      "email": "john@example.com",
      "phone": "+1234567890",
      "address": "123 Main St",
      "company": "Example Corp",
      "notes": "VIP customer",
      "createdAt": "2024-01-01T00:00:00.000Z",
      "updatedAt": "2024-01-01T00:00:00.000Z"
    }
  ]
}
```

## Field Types Summary

### Product Fields
| Field | Type | Required | Nullable | Description |
|-------|------|----------|----------|-------------|
| id | string (UUID) | Auto | No | Unique identifier |
| name | string | Yes | No | Product name |
| description | string | No | Yes | Product description |
| price | number (float) | Yes | No | Product price |
| qrCode | string | No | Yes | QR code string |
| pdfUrl | string | No | Yes | S3 URL (PDFs stored only in S3) |
| imageUrl | string | No | Yes | Image URL |
| category | string | No | Yes | Product category |
| stock | number (int) | No | Yes | Stock quantity |
| createdAt | DateTime | Auto | No | Creation timestamp |
| updatedAt | DateTime | Auto | No | Last update timestamp |

### Customer Fields
| Field | Type | Required | Nullable | Description |
|-------|------|----------|----------|-------------|
| id | string (UUID) | Auto | No | Unique identifier |
| name | string | Yes | No | Customer name |
| email | string | Yes | No | Email (unique) |
| phone | string | No | Yes | Phone number |
| address | string | No | Yes | Address |
| company | string | No | Yes | Company name |
| notes | string | No | Yes | Additional notes |
| createdAt | DateTime | Auto | No | Creation timestamp |
| updatedAt | DateTime | Auto | No | Last update timestamp |

## Important Notes

1. **PDF Storage**: The `pdfUrl` field stores only the S3 URL reference. PDFs are stored in S3, not in the database.

2. **Null Values**: Optional fields can be `null`. To set a field to `null` during update, explicitly send `null` in the payload.

3. **Email Uniqueness**: Customer email must be unique. Attempting to create/update with a duplicate email will return a 409 Conflict error.

4. **Type Conversion**: The API automatically converts:
   - `price` from string to float
   - `stock` from string to integer

5. **Date Fields**: `createdAt` and `updatedAt` are automatically managed by Prisma and returned as ISO 8601 strings.

