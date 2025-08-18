import { ClerkExpressRequireAuth } from "@clerk/clerk-sdk-node";

import { ClerkExpressRequireAuth } from '@clerk/clerk-sdk-node';
import User from '../models/User.js'; 

// Cambios para poder Banear usuarios

// Este es el middleware base de Clerk que verifica el token
const clerkAuthMiddleware = ClerkExpressRequireAuth();

// Creamos nuestro propio middleware "wrapper"
export const requireAuth = (req, res, next) => {
  // Primero, dejamos que el middleware de Clerk haga su trabajo
  clerkAuthMiddleware(req, res, async (err) => {
    if (err) {
      return next(err); // Si hay un error de token, lo pasamos
    }

    try {
      const clerkUserId = req.auth?.userId;
      if (!clerkUserId) {
        return res.status(401).json({ message: "Token inválido o ausente." });
      }

      // Consultamos en la BD si el usuario esta activo  
      const user = await User.findOne({ clerkUserId }).select('activo');

      if (!user) {
        // Esto puede pasar si el webhook aún no ha creado al usuario
        return res.status(403).json({ message: "El usuario no existe en nuestra base de datos." });
      }

      if (!user.activo) {
        // Si el usuario está suspendido en nuestra DB, bloqueamos la petición
        return res.status(403).json({ message: "Acceso denegado: tu cuenta está suspendida." });
      }

      // Si todo está bien, la petición continúa
      next();

    } catch (error) {
      console.error("Error en el middleware requireAuth personalizado:", error);
      res.status(500).json({ message: "Error interno del servidor al verificar la autorización." });
    }
  });
};