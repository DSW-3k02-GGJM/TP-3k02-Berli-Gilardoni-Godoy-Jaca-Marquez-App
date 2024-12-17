import { Router } from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';

const router = Router();

// Configuración de multer
const storage = multer.diskStorage({
  // Configuración de la carpeta de destino
  destination: (req, file, cb) => {
    cb(null, path.resolve('public'));
  },
  filename: (req, file, cb) => {
    // Configuracion del nombre del archivo
    cb(null, `${Date.now()}-${file.originalname}`);
  }
});

const upload = multer({ storage });

// Ruta para subir imágenes
router.post('/', upload.single('image'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: 'No file received' });
  }
  const filePath = `${req.file.filename}`; // Ruta guardada en la BD
  res.json({ message: 'Image uploaded successfully', path: filePath });
});

// Ruta para eliminar imágenes
router.delete('/:filename', (req, res) => {
  const filename = req.params.filename;
  const filePath = path.resolve('public', filename);
  fs.unlink(filePath, (err) => {
    if (err) {
      return res.status(500).json({ message: 'Error deleting the image' });
    }
    res.json({ message: 'Image deleted successfully' });
  });
});

export { router as uploadRouter };