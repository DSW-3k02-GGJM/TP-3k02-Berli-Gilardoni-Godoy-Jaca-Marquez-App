import { Router } from 'express';
import multer from 'multer';
import path from 'path';

const router = Router();

// Configuración de multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    console.log('Configurando destino de almacenamiento');
    cb(null, path.resolve('uploads')); // Usar path.resolve para una ruta absoluta
  },
  filename: (req, file, cb) => {
    console.log('Configurando nombre de archivo');
    cb(null, `${Date.now()}-${file.originalname}`);
  }
});

const upload = multer({ storage });

// Ruta para subir imágenes
//router.post('/upload', upload.single('image'), (req, res) => {
router.post('/', upload.single('image'), (req, res) => {
  console.log('Recibiendo solicitud de subida de imagen');
  if (!req.file) {
    console.log('No se recibió ningún archivo');
    return res.status(400).json({ message: 'No se recibió ningún archivo' });
  }
  res.json({ message: 'Imagen subida exitosamente', file: req.file });
});

export { router as uploadRouter };