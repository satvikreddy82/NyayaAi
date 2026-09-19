import { Request, Response, NextFunction } from 'express';

export function errorHandler(err: any, req: Request, res: Response, next: NextFunction) {
  console.error('[Error Handler]', err);

  const status = err.status || 500;
  const message = err.message || 'An internal server error occurred';

  // Do not leak internal secrets or keys
  res.status(status).json({
    success: false,
    error: message,
    fallbackAvailable: true
  });
}
