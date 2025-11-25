# Form Submission API Documentation

## Overview
This API endpoint handles form submissions from the frontend, captures user information (IP, device, OS, location), stores it in the Customer table, and returns the PDF URL for the corresponding batch number.

## Endpoint

### POST `/api/submission`

Submit a form with email and batch number to get the PDF URL.

**Request Body:**
```json
{
  "email": "user@example.com",
  "batchNo": "BATCH-001"
}
```

**Response (Success):**
```json
{
  "success": true,
  "message": "Form submitted successfully",
  "data": {
    "pdfUrl": "https://s3.amazonaws.com/bucket/QRSCAN/PDFs/document.pdf",
    "productName": "Product Name",
    "submittedAt": "2024-01-15T10:30:00.000Z"
  }
}
```

**Response (Error - Product Not Found):**
```json
{
  "success": false,
  "message": "Product not found for the given batch number",
  "statusCode": 404
}
```

**Response (Error - Invalid Input):**
```json
{
  "success": false,
  "message": "Email and batch number are required",
  "statusCode": 400
}
```

## What Gets Captured Automatically

1. **IP Address**: Extracted from request headers (`x-forwarded-for` or `remoteAddress`)
2. **Device**: Parsed from User-Agent header (e.g., "iPhone", "Desktop")
3. **OS**: Operating system from User-Agent (e.g., "Windows 10", "iOS 15")
4. **Browser**: Browser name and version (e.g., "Chrome 120.0")
5. **Location**: Geolocation based on IP address (e.g., "New York, NY, US")

## Data Storage

All submission data is stored in the `customers` table with the following structure:

```typescript
{
  id: string (UUID)
  email: string
  batchNo: string
  ipAddress: string
  device: string | null
  os: string | null
  location: string | null
  browser: string | null
  submittedAt: DateTime
  createdAt: DateTime
  updatedAt: DateTime
}
```

## Example Usage

```javascript
// Frontend form submission
const response = await fetch('http://localhost:5000/api/submission', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    email: 'user@example.com',
    batchNo: 'BATCH-001'
  })
});

const data = await response.json();
if (data.success) {
  // Open PDF
  window.open(data.data.pdfUrl, '_blank');
}
```

## Notes

- Email format is validated
- Batch number must match an existing product
- Product must have a PDF URL
- All submissions are logged in the database
- IP-based location may show "Local Network" for localhost/private IPs

