import User from '../../models/User.js';

export const requireAdmin = async (req, res, next) => {
  try {
    const clerkUserId = req.auth?.userId;
    if (!clerkUserId) {
      return res.status(401).json({ message: "No autenticado." });
    }

    const user = await User.findOne({ clerkUserId });
    if (!user) {
      return res.status(403).json({ message: "Usuario no encontrado en la base de datos." });
    }

    if (user.rol !== 'ADMIN') {
      return res.status(403).json({ message: "Acceso denegado. Se requiere rol de administrador." });
    }

    
    next();
  } catch (error) {
    console.error("Error en el middleware requireAdmin:", error);
    return res.status(500).json({ message: "Error interno del servidor al verificar permisos." });
  }
};