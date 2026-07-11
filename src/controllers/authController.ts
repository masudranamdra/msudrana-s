import { Request, Response, NextFunction } from 'express';
import User, { IUser } from '../models/User';
import { sendTokenResponse } from '../utils/generateToken';
import { AuthenticatedRequest } from '../middleware/authMiddleware';
import nodemailer from 'nodemailer';
import crypto from 'crypto';

// Register User
export const register = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { username, email, password } = req.body;

    // Check if user exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      res.status(400).json({ success: false, message: 'User already exists' });
      return;
    }

    // Determine role based on ADMIN_EMAILS
    let role: 'admin' | 'user' = 'user';
    const adminEmailsEnv = process.env.ADMIN_EMAILS || '';
    const adminEmails = adminEmailsEnv.split(',').map(e => e.trim().toLowerCase());
    
    if (adminEmails.includes(email.trim().toLowerCase())) {
      role = 'admin';
    }

    // Create user
    const user = await User.create({
      username,
      email,
      password,
      role,
    });

    sendTokenResponse(user, 201, res);
  } catch (error) {
    next(error);
  }
};

// Login User
export const login = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      res.status(400).json({ success: false, message: 'Please provide an email and password' });
      return;
    }

    // Check for user
    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      res.status(401).json({ success: false, message: 'Invalid credentials' });
      return;
    }

    // Check password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      res.status(401).json({ success: false, message: 'Invalid credentials' });
      return;
    }

    sendTokenResponse(user, 200, res);
  } catch (error) {
    next(error);
  }
};

// Logout User
export const logout = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const cookieOptions: any = {
    expires: new Date(Date.now() + 10 * 1000),
    httpOnly: true,
    path: '/',
  };

  if (process.env.NODE_ENV === 'production') {
    cookieOptions.secure = true;
    cookieOptions.sameSite = 'none';
  } else {
    cookieOptions.sameSite = 'lax';
  }

  res.cookie('token', 'none', cookieOptions);
  res.status(200).json({ success: true, message: 'Logged out successfully' });
};

// Get current user profile
export const getMe = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ success: false, message: 'Not authenticated' });
      return;
    }

    res.status(200).json({
      success: true,
      user: {
        id: req.user._id,
        username: req.user.username,
        email: req.user.email,
        role: req.user.role,
        avatar: req.user.avatar,
      },
    });
  } catch (error) {
    next(error);
  }
};

// Google OAuth Login / Exchange
export const googleLogin = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { token, email, username, googleId, avatar } = req.body;

    if (!email) {
      res.status(400).json({ success: false, message: 'Email from OAuth provider is required' });
      return;
    }

    // Check if user exists
    let user = await User.findOne({ email });

    if (user) {
      // If user exists but no googleId, associate it
      if (!user.googleId) {
        user.googleId = googleId;
        if (avatar && !user.avatar) user.avatar = avatar;
        await user.save();
      }
    } else {
      // Determine role
      let role: 'admin' | 'user' = 'user';
      const adminEmailsEnv = process.env.ADMIN_EMAILS || '';
      const adminEmails = adminEmailsEnv.split(',').map(e => e.trim().toLowerCase());
      
      if (adminEmails.includes(email.trim().toLowerCase())) {
        role = 'admin';
      }

      // Create new user
      user = await User.create({
        username: username || email.split('@')[0],
        email: email,
        googleId: googleId,
        avatar: avatar || '',
        role: role,
      });
    }

    sendTokenResponse(user, 200, res);
  } catch (error) {
    next(error);
  }
};

// Forgot Password Flow
export const forgotPassword = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      res.status(404).json({ success: false, message: 'There is no user with that email' });
      return;
    }

    // In a full production app, generate reset token and mail it.
    // For local ease and quick testing, we will generate a temporary 6-digit PIN 
    // and store it or return it, and also send an email if configured.
    const tempPin = Math.floor(100000 + Math.random() * 900000).toString();
    
    // Store simple hash in memory/db or just update their password temporarily
    // To make it easy and testable, we'll reset their password directly to this pin and send it via email (or return it in response for fast testing).
    const salt = await crypto.randomBytes(8).toString('hex');
    user.password = tempPin;
    await user.save();

    // Try sending email
    const emailUser = process.env.EMAIL_USER;
    if (emailUser) {
      const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS,
        },
      });

      await transporter.sendMail({
        from: `"Portfolio SaaS Reset" <${emailUser}>`,
        to: email,
        subject: 'Your Password Has Been Reset',
        html: `<p>Your password has been reset. Your temporary password is: <strong>${tempPin}</strong>. Please change it after logging in.</p>`,
      });
    }

    res.status(200).json({
      success: true,
      message: 'Temporary password sent to email',
      tempPassword: process.env.NODE_ENV === 'development' ? tempPin : undefined, // expose in development for easy verification
    });
  } catch (error) {
    next(error);
  }
};

// Reset Password Flow (from dashboard or logged in state)
export const updatePassword = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { currentPassword, newPassword } = req.body;
    
    if (!req.user) {
      res.status(401).json({ success: false, message: 'Not authorized' });
      return;
    }

    const user = await User.findById(req.user._id).select('+password');
    if (!user) {
      res.status(404).json({ success: false, message: 'User not found' });
      return;
    }

    // Check current password if it exists (OAuth users might not have password)
    if (user.password) {
      const isMatch = await user.comparePassword(currentPassword);
      if (!isMatch) {
        res.status(400).json({ success: false, message: 'Incorrect current password' });
        return;
      }
    }

    user.password = newPassword;
    await user.save();

    res.status(200).json({ success: true, message: 'Password updated successfully' });
  } catch (error) {
    next(error);
  }
};
