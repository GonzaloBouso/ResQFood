// src/middlewares/uploadMiddleware.js
import multer from 'multer';
import { v2 as cloudinary } from 'cloudinary';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import dotenv from 'dotenv';

dotenv.config(); // Asegúrate de que las variables de entorno estén cargadas

cloudinary.config({ 
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
  api_key: process.env.CLOUDINARY_API_KEY, 
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true // Para usar https
});

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'resqfood_donaciones', // Carpeta donde se guardarán las imágenes en Cloudinary
    allowed_formats: ['jpeg', 'png', 'jpg', 'webp'],
    // transformation: [{ width: 800, height: 800, crop: 'limit' }] // Opcional: transformar imágenes al subirlas
  },
});

// Configuración de Multer
const upload = multer({ 
  storage: storage,
  limits: {
    fileSize: 1024 * 1024 * 5 // Límite de 5MB por archivo (ajusta según necesites)
  },
  fileFilter: (req, file, cb) => {
    // Aceptar solo ciertos tipos de imagen
    if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png' || file.mimetype === 'image/jpg' || file.mimetype === 'image/webp') {
      cb(null, true);
    } else {
      cb(new Error('Formato de archivo no soportado. Solo se permiten JPEG, PNG, JPG, WEBP.'), false);
    }
  }
});

// Middleware para subir múltiples imágenes (ej. hasta 5) a un campo llamado 'imagenesDonacion'
export const uploadDonacionImages = upload.array('imagenesDonacion', 5); 

export const uploadAvatar = multer({ storage: storage }).single('avatar');
