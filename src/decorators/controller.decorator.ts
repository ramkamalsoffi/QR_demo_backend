import { Router } from 'express';

const routers: Map<string, Router> = new Map();
const paths: Map<string, string> = new Map();
const routeMetadata: Map<string, Array<{ method: string; path: string; handler: any }>> = new Map();

export function Controller(path: string) {
  return function (target: any) {
    const router = Router();
    routers.set(target.name, router);
    paths.set(target.name, path);
    target.prototype.router = router;
    target.prototype.path = path;
    
    // Register any pending routes
    const pendingRoutes = routeMetadata.get(target.name) || [];
    pendingRoutes.forEach(({ method, path: routePath, handler }) => {
      (router as any)[method.toLowerCase()](routePath, handler);
    });
    routeMetadata.delete(target.name);
  };
}

export function getRouter(target: any): Router {
  let router = routers.get(target.name);
  if (!router) {
    // Create router if it doesn't exist yet (for method decorators that run before class decorator)
    router = Router();
    routers.set(target.name, router);
  }
  return router;
}

export function getPath(target: any): string {
  return paths.get(target.name) || '';
}

export function registerRoute(className: string, method: string, path: string, handler: any) {
  const router = routers.get(className);
  if (router) {
    // Router exists, register immediately
    (router as any)[method.toLowerCase()](path, handler);
  } else {
    // Router doesn't exist yet, store for later registration
    if (!routeMetadata.has(className)) {
      routeMetadata.set(className, []);
    }
    routeMetadata.get(className)!.push({ method, path, handler });
  }
}

