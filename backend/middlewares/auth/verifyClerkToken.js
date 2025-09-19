
import { ClerkExpressRequireAuth } from '@clerk/clerk-sdk-node';

const clerkAuth = ClerkExpressRequireAuth();

// Este middleware solo verifica el token de Clerk y añade `req.auth`.
// NO consulta nuestra base de datos.
export const verifyClerkToken = async (req, res, next) => {
  try {
    await new Promise((resolve, reject) => {
      clerkAuth(req, res, (err) => {
        if (err) {
          return reject(err);
        }
        resolve();
      });
    });

    if (!req.auth?.userId) {
      return res.status(401).json({ message: "ID de usuario no encontrado en el token." });
    }

    // El token es válido, continuamos.
    next();

  } catch (error) {
    return res.status(401).json({ message: "Autenticación fallida: " + error.message });
  }
};