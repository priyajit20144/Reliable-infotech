import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';
import jwt from 'jsonwebtoken';
import { store } from '../seed/seedData.js';
import { UserModel } from '../models/User.js';
import { PasswordResetModel } from '../models/PasswordReset.js';
import { isConnectedToMongo } from '../config/db.js';
import { signToken, JWT_SECRET } from '../middleware/authMiddleware.js';
import {
  sendWelcomeEmail,
  sendPasswordResetOtpEmail,
  sendPasswordResetConfirmationEmail,
} from '../services/emailService.js';

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const OTP_EXPIRY_MINUTES = 10;
const MAX_OTP_ATTEMPTS = 5;

const hashOtp = (otp: string, email: string): string => {
  return crypto.createHmac('sha256', JWT_SECRET).update(`${email.toLowerCase().trim()}:${otp.trim()}`).digest('hex');
};


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

    // Dispatch welcome email via Brevo asynchronously
    sendWelcomeEmail(newUser.email, newUser.name).catch((err) => {
      console.warn('[Brevo Welcome Email Dispatch Error]:', err?.message);
    });

    return res.status(201).json({

      success: true,
      message: 'Account created successfully. Welcome to Reliable Info Tech!',
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
    const alternateEmail = normalizedEmail.includes('@reliableinfotech.io')
      ? normalizedEmail.replace('@reliableinfotech.io', '@devcraft.io')
      : normalizedEmail.replace('@devcraft.io', '@reliableinfotech.io');

    if (isConnectedToMongo) {
      try {
        user = await UserModel.findOne({ $or: [{ email: normalizedEmail }, { email: alternateEmail }] });
      } catch (e) {
        console.warn('[MongoDB findOne user failed, falling back to memory store]:', e);
      }
    }
    if (!user) {
      user = store.users.find((u) => u.email === normalizedEmail || u.email === alternateEmail);
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
        message: 'Your account is currently inactive. Please contact Reliable Info Tech support.',
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

/**
 * Initiate Forgot Password Flow:
 * Generates 6-digit cryptographic OTP, hashes it, stores with TTL,
 * signs JWT resetToken, and dispatches email via Brevo.
 */
export const forgotPassword = async (req: Request, res: Response) => {
  try {
    const { email } = req.body;
    if (!email || typeof email !== 'string' || !EMAIL_REGEX.test(email.trim())) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a valid email address.',
      });
    }

    const normalizedEmail = email.toLowerCase().trim();

    // Verify user exists in Mongo or in-memory store
    let user: any = null;
    if (isConnectedToMongo) {
      try {
        user = await UserModel.findOne({ email: normalizedEmail });
      } catch (e) {
        console.warn('[MongoDB findOne failed in forgotPassword, checking store]:', e);
      }
    }
    if (!user) {
      user = store.users.find((u) => u.email === normalizedEmail);
    }

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'No account registered with this email address.',
      });
    }

    if (user.isActive === false) {
      return res.status(403).json({
        success: false,
        message: 'This account has been deactivated. Please contact support.',
      });
    }

    // 1. Generate 6-Digit Cryptographic OTP
    const rawOtp = crypto.randomInt(100000, 999999).toString();
    const otpHash = hashOtp(rawOtp, normalizedEmail);
    const expiresAt = new Date(Date.now() + OTP_EXPIRY_MINUTES * 60 * 1000);

    // 2. Sign JWT resetToken bound to this email and purpose
    const resetToken = jwt.sign(
      { email: normalizedEmail, purpose: 'pwd_reset_pending' },
      JWT_SECRET,
      { expiresIn: `${OTP_EXPIRY_MINUTES}m` }
    );

    // 3. Persist in MongoDB & In-Memory Store
    if (isConnectedToMongo) {
      try {
        // Delete previous unused reset requests for this email to avoid clutter
        await PasswordResetModel.deleteMany({ email: normalizedEmail, isUsed: false });
        await PasswordResetModel.create({
          email: normalizedEmail,
          otpHash,
          resetToken,
          attempts: 0,
          isUsed: false,
          expiresAt,
        });
      } catch (dbErr) {
        console.warn('[MongoDB PasswordResetModel create failed, falling back to store]:', dbErr);
      }
    }

    // Always maintain in store for hybrid resilience
    const existingStoreIndex = store.passwordResets.findIndex(
      (r: any) => r.email === normalizedEmail && !r.isUsed
    );
    const storeRecord = {
      _id: `rst_${Date.now()}`,
      email: normalizedEmail,
      otpHash,
      resetToken,
      attempts: 0,
      isUsed: false,
      expiresAt,
      createdAt: new Date(),
    };
    if (existingStoreIndex >= 0) {
      store.passwordResets[existingStoreIndex] = storeRecord;
    } else {
      store.passwordResets.push(storeRecord);
    }

    // 4. Dispatch Email via Brevo
    const emailResult = await sendPasswordResetOtpEmail(normalizedEmail, user.name || 'User', rawOtp);
    const isEmailDelivered = emailResult.success;
    const isIpBlocked = emailResult.error?.includes('unrecognised IP address') ||
                        emailResult.error?.includes('authorised_ips') ||
                        emailResult.error?.includes('Unauthorized IP address');

    if (!isEmailDelivered) {
      console.warn(`[ForgotPassword] Brevo delivery notification for ${normalizedEmail}:`, emailResult.error);
    }

    const responsePayload: any = {
      success: true,
      message: isEmailDelivered
        ? `A 6-digit verification code has been dispatched to ${normalizedEmail}. It will expire in ${OTP_EXPIRY_MINUTES} minutes.`
        : `Brevo SMTP pending IP authorization. Use the test verification code below or authorize IP 14.195.19.210 in Brevo.`,
      resetToken,
      email: normalizedEmail,
      emailDelivered: isEmailDelivered,
    };

    if (!isEmailDelivered) {
      responsePayload.emailError = emailResult.error;
      // In development or when Brevo IP is pending authorization, supply devOtp for smooth workflow
      responsePayload.devOtp = rawOtp;
      if (isIpBlocked) {
        responsePayload.ipNotice = '14.195.19.210';
        responsePayload.authorizationUrl = 'https://app.brevo.com/security/authorised_ips';
      }
    }

    return res.status(200).json(responsePayload);
  } catch (error: any) {
    console.error('[forgotPassword error]:', error);
    return res.status(500).json({
      success: false,
      message: error.message || 'Failed to process password reset request.',
    });
  }
};

/**
 * Verify 6-digit OTP code with JWT session token.
 * Validates attempt limit, expiration, and returns signed verificationToken.
 */
export const verifyOtp = async (req: Request, res: Response) => {
  try {
    const { email, otp, resetToken } = req.body;

    if (!email || !otp || !resetToken) {
      return res.status(400).json({
        success: false,
        message: 'Email, verification code (OTP), and session token are required.',
      });
    }

    const normalizedEmail = String(email).toLowerCase().trim();
    const cleanOtp = String(otp).trim();

    if (!/^\d{6}$/.test(cleanOtp)) {
      return res.status(400).json({
        success: false,
        message: 'The verification code must be exactly 6 digits.',
      });
    }

    // 1. Verify incoming resetToken JWT
    let decoded: any = null;
    try {
      decoded = jwt.verify(resetToken, JWT_SECRET) as any;
    } catch (_err) {
      return res.status(401).json({
        success: false,
        message: 'Invalid or expired session. Please request a new verification code.',
      });
    }

    if (decoded.email !== normalizedEmail || decoded.purpose !== 'pwd_reset_pending') {
      return res.status(401).json({
        success: false,
        message: 'Invalid reset session token.',
      });
    }

    // 2. Fetch reset record from MongoDB or Store
    let resetRecord: any = null;
    if (isConnectedToMongo) {
      try {
        resetRecord = await PasswordResetModel.findOne({
          email: normalizedEmail,
          resetToken,
          isUsed: false,
        }).sort({ createdAt: -1 });
      } catch (dbErr) {
        console.warn('[MongoDB findOne PasswordReset failed, using store]:', dbErr);
      }
    }
    if (!resetRecord) {
      resetRecord = store.passwordResets
        .slice()
        .reverse()
        .find((r: any) => r.email === normalizedEmail && r.resetToken === resetToken && !r.isUsed);
    }

    if (!resetRecord) {
      return res.status(400).json({
        success: false,
        message: 'No active verification request found. Please request a new code.',
      });
    }

    // Check expiration
    if (new Date() > new Date(resetRecord.expiresAt)) {
      return res.status(400).json({
        success: false,
        message: 'Verification code has expired. Please request a new code.',
      });
    }

    // Check attempt lockout
    if (resetRecord.attempts >= MAX_OTP_ATTEMPTS) {
      return res.status(429).json({
        success: false,
        message: 'Too many incorrect attempts. For your security, this code has been invalidated. Please request a new one.',
      });
    }

    // 3. Verify OTP Hash
    const expectedHash = hashOtp(cleanOtp, normalizedEmail);
    const hashMatches = resetRecord.otpHash === expectedHash;

    if (!hashMatches) {
      resetRecord.attempts += 1;
      if (typeof resetRecord.save === 'function') {
        await resetRecord.save();
      }
      const attemptsRemaining = MAX_OTP_ATTEMPTS - resetRecord.attempts;
      return res.status(400).json({
        success: false,
        message: attemptsRemaining > 0
          ? `Invalid verification code. ${attemptsRemaining} attempt${attemptsRemaining === 1 ? '' : 's'} remaining.`
          : 'Too many incorrect attempts. Please request a new verification code.',
        attemptsRemaining,
      });
    }

    // 4. Issue signed verificationToken (valid for 15 minutes)
    const verificationToken = jwt.sign(
      { email: normalizedEmail, purpose: 'pwd_reset_verified' },
      JWT_SECRET,
      { expiresIn: '15m' }
    );

    resetRecord.verificationToken = verificationToken;
    if (typeof resetRecord.save === 'function') {
      await resetRecord.save();
    }

    return res.status(200).json({
      success: true,
      message: 'Code verified successfully! You may now set your new password.',
      verificationToken,
    });
  } catch (error: any) {
    console.error('[verifyOtp error]:', error);
    return res.status(500).json({
      success: false,
      message: error.message || 'OTP verification failed.',
    });
  }
};

/**
 * Reset Password using verified JWT token
 */
export const resetPassword = async (req: Request, res: Response) => {
  try {
    const { email, newPassword, verificationToken } = req.body;

    if (!email || !newPassword || !verificationToken) {
      return res.status(400).json({
        success: false,
        message: 'Email, new password, and verification token are required.',
      });
    }

    const normalizedEmail = String(email).toLowerCase().trim();

    if (typeof newPassword !== 'string' || newPassword.length < 8) {
      return res.status(400).json({
        success: false,
        message: 'New password must be at least 8 characters in length.',
      });
    }

    // 1. Verify verificationToken
    let decoded: any = null;
    try {
      decoded = jwt.verify(verificationToken, JWT_SECRET) as any;
    } catch (_err) {
      return res.status(401).json({
        success: false,
        message: 'Invalid or expired verification session. Please restart password recovery.',
      });
    }

    if (decoded.email !== normalizedEmail || decoded.purpose !== 'pwd_reset_verified') {
      return res.status(401).json({
        success: false,
        message: 'Verification token is invalid or does not match email.',
      });
    }

    // 2. Mark reset record as used
    if (isConnectedToMongo) {
      try {
        await PasswordResetModel.updateMany(
          { email: normalizedEmail, verificationToken },
          { $set: { isUsed: true } }
        );
      } catch (dbErr) {
        console.warn('[MongoDB PasswordResetModel updateMany failed]:', dbErr);
      }
    }
    const storeRecord = store.passwordResets.find(
      (r: any) => r.email === normalizedEmail && r.verificationToken === verificationToken
    );
    if (storeRecord) {
      storeRecord.isUsed = true;
    }

    // 3. Hash new password
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(newPassword, salt);

    // 4. Update user in MongoDB & Store
    let updatedUser: any = null;
    if (isConnectedToMongo) {
      try {
        updatedUser = await UserModel.findOneAndUpdate(
          { email: normalizedEmail },
          { $set: { passwordHash, updatedAt: new Date() } },
          { new: true }
        );
      } catch (dbErr) {
        console.warn('[MongoDB findOneAndUpdate User failed, fallback to store]:', dbErr);
      }
    }
    const userInStore = store.users.find((u) => u.email === normalizedEmail);
    if (userInStore) {
      userInStore.passwordHash = passwordHash;
      userInStore.updatedAt = new Date();
      if (!updatedUser) updatedUser = userInStore;
    }

    if (!updatedUser) {
      return res.status(404).json({
        success: false,
        message: 'User account could not be found to update password.',
      });
    }

    // 5. Send security alert email asynchronously
    sendPasswordResetConfirmationEmail(normalizedEmail, updatedUser.name || 'User').catch((err) => {
      console.warn('[Password Reset Confirmation Email Failed]:', err?.message);
    });

    return res.status(200).json({
      success: true,
      message: 'Your password has been successfully reset! You can now log in with your new credentials.',
    });
  } catch (error: any) {
    console.error('[resetPassword error]:', error);
    return res.status(500).json({
      success: false,
      message: error.message || 'Failed to reset password.',
    });
  }
};

