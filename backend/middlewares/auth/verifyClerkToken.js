
import { ClerkExpressRequireAuth } from '@clerk/clerk-sdk-node';

const clerkAuth = ClerkExpressRequireAuth();

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

    next();

  } catch (error) {
    return res.status(401).json({ message: "Autenticación fallida: " + error.message });
  }
};