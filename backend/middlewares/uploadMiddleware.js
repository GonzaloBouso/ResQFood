import multer from 'multer';
import { v2 as cloudinary } from 'cloudinary';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import dotenv from 'dotenv';

dotenv.config(); 

cloudinary.config({ 
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
  api_key: process.env.CLOUDINARY_API_KEY, 
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true 
});

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'resqfood_donaciones', 
    allowed_formats: ['jpeg', 'png', 'jpg', 'webp'],
 
  },
});


const upload = multer({ 
  storage: storage,
  limits: {
    fileSize: 1024 * 1024 * 5 
  },
  fileFilter: (req, file, cb) => {
   
    if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png' || file.mimetype === 'image/jpg' || file.mimetype === 'image/webp') {
      cb(null, true);
    } else {
      cb(new Error('Formato de archivo no soportado. Solo se permiten JPEG, PNG, JPG, WEBP.'), false);
    }
  }
});


export const uploadDonacionImages = upload.array('imagenesDonacion', 5); 

export const uploadAvatar = multer({ storage: storage }).single('avatar');
