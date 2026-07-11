import fs from 'fs';
import path from 'path';
import { cloudinary, isCloudinaryConfigured } from '../config/cloudinary';

export interface UploadResult {
  url: string;
  publicId?: string;
}

export const uploadFile = async (
  file: Express.Multer.File,
  folder: string = 'portfolio'
): Promise<UploadResult> => {
  if (isCloudinaryConfigured) {
    try {
      // Use temp file path created by multer to upload to Cloudinary
      const result = await cloudinary.uploader.upload(file.path, {
        folder: folder,
        resource_type: 'auto',
      });
      // Delete temp file after upload
      if (fs.existsSync(file.path)) {
        fs.unlinkSync(file.path);
      }
      return {
        url: result.secure_url,
        publicId: result.public_id,
      };
    } catch (error: any) {
      console.error('Cloudinary upload error, falling back to local storage:', error.message);
      // Fallback to local storage if Cloudinary fails
    }
  }

  // Local static storage fallback
  const uploadDir = path.join(process.cwd(), 'public', 'uploads');
  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
  }

  // Create a unique filename
  const extension = path.extname(file.originalname);
  const baseName = path.basename(file.originalname, extension).replace(/[^a-zA-Z0-9]/g, '_');
  const fileName = `${baseName}_${Date.now()}${extension}`;
  const targetPath = path.join(uploadDir, fileName);

  // If multer configured diskStorage, copy or rename from temp file path
  if (fs.existsSync(file.path)) {
    fs.renameSync(file.path, targetPath);
  } else if (file.buffer) {
    fs.writeFileSync(targetPath, file.buffer);
  } else {
    throw new Error('No file contents found to write to local storage');
  }

  // Return local static path. We will serve /uploads/ path in App
  const host = process.env.CLIENT_URL || 'http://localhost:5000';
  const url = `/uploads/${fileName}`; // serve relative, frontend can append host or let proxy handle it
  
  return {
    url,
    publicId: fileName,
  };
};

export const deleteFile = async (publicId: string): Promise<boolean> => {
  if (!publicId) return false;
  
  if (isCloudinaryConfigured && !publicId.includes('.')) {
    try {
      const result = await cloudinary.uploader.destroy(publicId);
      return result.result === 'ok';
    } catch (error: any) {
      console.error('Cloudinary delete error:', error.message);
      return false;
    }
  }

  // Local delete fallback
  try {
    const filePath = path.join(process.cwd(), 'public', 'uploads', publicId);
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
      return true;
    }
  } catch (error: any) {
    console.error('Local file delete error:', error.message);
  }
  return false;
};
