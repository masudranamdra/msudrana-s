import { Request, Response, NextFunction } from 'express';
import Message from '../models/Message';
import { sendContactNotification } from '../services/emailService';

// Get all messages (Admin Only)
export const getMessages = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const messages = await Message.find().sort({ createdAt: -1 });
    res.status(200).json({ success: true, count: messages.length, data: messages });
  } catch (error) {
    next(error);
  }
};

// Submit message (Public route)
export const createMessage = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { name, email, subject, message } = req.body;

    if (!name || !email || !subject || !message) {
      res.status(400).json({ success: false, message: 'Please provide all required fields' });
      return;
    }

    const newMessage = await Message.create({
      name,
      email,
      subject,
      message,
    });

    // Send async email notification
    // Uses sendContactNotification which catches its own errors internally to avoid disrupting responses
    await sendContactNotification(name, email, subject, message);

    res.status(201).json({
      success: true,
      message: 'Message sent successfully. Thank you!',
      data: newMessage,
    });
  } catch (error) {
    next(error);
  }
};

// Mark message as read/unread (Admin Only)
export const updateMessageStatus = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { isRead } = req.body;
    const messageObj = await Message.findByIdAndUpdate(
      req.params.id,
      { isRead },
      { new: true, runValidators: true }
    );

    if (!messageObj) {
      res.status(404).json({ success: false, message: 'Message not found' });
      return;
    }

    res.status(200).json({ success: true, data: messageObj });
  } catch (error) {
    next(error);
  }
};

// Delete message (Admin Only)
export const deleteMessage = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const messageObj = await Message.findById(req.params.id);
    if (!messageObj) {
      res.status(404).json({ success: false, message: 'Message not found' });
      return;
    }

    await messageObj.deleteOne();
    res.status(200).json({ success: true, message: 'Message deleted successfully' });
  } catch (error) {
    next(error);
  }
};
