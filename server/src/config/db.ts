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
  let uri = (rawUri || process.env.MONGODB_URI || ATLAS_FALLBACK_URI).trim();

  // Strip wrapping quotes if present in env vars
  if ((uri.startsWith('"') && uri.endsWith('"')) || (uri.startsWith("'") && uri.endsWith("'"))) {
    uri = uri.slice(1, -1).trim();
  }

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

interface MongooseCache {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
  lastError: string | null;
  listenersAttached: boolean;
  hasSeeded: boolean;
}

declare global {
  // eslint-disable-next-line no-var
  var mongooseCache: MongooseCache | undefined;
}

let cached: MongooseCache = (global as any).mongooseCache;

if (!cached) {
  cached = (global as any).mongooseCache = {
    conn: null,
    promise: null,
    lastError: null,
    listenersAttached: false,
    hasSeeded: false,
  };
}

// Attach persistent listeners once to prevent duplicate listeners on serverless warm starts
if (!cached.listenersAttached) {
  mongoose.connection.on('connected', () => {
    isConnectedToMongo = true;
    cached.lastError = null;
    console.log(
      `[MongoDB] Connection established to ${mongoose.connection.host || 'Atlas'} (Database: "${mongoose.connection.name || 'devcraft'}")`
    );
  });

  mongoose.connection.on('error', (err: any) => {
    isConnectedToMongo = false;
    const msg = err?.message || String(err);
    cached.lastError = msg;

    if (msg.includes('SSL alert number 80') || msg.includes('tlsv1 alert')) {
      console.warn(
        '[MongoDB Atlas Network Access Warning]: Atlas rejected connection with SSL alert 80. ' +
        'This indicates the connecting IP is blocked by Atlas firewall. ' +
        'Ensure 0.0.0.0/0 (Allow Access from Anywhere) is active in MongoDB Atlas -> Security -> Network Access.'
      );
    } else {
      console.error(`[MongoDB] Connection error: ${msg}`);
    }
  });

  mongoose.connection.on('disconnected', () => {
    isConnectedToMongo = false;
    console.warn('[MongoDB] Disconnected from database.');
  });

  cached.listenersAttached = true;
}

export const connectDB = async (): Promise<typeof mongoose | null> => {
  // 1. If connection is already open and ready, reuse it immediately
  if (mongoose.connection.readyState === 1) {
    isConnectedToMongo = true;
    return mongoose;
  }

  // 2. If a connection is already in progress, await the existing promise
  if (cached.promise) {
    try {
      cached.conn = await cached.promise;
      isConnectedToMongo = (mongoose.connection.readyState as number) === 1;
      return cached.conn;
    } catch {
      // Previous promise failed, allow fresh attempt below
      cached.promise = null;
    }
  }

  const rawUri = process.env.MONGODB_URI || ATLAS_FALLBACK_URI;
  const uri = formatMongoUri(rawUri);

  try {
    mongoose.set('strictQuery', false);

    const opts: mongoose.ConnectOptions = {
      bufferCommands: false, // In serverless, do not buffer queries indefinitely
      maxPoolSize: 10,       // Optimal connection pool for serverless Lambdas
      minPoolSize: 1,
      serverSelectionTimeoutMS: 8000,
      socketTimeoutMS: 45000,
      family: 4,             // Force IPv4 to prevent AWS Lambda IPv6 TLS handshake resets
      tls: true,
    };

    cached.promise = mongoose.connect(uri, opts);
    cached.conn = await cached.promise;

    if (mongoose.connection.db) {
      await mongoose.connection.db.admin().ping();
      isConnectedToMongo = true;
      cached.lastError = null;
      console.log(
        `[MongoDB] Connected successfully: ${mongoose.connection.host} (Database: "${mongoose.connection.name}")`
      );

      // Seed database once per container instance lifecycle
      if (!cached.hasSeeded) {
        cached.hasSeeded = true;
        seedDatabaseIfEmpty().catch((seedErr) => {
          console.warn('[MongoDB Seeder] Initial seed non-blocking warning:', seedErr?.message);
        });
      }
    } else {
      isConnectedToMongo = false;
    }

    return cached.conn;
  } catch (error: any) {
    cached.promise = null;
    cached.conn = null;
    isConnectedToMongo = false;
    const msg = (error as Error)?.message || String(error);
    cached.lastError = msg;

    if (msg.includes('SSL alert number 80') || msg.includes('tlsv1 alert')) {
      console.warn(
        `[MongoDB] Handshake blocked by Atlas firewall (SSL alert 80). Operating with resilient memory store. Please whitelist 0.0.0.0/0 in Atlas Network Access.`
      );
    } else {
      console.warn(
        `[MongoDB] Connection failed (${msg}). Operating with fallback memory store.`
      );
    }
    return null;
  }
};

export const getMongoConnectionStatus = () => {
  return {
    connected: isConnectedToMongo && mongoose.connection.readyState === 1,
    readyState: mongoose.connection.readyState,
    host: mongoose.connection.host || null,
    database: mongoose.connection.name || null,
    lastError: cached.lastError,
  };
};
