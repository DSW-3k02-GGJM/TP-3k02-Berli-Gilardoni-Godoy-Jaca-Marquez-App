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
        return res.status(500).json({ message: 'Error al subir el archivo' });
      }
      if (!req.file) {
        return res
          .status(400)
          .json({ message: 'Solo se permiten archivos de imagen' });
      }
      res.status(200).json({
        message: 'La imagen ha sido subida exitosamente',
        imagePath: req.file.filename,
      });
    });
  } catch (error) {
    res.status(500).json({ message: 'Error de conexión' });
  }
};

const remove = async (req: Request, res: Response) => {
  try {
    const filename = req.params.filename;
    const imagePath = path.resolve('public', filename);
    fs.unlink(imagePath, (err) => {
      if (err && err.code !== 'ENOENT') {
        return res.status(500).json({ message: 'Error al eliminar la imagen' });
      }
      res
        .status(200)
        .json({ message: 'La imagen se ha eliminado exitosamente' });
    });
  } catch (error) {
    res.status(500).json({ message: 'Error de conexión' });
  }
};

export { add, remove };
