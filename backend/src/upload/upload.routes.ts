// Express
import { Router, Request } from 'express';

// External Libraries
import fs from 'fs';
import multer from 'multer';
import path from 'path';

export const uploadRouter = Router();

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.resolve('public'));
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const fileFilter = (
  req: Request,
  file: Express.Multer.File,
  cb: multer.FileFilterCallback
) => {
  if (
    file.mimetype === 'image/jpeg' ||
    file.mimetype === 'image/png' ||
    file.mimetype === 'image/gif'
  ) {
    cb(null, true);
  } else {
    cb(null, false);
  }
};

const upload = multer({ storage, fileFilter });

uploadRouter.post('/', (req, res) => {
  upload.single('image')(req, res, (err) => {
    if (err) {
      return res.status(500).json({ message: 'Error uploading file' });
    }
    if (!req.file) {
      return res.status(400).json({ message: 'Only image files are allowed!' });
    }
    const filePath = req.file.filename;
    res.status(200).json({
      message: 'Image uploaded successfully',
      path: filePath,
    });
  });
});

uploadRouter.delete('/:filename', (req, res) => {
  const filename = req.params.filename;
  const filePath = path.resolve('public', filename);
  fs.unlink(filePath, (err) => {
    if (err) {
      return res.status(500).json({ message: 'Error deleting the image' });
    }
    res.status(200).json({ message: 'Image deleted successfully' });
  });
});
