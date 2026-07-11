import { Request, Response } from 'express';
import About from '../models/About';

// I will write a simple controller that fetches and updates the single About document.

export const getAbout = async (req: Request, res: Response) => {
  try {
    let about = await About.findOne();
    if (!about) {
      about = await About.create({});
    }
    res.status(200).json({ success: true, data: about });
  } catch (error: any) {
    res.status(500).json({ success: false, message: 'Server Error', error: error.message });
  }
};

export const updateAbout = async (req: Request, res: Response) => {
  try {
    const aboutData = req.body;
    let about = await About.findOne();
    
    if (about) {
      about = await About.findByIdAndUpdate(about._id, aboutData, {
        new: true,
        runValidators: true,
      });
    } else {
      about = await About.create(aboutData);
    }

    res.status(200).json({ success: true, data: about, message: 'About section updated successfully' });
  } catch (error: any) {
    res.status(500).json({ success: false, message: 'Error updating About section', error: error.message });
  }
};
