# S3 Upload API

This API endpoint allows you to upload files (PDFs, images, videos) to S3 storage.

## Endpoint

`POST /api/uploads/s3-upload`

## Authentication

Requires Bearer token in Authorization header. User must have one of these roles:
- CLIENT
- ADMIN
- SUPERADMIN

## Request

### Headers
```
Authorization: Bearer <your-jwt-token>
Content-Type: multipart/form-data
```

### Body (Form Data)
- `file`: The file to upload (required)

### Allowed File Types
- Images: JPEG, JPG, PNG, GIF, WEBP
- Documents: PDF
- Videos: MP4, QuickTime, AVI

### File Size Limit
- Maximum: 10MB

## Response

### Success (200)
```json
{
  "success": true,
  "message": "File uploaded successfully to new folder",
  "data": {
    "imageUrl": "https://blr1.digitaloceanspaces.com/bucket-name/amaramba/user_documents/QR-REPORT/filename_timestamp_random.pdf",
    "fileName": "filename_timestamp_random.pdf",
    "fileSize": 123456,
    "folder": "QR-REPORT"
  }
}
```

### Error (400/401/500)
```json
{
  "success": false,
  "message": "Error message",
  "data": null
}
```

## Example Usage

### Using fetch (JavaScript)
```javascript
const formData = new FormData();
formData.append('file', fileInput.files[0]);

const response = await fetch('/api/uploads/s3-upload', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${token}`
  },
  body: formData
});

const result = await response.json();
console.log(result);
```

### Using axios
```javascript
import axios from 'axios';

const formData = new FormData();
formData.append('file', file);

const response = await axios.post('/api/uploads/s3-upload', formData, {
  headers: {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'multipart/form-data'
  }
});

console.log(response.data);
```

## Environment Variables

Make sure these are set in your `.env` file:

```env
BUCKET_NAME=your-bucket-name
NEW_REGION=blr1
NEW_ACCESS_KEY=your-access-key
SECRET_ACCESS_KEY=your-secret-access-key
S3_ENDPOINT=https://blr1.digitaloceanspaces.com
S3_FORCE_PATH_STYLE=false
S3_MAKE_PUBLIC=true
JWT_SECRET=your-jwt-secret
```

## Notes

- Files are uploaded to the `QR-REPORT` folder within `amaramba/user_documents/`
- File names are automatically generated with timestamp and random string to prevent conflicts
- Files are made public by default (can be configured via `S3_MAKE_PUBLIC`)

