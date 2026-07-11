import { Response } from 'express';
import jwt from 'jsonwebtoken';
import { IUser } from '../models/User';

export const sendTokenResponse = (user: IUser, statusCode: number, res: Response): void => {
  const jwtSecret = process.env.JWT_SECRET;
  if (!jwtSecret) {
    throw new Error('JWT_SECRET is not defined in environment variables');
  }

  // Create token
  const token = jwt.sign(
    { id: user._id, role: user.role, email: user.email, username: user.username },
    jwtSecret,
    { expiresIn: '30d' }
  );

  const cookieOptions: any = {
    expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
    httpOnly: true,
    path: '/',
  };

  if (process.env.NODE_ENV === 'production') {
    cookieOptions.secure = true;
    cookieOptions.sameSite = 'none'; // Essential for cross-domain cookies (Next.js on Vercel, Express on Render)
  } else {
    cookieOptions.sameSite = 'lax';
  }

  // Set cookie and send user details
  res
    .status(statusCode)
    .cookie('token', token, cookieOptions)
    .json({
      success: true,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
        avatar: user.avatar,
      },
    });
};
