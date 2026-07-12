"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updatePassword = exports.forgotPassword = exports.googleLogin = exports.getMe = exports.logout = exports.login = exports.register = void 0;
const User_1 = __importDefault(require("../models/User"));
const generateToken_1 = require("../utils/generateToken");
const nodemailer_1 = __importDefault(require("nodemailer"));
const crypto_1 = __importDefault(require("crypto"));
// Register User
const register = async (req, res, next) => {
    try {
        const { username, email, password } = req.body;
        // Check if email is authorized
        const adminEmailsEnv = process.env.ADMIN_EMAILS || '';
        const adminEmails = adminEmailsEnv.split(',').map(e => e.trim().toLowerCase());
        if (!adminEmails.includes(email.trim().toLowerCase())) {
            res.status(403).json({
                success: false,
                message: 'You are not authorized to register. Please contact the administrator.'
            });
            return;
        }
        // Check if user exists
        const userExists = await User_1.default.findOne({ email });
        if (userExists) {
            res.status(400).json({ success: false, message: 'User already exists' });
            return;
        }
        // Create user with admin role (only authorized emails can register)
        const user = await User_1.default.create({
            username,
            email,
            password,
            role: 'admin',
        });
        (0, generateToken_1.sendTokenResponse)(user, 201, res);
    }
    catch (error) {
        next(error);
    }
};
exports.register = register;
// Login User
const login = async (req, res, next) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            res.status(400).json({ success: false, message: 'Please provide an email and password' });
            return;
        }
        // Check if email is authorized
        const adminEmailsEnv = process.env.ADMIN_EMAILS || '';
        const adminEmails = adminEmailsEnv.split(',').map(e => e.trim().toLowerCase());
        if (!adminEmails.includes(email.trim().toLowerCase())) {
            res.status(403).json({
                success: false,
                message: 'You are not authorized to access this application. Please contact the administrator.'
            });
            return;
        }
        // Check for user
        const user = await User_1.default.findOne({ email }).select('+password');
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
        (0, generateToken_1.sendTokenResponse)(user, 200, res);
    }
    catch (error) {
        next(error);
    }
};
exports.login = login;
// Logout User
const logout = async (req, res, next) => {
    const cookieOptions = {
        expires: new Date(Date.now() + 10 * 1000),
        httpOnly: true,
        path: '/',
    };
    if (process.env.NODE_ENV === 'production') {
        cookieOptions.secure = true;
        cookieOptions.sameSite = 'none';
    }
    else {
        cookieOptions.sameSite = 'lax';
    }
    res.cookie('token', 'none', cookieOptions);
    res.status(200).json({ success: true, message: 'Logged out successfully' });
};
exports.logout = logout;
// Get current user profile
const getMe = async (req, res, next) => {
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
    }
    catch (error) {
        next(error);
    }
};
exports.getMe = getMe;
// Google OAuth Login / Exchange
const googleLogin = async (req, res, next) => {
    try {
        const { token, email, username, googleId, avatar } = req.body;
        if (!email) {
            res.status(400).json({ success: false, message: 'Email from OAuth provider is required' });
            return;
        }
        // Check if email is authorized - this should be the FIRST check
        const adminEmailsEnv = process.env.ADMIN_EMAILS || '';
        const adminEmails = adminEmailsEnv.split(',').map(e => e.trim().toLowerCase());
        if (!adminEmails.includes(email.trim().toLowerCase())) {
            res.status(403).json({
                success: false,
                message: 'You are not authorized to access this application. Please contact the administrator.'
            });
            return;
        }
        // Check if user exists
        let user = await User_1.default.findOne({ email });
        if (user) {
            // If user exists but no googleId, associate it
            if (!user.googleId) {
                user.googleId = googleId;
                if (avatar && !user.avatar)
                    user.avatar = avatar;
                await user.save();
            }
        }
        else {
            // Create new user with admin role (email is already authorized at this point)
            user = await User_1.default.create({
                username: username || email.split('@')[0],
                email: email,
                googleId: googleId,
                avatar: avatar || '',
                role: 'admin',
            });
        }
        (0, generateToken_1.sendTokenResponse)(user, 200, res);
    }
    catch (error) {
        next(error);
    }
};
exports.googleLogin = googleLogin;
// Forgot Password Flow
const forgotPassword = async (req, res, next) => {
    try {
        const { email } = req.body;
        const user = await User_1.default.findOne({ email });
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
        const salt = await crypto_1.default.randomBytes(8).toString('hex');
        user.password = tempPin;
        await user.save();
        // Try sending email
        const emailUser = process.env.EMAIL_USER;
        if (emailUser) {
            const transporter = nodemailer_1.default.createTransport({
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
    }
    catch (error) {
        next(error);
    }
};
exports.forgotPassword = forgotPassword;
// Reset Password Flow (from dashboard or logged in state)
const updatePassword = async (req, res, next) => {
    try {
        const { currentPassword, newPassword } = req.body;
        if (!req.user) {
            res.status(401).json({ success: false, message: 'Not authorized' });
            return;
        }
        const user = await User_1.default.findById(req.user._id).select('+password');
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
    }
    catch (error) {
        next(error);
    }
};
exports.updatePassword = updatePassword;
