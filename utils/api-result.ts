import { NextResponse } from 'next/server';

export class ApiResult {
  private success: boolean;
  private data: any;
  private message: string;
  private statusCode: number;

  private constructor(success: boolean, data: any, message: string, statusCode: number) {
    this.success = success;
    this.data = data;
    this.message = message;
    this.statusCode = statusCode;
  }

  static success(data: any = null, message: string = 'Success', statusCode: number = 200): ApiResult {
    return new ApiResult(true, data, message, statusCode);
  }

  static error(message: string = 'Error', statusCode: number = 400): ApiResult {
    return new ApiResult(false, null, message, statusCode);
  }

  toResponse(): NextResponse {
    return NextResponse.json(
      {
        success: this.success,
        message: this.message,
        data: this.data,
      },
      { status: this.statusCode }
    );
  }
}

