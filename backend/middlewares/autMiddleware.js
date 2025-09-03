import { Clerk } from '@clerk/clerk-sdk-node';
import User from '../models/User.js';

// Inicializamos el cliente de Clerk directamente.
const clerk = new Clerk({ secretKey: process.env.CLERK_SECRET_KEY });

export const requireAuth = async (req, res, next) => {
  try {
    // 1. Extraer el token del encabezado 'Authorization'
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'No se proporcionó un token de autenticación.' });
    }
    const token = authHeader.split(' ')[1];

    // 2. Verificar el token directamente con el SDK de Clerk.
    const payload = await clerk.verifyToken(token);
    
    // 3. --- LA CORRECCIÓN MÁS IMPORTANTE ---
    // Adjuntamos el ID de usuario directamente a 'req.auth'.
    // Esta es la forma estándar que tus controladores esperan.
    req.auth = { userId: payload.sub }; 
    const clerkUserId = req.auth.userId;
    
    // 4. (Opcional, pero parte de tu lógica) Verificar si el usuario está activo en tu DB.
    const user = await User.findOne({ clerkUserId }).select('activo');
    if (!user) {
      return res.status(403).json({ message: "Acceso denegado: El usuario no existe en nuestra base de datos." });
    }
    if (!user.activo) {
      return res.status(403).json({ message: "Acceso denegado: Tu cuenta ha sido suspendida." });
    }

    // 5. Si todo está bien, pasamos al siguiente controlador en la cadena.
    next();

  } catch (error) {
    // Este bloque 'catch' maneja cualquier error, principalmente si el token es inválido.
    console.error("Error en el middleware de autenticación:", error.message);
    return res.status(401).json({ message: "Autenticación fallida: Token inválido o expirado." });
  }
};