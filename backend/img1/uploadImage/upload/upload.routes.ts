import { Router } from 'express';
import multer from 'multer';
import path from 'path';

const router = Router();

// Configuración de multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'img/uploads');
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  }
});

const upload = multer({ storage });

// Ruta para subir imágenes
router.post('/upload', upload.single('image'), (req, res) => {
  res.json({ message: 'Imagen subida exitosamente', file: req.file });
});

export { router as uploadRouter };