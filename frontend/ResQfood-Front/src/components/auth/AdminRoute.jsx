import React, { useContext } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { ProfileStatusContext } from '../../context/ProfileStatusContext';

const AdminRoute = () => {
  // 1. Obtenemos la información del perfil del contexto global.
  const { isLoadingUserProfile, isProfileComplete, currentUserRole } = useContext(ProfileStatusContext);

  // 2. Mientras se verifica el perfil, muestra un mensaje de carga.
  if (isLoadingUserProfile) {
    return <div className="text-center py-20">Verificando permisos de administrador...</div>;
  }

  // 3. La condición de seguridad:
  //    El perfil debe estar completo Y el rol debe ser 'ADMIN'.
  if (isProfileComplete && currentUserRole === 'ADMIN') {
    // Si cumple la condición, permite el acceso a la página anidada (ej. AdminDashboardPage)
    return <Outlet />; 
  }

  // 4. Si no es un administrador, lo redirige al dashboard normal (o a donde quieras).
  //    Esto previene que usuarios no autorizados vean el contenido de admin.
  return <Navigate to="/dashboard" replace />;
};

export default AdminRoute;