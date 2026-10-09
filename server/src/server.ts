import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import morgan from 'morgan';
import path from 'path';
import dotenv from 'dotenv';
import { connectDB, isConnectedToMongo } from './config/db.js';
import { errorHandler } from './middleware/errorHandler.js';

// Route imports
import authRoutes from './routes/authRoutes.js';
import projectRoutes from './routes/projectRoutes.js';
import requestRoutes from './routes/requestRoutes.js';
import inquiryRoutes from './routes/inquiryRoutes.js';
import messageRoutes from './routes/messageRoutes.js';
import notificationRoutes from './routes/notificationRoutes.js';
import adminRoutes from './routes/adminRoutes.js';
import contactRoutes from './routes/contactRoutes.js';
import uploadRoutes from './routes/uploadRoutes.js';
import aiRoutes from './routes/aiRoutes.js';

dotenv.config();
dotenv.config({ path: path.resolve(process.cwd(), '.env') });
dotenv.config({ path: path.resolve(process.cwd(), '..', '.env') });
dotenv.config({ path: path.resolve(process.cwd(), 'server', '.env') });

const app = express();
// Reload timestamp for live message sync: 2026-10-08
const PORT = process.env.PORT || 5000;

// Security & Middlewares
const allowedOrigins = [
  'http://localhost:5173',
  'http://127.0.0.1:5173',
  'http://localhost:5174',
  'http://127.0.0.1:5174',
  process.env.CLIENT_URL,
].filter(Boolean) as string[];

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin) return callback(null, true);
      if (
        allowedOrigins.includes(origin) ||
        /^http:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/.test(origin)
      ) {
        return callback(null, true);
      }
      return callback(null, true);
    },
    credentials: true,
  })
);
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(cookieParser());
app.use(morgan('dev'));

// Static uploads
const uploadDir = path.resolve(process.cwd(), 'uploads');
app.use('/uploads', express.static(uploadDir));

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/custom-requests', requestRoutes);
app.use('/api/project-inquiries', inquiryRoutes);
app.use('/api/conversations', messageRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/contact', contactRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/ai', aiRoutes);

// Health check
app.get('/api/health', (_req, res) => {
  res.json({
    status: 'online',
    platform: 'DevCraft Platform API',
    mongoConnected: isConnectedToMongo,
    timestamp: new Date().toISOString(),
  });
});

// Error handling
app.use(errorHandler);

// Start server
const startServer = async () => {
  await connectDB();
  const server = app.listen(PORT, () => {
    console.log(`[DevCraft Server] Running on http://localhost:${PORT}`);
  });

  server.on('error', (err: any) => {
    if (err.code === 'EADDRINUSE') {
      console.error(`[DevCraft Server] Error: Port ${PORT} is already in use.`);
      console.error(`[DevCraft Server] Stale process detected. Run 'npm run clean:ports' or restart via 'npm run dev'.`);
    } else {
      console.error(`[DevCraft Server] Server error:`, err);
    }
    process.exit(1);
  });

  // Graceful shutdown handling
  const handleShutdown = (signal: string) => {
    console.log(`\n[DevCraft Server] Received ${signal}. Closing server gracefully...`);
    server.close(() => {
      console.log('[DevCraft Server] HTTP server closed.');
      process.exit(0);
    });

    // Timeout safety fallback
    setTimeout(() => {
      console.warn('[DevCraft Server] Forcing exit after timeout.');
      process.exit(0);
    }, 2000).unref();
  };

  process.on('SIGINT', () => handleShutdown('SIGINT'));
  process.on('SIGTERM', () => handleShutdown('SIGTERM'));
};

startServer();
