import { Clerk } from '@clerk/clerk-sdk-node';
import User from '../models/User.js';

// Inicializamos el cliente de Clerk directamente. Es más limpio y seguro.
const clerk = new Clerk({ secretKey: process.env.CLERK_SECRET_KEY });

export const requireAuth = async (req, res, next) => {
  try {
    // 1. Extraer el token del encabezado 'Authorization'
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      // Si no hay token, se deniega el acceso inmediatamente.
      return res.status(401).json({ message: 'No se proporcionó un token de autenticación.' });
    }
    const token = authHeader.split(' ')[1];

    // 2. Verificar el token directamente con el SDK de Clerk.
    // Esto decodifica el token y valida su firma y expiración.
    const payload = await clerk.verifyToken(token);
    
    // 3. Si el token es válido, adjuntamos el ID de usuario al objeto 'req'.
    // Esta es la forma más estándar y robusta de pasar la información.
    req.auth = { userId: payload.sub }; // 'sub' es el campo estándar para el ID de usuario en JWT
    const clerkUserId = req.auth.userId;
    
    // 4. Consultar nuestra base de datos para verificar si el usuario está activo.
    const user = await User.findOne({ clerkUserId }).select('activo');

    if (!user) {
      return res.status(403).json({ message: "Acceso denegado: El usuario no existe en nuestra base de datos." });
    }

    if (!user.activo) {
      return res.status(403).json({ message: "Acceso denegado: Tu cuenta ha sido suspendida." });
    }

    // 5. Si todas las comprobaciones pasan, el usuario está autorizado.
    // Pasamos el control al siguiente middleware o al controlador de la ruta.
    next();

  } catch (error) {
    // Este bloque 'catch' maneja cualquier error que ocurra, principalmente si el token es inválido.
    console.error("Error en el middleware de autenticación:", error.message);
    return res.status(401).json({ message: "Autenticación fallida: Token inválido o expirado." });
  }
};