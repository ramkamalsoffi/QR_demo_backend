import { NextRequest } from 'next/server';

export interface UploadedFile {
  buffer: Buffer;
  originalname: string;
  mimetype: string;
  size: number;
}

/**
 * Parse multipart form data from Next.js request
 */
export async function parseFormData(request: NextRequest): Promise<{
  file: UploadedFile | null;
  fields: Record<string, string>;
}> {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File | null;
    const fields: Record<string, string> = {};

    // Extract all form fields
    for (const [key, value] of formData.entries()) {
      if (key !== 'file' && typeof value === 'string') {
        fields[key] = value;
      }
    }

    if (!file) {
      return { file: null, fields };
    }

    // Convert File to UploadedFile format
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const uploadedFile: UploadedFile = {
      buffer,
      originalname: file.name,
      mimetype: file.type,
      size: file.size,
    };

    return { file: uploadedFile, fields };
  } catch (error) {
    console.error('Error parsing form data:', error);
    return { file: null, fields: {} };
  }
}

