// Express
import { Request, Response } from 'express';

// External Libraries
import fs from 'fs';
import multer from 'multer';
import path from 'path';

const storage = multer.diskStorage({
  destination: (_, __, cb) => {
    cb(null, path.resolve('public'));
  },
  filename: (_, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const fileFilter = (
  _: Request,
  file: Express.Multer.File,
  cb: multer.FileFilterCallback
) => {
  if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
    cb(null, true);
  } else {
    cb(null, false);
  }
};

const upload = multer({ storage, fileFilter });

const add = async (req: Request, res: Response) => {
  try {
    upload.single('image')(req, res, (err) => {
      if (err) {
        return res.status(500).json({ message: 'Error uploading file' });
      }
      if (!req.file) {
        return res
          .status(400)
          .json({ message: 'Only image files are allowed!' });
      }
      res.status(200).json({
        message: 'Image uploaded successfully',
        imagePath: req.file.filename,
      });
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

const remove = async (req: Request, res: Response) => {
  try {
    const filename = req.params.filename;
    const imagePath = path.resolve('public', filename);
    fs.unlink(imagePath, (err) => {
      if (err) {
        return res.status(500).json({ message: 'Error deleting the image' });
      }
      res.status(200).json({ message: 'Image deleted successfully' });
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

export { add, remove };
