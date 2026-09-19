import { Request, Response, NextFunction } from 'express';

interface RateLimitRecord {
  count: number;
  resetTime: number;
}

const windowMs = 60 * 1000; // 1 minute
const maxRequests = 100; // 100 requests per minute per IP
const ipRecords = new Map<string, RateLimitRecord>();

export function rateLimiter(req: Request, res: Response, next: NextFunction) {
  const ip = req.ip || req.socket.remoteAddress || 'unknown';
  const now = Date.now();

  const record = ipRecords.get(ip);
  if (!record || now > record.resetTime) {
    ipRecords.set(ip, { count: 1, resetTime: now + windowMs });
    return next();
  }

  record.count += 1;
  if (record.count > maxRequests) {
    return res.status(429).json({
      success: false,
      error: 'Rate limit exceeded. Please wait a moment before trying again.'
    });
  }

  next();
}
