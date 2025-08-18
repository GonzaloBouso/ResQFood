import { ClerkExpressRequireAuth } from '@clerk/clerk-sdk-node';
import User from '../models/User.js';

// Creamos una instancia del middleware de Clerk.
// Lo configuramos para que maneje el error él mismo en lugar de pasarlo a 'next'.
const clerkAuth = ClerkExpressRequireAuth();

// Este es nuestro ÚNICO middleware de autenticación y autorización.
export const requireAuth = async (req, res, next) => {
  // 1. Primero, dejamos que el middleware de Clerk verifique el token JWT.
  //    Lo envolvemos en un 'try...catch' porque puede lanzar errores.
  try {
    // Usamos 'await' para esperar a que termine la verificación asíncrona de Clerk.
    await new Promise((resolve, reject) => {
      clerkAuth(req, res, (err) => {
        if (err) {
          // Si Clerk encuentra un error (token inválido, expirado, etc.), lo rechazamos.
          return reject(err);
        }
        // Si el token es válido, req.auth se habrá poblado.
        resolve();
      });
    });

  } catch (error) {
    // Si la promesa fue rechazada, significa que el token no es válido.
    return res.status(401).json({ message: "Autenticación fallida: " + error.message });
  }

  // 2. Si el token de Clerk es válido, procedemos a nuestra verificación personalizada.
  try {
    const clerkUserId = req.auth?.userId;
    if (!clerkUserId) {
      // Esta comprobación es una seguridad extra, aunque Clerk ya debería haber fallado.
      return res.status(401).json({ message: "ID de usuario no encontrado en el token." });
    }

    // 3. Consultamos nuestra base de datos para verificar el estado 'activo' del usuario.
    const user = await User.findOne({ clerkUserId }).select('activo');

    if (!user) {
      return res.status(403).json({ message: "Acceso denegado: El usuario no existe en nuestra base de datos." });
    }

    if (!user.activo) {
      // Si el usuario está suspendido en nuestra DB, bloqueamos la petición.
      return res.status(403).json({ message: "Acceso denegado: Tu cuenta ha sido suspendida." });
    }

    // 4. Si todas las comprobaciones pasan, la petición puede continuar al controlador.
    next();

  } catch (dbError) {
    console.error("Error en la verificación de la base de datos en requireAuth:", dbError);
    return res.status(500).json({ message: "Error interno del servidor al verificar la autorización." });
  }
};