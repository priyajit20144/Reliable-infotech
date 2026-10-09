import { Request, Response, NextFunction } from 'express';

interface RateLimitRecord {
  count: number;
  resetTime: number;
}

const rateLimitStore = new Map<string, RateLimitRecord>();

/**
 * Creates an in-memory sliding window rate limiter for security-sensitive endpoints
 * @param windowMs Time window in milliseconds (e.g. 15 minutes = 15 * 60 * 1000)
 * @param maxRequests Maximum allowed requests within the window
 * @param message Custom error message when limit is exceeded
 */
export const createRateLimiter = (
  windowMs: number = 15 * 60 * 1000,
  maxRequests: number = 20,
  message: string = 'Too many requests from this IP, please try again later.'
) => {
  return (req: Request, res: Response, next: NextFunction) => {
    // Determine client IP
    const clientIp =
      (req.headers['x-forwarded-for'] as string)?.split(',')[0]?.trim() ||
      req.socket.remoteAddress ||
      'unknown-ip';

    const key = `${req.baseUrl || ''}${req.path}:${clientIp}`;
    const now = Date.now();

    const record = rateLimitStore.get(key);

    if (!record || now > record.resetTime) {
      // New window
      rateLimitStore.set(key, {
        count: 1,
        resetTime: now + windowMs,
      });
      res.setHeader('X-RateLimit-Limit', maxRequests);
      res.setHeader('X-RateLimit-Remaining', maxRequests - 1);
      return next();
    }

    if (record.count >= maxRequests) {
      const retryAfterSec = Math.ceil((record.resetTime - now) / 1000);
      res.setHeader('Retry-After', retryAfterSec);
      res.setHeader('X-RateLimit-Limit', maxRequests);
      res.setHeader('X-RateLimit-Remaining', 0);
      return res.status(429).json({
        success: false,
        message,
        retryAfter: retryAfterSec,
      });
    }

    record.count += 1;
    res.setHeader('X-RateLimit-Limit', maxRequests);
    res.setHeader('X-RateLimit-Remaining', Math.max(0, maxRequests - record.count));
    next();
  };
};

/**
 * Pre-configured rate limiter for authentication endpoints:
 * 25 attempts per 15 minutes per IP
 */
export const authRateLimiter = createRateLimiter(
  15 * 60 * 1000,
  25,
  'Too many login/registration attempts from this device. Please wait a few minutes before trying again.'
);
