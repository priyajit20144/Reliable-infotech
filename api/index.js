import app from '../server/dist/server.js';
import { connectDB } from '../server/dist/config/db.js';

export default async function handler(req, res) {
  try {
    await connectDB();
  } catch (err) {
    console.warn('[Vercel Serverless] Database connection warning:', err?.message || err);
  }
  return app(req, res);
}
