import app from '../server/dist/server.js';
import { connectDB } from '../server/dist/config/db.js';

export default async function handler(req, res) {
  try {
    await connectDB();
  } catch (err) {
    console.warn('[Vercel Serverless] Database connection warning:', err?.message || err);
  }

  // Restore path if Vercel internal rewrite passed rewrite destination as req.url
  if (req.url && req.url.startsWith('/api/index.js')) {
    const rawPath = req.headers['x-matched-path'] || req.headers['x-forwarded-uri'];
    if (rawPath && !rawPath.startsWith('/api/index.js')) {
      req.url = rawPath;
    }
  }

  return new Promise((resolve) => {
    let settled = false;
    const finish = () => {
      if (!settled) {
        settled = true;
        resolve();
      }
    };

    res.once('finish', finish);
    res.once('close', finish);
    res.once('error', finish);

    try {
      app(req, res, (err) => {
        if (err) {
          console.error('[Vercel Serverless] Express unhandled error:', err);
          if (!res.headersSent) {
            res.status(500).json({ success: false, message: 'Internal Server Error' });
          }
        }
        finish();
      });
    } catch (err) {
      console.error('[Vercel Serverless] Express synchronous exception:', err);
      if (!res.headersSent) {
        res.status(500).json({ success: false, message: 'Internal Server Error' });
      }
      finish();
    }
  });
}
