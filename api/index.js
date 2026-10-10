import app from '../server/dist/server.js';
import { connectDB } from '../server/dist/config/db.js';

export default async function handler(req, res) {
  // If Vercel edge rewrite mapped /api/* to /api, restore the original request path
  const matchedPath = req.headers['x-matched-path'] || req.headers['x-vercel-matched-path'];
  if (matchedPath && (req.url === '/api' || req.url === '/api/' || req.url === '/')) {
    const urlParts = (req.url || '').split('?');
    const queryString = urlParts[1] ? `?${urlParts[1]}` : '';
    req.url = `${matchedPath}${queryString}`;
  }

  try {
    await connectDB();
  } catch (err) {
    console.warn('[Vercel Serverless] Database connection warning:', err?.message || err);
  }
  return app(req, res);
}
