import { RequestHandler, Request, Response, NextFunction } from 'express';
import { registerRoute } from './controller.decorator';

function wrapHandler(handler: any): RequestHandler {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      await handler(req, res, next);
    } catch (error) {
      next(error);
    }
  };
}

export function GET(path: string) {
  return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
    const handler = wrapHandler(descriptor.value);
    registerRoute(target.constructor.name, 'get', path, handler);
  };
}

export function POST(path: string) {
  return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
    const handler = wrapHandler(descriptor.value);
    registerRoute(target.constructor.name, 'post', path, handler);
  };
}

export function PUT(path: string) {
  return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
    const handler = wrapHandler(descriptor.value);
    registerRoute(target.constructor.name, 'put', path, handler);
  };
}

export function DELETE(path: string) {
  return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
    const handler = wrapHandler(descriptor.value);
    registerRoute(target.constructor.name, 'delete', path, handler);
  };
}

export function PATCH(path: string) {
  return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
    const handler = wrapHandler(descriptor.value);
    registerRoute(target.constructor.name, 'patch', path, handler);
  };
}

