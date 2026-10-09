import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import { store } from '../seed/seedData.js';
import { UserModel } from '../models/User.js';
import { isConnectedToMongo } from '../config/db.js';
import { signToken } from '../middleware/authMiddleware.js';

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const register = async (req: Request, res: Response) => {
  try {
    const { name, email, password, phone } = req.body;

    // 1. Strict Validation
    if (!name || typeof name !== 'string' || name.trim().length < 2) {
      return res.status(400).json({
        success: false,
        message: 'Full name is required and must be at least 2 characters.',
      });
    }

    if (!email || typeof email !== 'string' || !EMAIL_REGEX.test(email.trim())) {
      return res.status(400).json({
        success: false,
        message: 'A valid email address is required.',
      });
    }

    if (!password || typeof password !== 'string' || password.length < 8) {
      return res.status(400).json({
        success: false,
        message: 'Password must be at least 8 characters long.',
      });
    }

    const trimmedName = name.trim();
    const normalizedEmail = email.toLowerCase().trim();

    // 2. Duplicate Account Check
    let existingUser: any = null;
    if (isConnectedToMongo) {
      try {
        existingUser = await UserModel.findOne({ email: normalizedEmail });
      } catch (e) {
        console.warn('[MongoDB findOne failed, falling back to memory store]:', e);
      }
    }
    if (!existingUser) {
      existingUser = store.users.find((u) => u.email === normalizedEmail);
    }

    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: 'An account with this email address already exists. Please sign in instead.',
      });
    }

    // 3. Password Hashing
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    // 4. Strict Role Assignment: Public registrations NEVER receive elevated privileges
    const assignedRole = 'USER';

    let newUser: any;
    if (isConnectedToMongo) {
      try {
        newUser = await UserModel.create({
          name: trimmedName,
          email: normalizedEmail,
          passwordHash,
          phone: phone ? String(phone).trim() : '',
          role: assignedRole,
          isActive: true,
        });
      } catch (e) {
        console.warn('[MongoDB create user failed, falling back to memory store]:', e);
        newUser = null;
      }
    }
    if (!newUser) {
      newUser = {
        _id: `usr_${Date.now()}`,
        name: trimmedName,
        email: normalizedEmail,
        passwordHash,
        phone: phone ? String(phone).trim() : '',
        avatar: '',
        role: assignedRole,
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      store.users.push(newUser);
    }

    // 5. Generate Signed JWT Token
    const token = signToken({
      id: newUser._id.toString(),
      email: newUser.email,
      role: newUser.role,
      name: newUser.name,
    });

    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return res.status(201).json({
      success: true,
      message: 'Account created successfully. Welcome to DevCraft!',
      token,
      user: {
        id: newUser._id.toString(),
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
        phone: newUser.phone,
        avatar: newUser.avatar || '',
      },
    });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message || 'Registration failed.' });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Email and password are required.',
      });
    }

    const normalizedEmail = String(email).toLowerCase().trim();

    let user: any = null;
    if (isConnectedToMongo) {
      try {
        user = await UserModel.findOne({ email: normalizedEmail });
      } catch (e) {
        console.warn('[MongoDB findOne user failed, falling back to memory store]:', e);
      }
    }
    if (!user) {
      user = store.users.find((u) => u.email === normalizedEmail);
    }

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password.',
      });
    }

    if (user.isActive === false) {
      return res.status(401).json({
        success: false,
        message: 'Your account is currently inactive. Please contact DevCraft support.',
      });
    }

    const isMatch = await bcrypt.compare(String(password), user.passwordHash);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password.',
      });
    }

    const token = signToken({
      id: user._id.toString(),
      email: user.email,
      role: user.role,
      name: user.name,
    });

    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return res.json({
      success: true,
      message: 'Login successful.',
      token,
      user: {
        id: user._id.toString(),
        name: user.name,
        email: user.email,
        role: user.role,
        phone: user.phone || '',
        avatar: user.avatar || '',
      },
    });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message || 'Login failed.' });
  }
};

export const logout = async (_req: Request, res: Response) => {
  res.clearCookie('token', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
  });
  return res.json({ success: true, message: 'Logged out successfully.' });
};


export const getMe = async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ success: false, message: 'Not authenticated.' });
    }

    let user: any = null;
    if (isConnectedToMongo) {
      try {
        user = await UserModel.findById(req.user.id).select('-passwordHash');
      } catch (e) {
        console.warn('[MongoDB findById failed, falling back to memory store]:', e);
      }
    }
    if (!user) {
      user = store.users.find((u) => u._id === req.user?.id);
    }

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found.' });
    }

    return res.json({
      success: true,
      user: {
        id: user._id.toString(),
        name: user.name,
        email: user.email,
        role: user.role,
        phone: user.phone || '',
        avatar: user.avatar || '',
        createdAt: user.createdAt,
      },
    });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const updateProfile = async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ success: false, message: 'Not authenticated.' });
    }

    const { name, phone, avatar, password } = req.body;

    let user: any = null;
    if (isConnectedToMongo) {
      user = await UserModel.findById(req.user.id);
      if (user) {
        if (name) user.name = name;
        if (phone !== undefined) user.phone = phone;
        if (avatar !== undefined) user.avatar = avatar;
        if (password) {
          const salt = await bcrypt.genSalt(10);
          user.passwordHash = await bcrypt.hash(password, salt);
        }
        await user.save();
      }
    } else {
      user = store.users.find((u) => u._id === req.user?.id);
      if (user) {
        if (name) user.name = name;
        if (phone !== undefined) user.phone = phone;
        if (avatar !== undefined) user.avatar = avatar;
        if (password) {
          const salt = bcrypt.genSaltSync(10);
          user.passwordHash = bcrypt.hashSync(password, salt);
        }
        user.updatedAt = new Date();
      }
    }

    return res.json({
      success: true,
      message: 'Profile updated successfully.',
      user: {
        id: user._id.toString(),
        name: user.name,
        email: user.email,
        role: user.role,
        phone: user.phone || '',
        avatar: user.avatar || '',
      },
    });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message });
  }
};
