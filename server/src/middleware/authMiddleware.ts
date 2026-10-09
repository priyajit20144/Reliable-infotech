import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { store } from '../seed/seedData.js';
import { UserModel } from '../models/User.js';
import { isConnectedToMongo } from '../config/db.js';

export const JWT_SECRET = process.env.JWT_SECRET || 'devcraft_jwt_super_secret_key_2026';

export interface AuthUser {
  id: string;
  email: string;
  role: 'USER' | 'TEAM_MEMBER' | 'ADMIN';
  name: string;
  avatar?: string;
}

declare global {
  namespace Express {
    interface Request {
      user?: AuthUser;
    }
  }
}

export const authenticate = async (req: Request, res: Response, next: NextFunction) => {
  try {
    let token = '';
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer ')) {
      token = req.headers.authorization.split(' ')[1];
    } else if (req.cookies && req.cookies.token) {
      token = req.cookies.token;
    }

    if (!token) {
      return res.status(401).json({ success: false, message: 'Authentication required. No token provided.' });
    }

    let decoded: any = null;
    try {
      decoded = jwt.verify(token, JWT_SECRET) as any;
    } catch (_internalErr) {
      // If internal verification failed, attempt Supabase JWT verification (HS256 legacy or ES256 JWKS)
      try {
        const { verifySupabaseJWT } = await import('../services/supabaseService.js');
        const supaResult = await verifySupabaseJWT(token);
        if (supaResult && (supaResult.claims || supaResult.user)) {
          decoded = {
            id: supaResult.user?.id || supaResult.claims?.sub,
            email: supaResult.claims?.email || (supaResult.user as any)?.email,
            role: (supaResult.claims?.app_metadata as any)?.role || (supaResult.user as any)?.role || 'USER',
            name: (supaResult.claims?.user_metadata as any)?.full_name || (supaResult.claims?.email?.split('@')[0]) || 'User',
          };
        }
      } catch (_supaErr) {
        return res.status(401).json({ success: false, message: 'Invalid or expired token.' });
      }
    }

    if (!decoded || !decoded.id) {
      return res.status(401).json({ success: false, message: 'Invalid or expired token.' });
    }

    let user: any = null;
    if (isConnectedToMongo) {
      user = await UserModel.findById(decoded.id).select('-passwordHash');
      if (!user && decoded.email) {
        user = await UserModel.findOne({ email: decoded.email }).select('-passwordHash');
      }
    }
    if (!user) {
      user = store.users.find((u) => u._id === decoded.id || (decoded.email && u.email === decoded.email));
    }

    // If verified via Supabase but not yet seeded in local DB, create a synthetic session user
    if (!user && decoded.email) {
      user = {
        _id: decoded.id,
        email: decoded.email,
        role: decoded.role === 'service_role' || decoded.role === 'ADMIN' ? 'ADMIN' : 'USER',
        name: decoded.name || decoded.email.split('@')[0],
        avatar: '',
        isActive: true,
      };
    }

    if (!user || user.isActive === false) {
      return res.status(401).json({ success: false, message: 'User account not found or inactive.' });
    }

    req.user = {
      id: user._id.toString(),
      email: user.email,
      role: user.role,
      name: user.name,
      avatar: user.avatar || '',
    };

    next();
  } catch (error) {
    return res.status(401).json({ success: false, message: 'Token validation failed.' });
  }
};

export const optionalAuthenticate = async (req: Request, _res: Response, next: NextFunction) => {
  try {
    let token = '';
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer ')) {
      token = req.headers.authorization.split(' ')[1];
    } else if (req.cookies && req.cookies.token) {
      token = req.cookies.token;
    }

    if (!token) {
      return next();
    }

    let decoded: any = null;
    try {
      decoded = jwt.verify(token, JWT_SECRET) as any;
    } catch (_internalErr) {
      try {
        const { verifySupabaseJWT } = await import('../services/supabaseService.js');
        const supaResult = await verifySupabaseJWT(token);
        if (supaResult && (supaResult.claims || supaResult.user)) {
          decoded = {
            id: supaResult.user?.id || supaResult.claims?.sub,
            email: supaResult.claims?.email || (supaResult.user as any)?.email,
            role: (supaResult.claims?.app_metadata as any)?.role || (supaResult.user as any)?.role || 'USER',
            name: (supaResult.claims?.user_metadata as any)?.full_name || (supaResult.claims?.email?.split('@')[0]) || 'User',
          };
        }
      } catch (_supaErr) {
        return next();
      }
    }

    if (!decoded || !decoded.id) {
      return next();
    }

    let user: any = null;
    if (isConnectedToMongo) {
      user = await UserModel.findById(decoded.id).select('-passwordHash');
      if (!user && decoded.email) {
        user = await UserModel.findOne({ email: decoded.email }).select('-passwordHash');
      }
    }
    if (!user) {
      user = store.users.find((u) => u._id === decoded.id || (decoded.email && u.email === decoded.email));
    }

    if (!user && decoded.email) {
      user = {
        _id: decoded.id,
        email: decoded.email,
        role: decoded.role === 'service_role' || decoded.role === 'ADMIN' ? 'ADMIN' : 'USER',
        name: decoded.name || decoded.email.split('@')[0],
        avatar: '',
        isActive: true,
      };
    }

    if (user && user.isActive !== false) {
      req.user = {
        id: user._id.toString(),
        email: user.email,
        role: user.role,
        name: user.name,
        avatar: user.avatar || '',
      };
    }
    next();
  } catch (error) {
    // Optional auth silently continues if token is invalid or expired
    next();
  }
};

export const requireRole = (allowedRoles: Array<'USER' | 'TEAM_MEMBER' | 'ADMIN'>) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({ success: false, message: 'Authentication required.' });
    }
    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: `Forbidden: role '${req.user.role}' lacks permission for this resource.`,
      });
    }
    next();
  };
};

export const signToken = (user: { id: string; email: string; role: string; name: string }) => {
  return jwt.sign(
    { id: user.id, email: user.email, role: user.role, name: user.name },
    JWT_SECRET,
    { expiresIn: '7d' }
  );
};
