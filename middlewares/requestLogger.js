import { logger } from '../utils/logger.js';

export default function requestLogger(req, res, next) {
  const start = Date.now();

  res.on('finish', () => {
    const durationMs = Date.now() - start;
    logger.info('request.completed', {
      requestId: req.requestId ?? null,
      method: req.method,
      path: req.originalUrl,
      status: res.statusCode,
      durationMs,
      userId: req.user?.id ?? null
    });
  });

  next();
}
