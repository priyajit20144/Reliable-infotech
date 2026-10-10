import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { seedDatabaseIfEmpty } from '../seed/seedDatabase.js';

dotenv.config();
dotenv.config({ path: path.resolve(process.cwd(), '.env') });
dotenv.config({ path: path.resolve(process.cwd(), '..', '.env') });
dotenv.config({ path: path.resolve(process.cwd(), 'server', '.env') });

export let isConnectedToMongo = false;

export const ATLAS_FALLBACK_URI =
  'mongodb+srv://priyajitd218_db_user:2007@cluster0.hzldytn.mongodb.net/devcraft?retryWrites=true&w=majority&appName=Cluster0';

export const formatMongoUri = (rawUri?: string): string => {
  let uri = rawUri || process.env.MONGODB_URI || ATLAS_FALLBACK_URI;

  // Automatically remove angle brackets if user included them in password (e.g. :<password>@ -> :password@)
  uri = uri.replace(/:(<)([^<>@]+)(>)@/, ':$2@');

  // If pointing to MongoDB Atlas without a database name, default to 'devcraft'
  if (uri.includes('.mongodb.net/?')) {
    uri = uri.replace('.mongodb.net/?', '.mongodb.net/devcraft?');
  } else if (uri.endsWith('.mongodb.net/')) {
    uri = uri + 'devcraft';
  } else if (uri.endsWith('.mongodb.net')) {
    uri = uri + '/devcraft';
  }

  return uri;
};

export const connectDB = async () => {
  // If already connected in a warm serverless container, reuse existing connection
  if (mongoose.connection.readyState === 1) {
    isConnectedToMongo = true;
    return;
  }

  const rawUri = process.env.MONGODB_URI || ATLAS_FALLBACK_URI;
  const uri = formatMongoUri(rawUri);

  try {
    mongoose.set('strictQuery', false);

    mongoose.connection.on('connected', () => {
      // Don't mark true until ping/query verifies connection health
    });

    mongoose.connection.on('error', (err) => {
      console.error(`[MongoDB] Connection error: ${err.message}`);
      isConnectedToMongo = false;
    });

    mongoose.connection.on('disconnected', () => {
      isConnectedToMongo = false;
      console.warn('[MongoDB] Disconnected from database.');
    });

    const conn = await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 10000,
    });

    // Test a basic query to ensure connection is actually responsive
    if (conn.connection.db) {
      await conn.connection.db.admin().ping();
      isConnectedToMongo = true;
      console.log(`[MongoDB] Connected successfully: ${conn.connection.host} (Database: "${conn.connection.name}")`);
      // Auto-seed database if empty (with deleted-projects protection)
      await seedDatabaseIfEmpty();
    } else {
      isConnectedToMongo = false;
    }
  } catch (error) {
    isConnectedToMongo = false;
    console.warn(
      `[MongoDB] Connection failed (${(error as Error).message}). Operating with fallback memory store.`
    );
  }
};
