import { Router } from 'express';
import multer from 'multer';
import path from 'path';

const router = Router();

// Configuración de multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    console.log('Configurando destino de almacenamiento');
    //cb(null, path.resolve('uploads')); // Usar path.resolve para una ruta absoluta
    //cb(null, path.resolve('../assets/img'));
    cb(null, path.resolve('../frontend/dist/browser/assets/img'));
    cb(null, path.resolve('../frontend/src/assets/img'));
  },
  filename: (req, file, cb) => {
    console.log('Configurando nombre de archivo');
    cb(null, `${Date.now()}-${file.originalname}`);
  }
});
/*
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    console.log('Configurando destino de almacenamiento');
    const uploadPath = path.resolve('frontend/src/assets/img');
    // Crea la carpeta si no existe
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    console.log('Configurando nombre de archivo');
    cb(null, `${Date.now()}-${file.originalname}`);
  }
});
*/

const upload = multer({ storage });

// Ruta para subir imágenes
//router.post('/upload', upload.single('image'), (req, res) => {
router.post('/', upload.single('image'), (req, res) => {
  console.log('Recibiendo solicitud de subida de imagen');
  if (!req.file) {
    console.log('No se recibió ningún archivo');
    return res.status(400).json({ message: 'No se recibió ningún archivo' });
  }
  //res.json({ message: 'Imagen subida exitosamente', file: req.file });
  //const filePath = `/backend/uploads/${req.file.filename}`;
  const filePath = `assets/img/${req.file.filename}`; // Con este nombre se guarda en la base de datos
  res.json({ message: 'Imagen subida exitosamente', path: filePath });
});

export { router as uploadRouter };