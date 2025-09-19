import User from '../models/User.js';

export const requireAuth = async (req, res, next) => {
 
  if (!req.auth || !req.auth.userId) {
    return res.status(401).json({ message: 'No autenticado.' });
  }

  try {
    const clerkUserId = req.auth.userId;
    const user = await User.findOne({ clerkUserId }).select('activo');

    if (!user) {
      return res.status(403).json({ message: "Acceso denegado: Usuario no encontrado." });
    }
    if (!user.activo) {
      return res.status(403).json({ message: "Acceso denegado: Cuenta suspendida." });
    }

    next();
  } catch (error) {
    console.error("Error en requireAuth:", error);
    return res.status(500).json({ message: "Error interno del servidor." });
  }
};