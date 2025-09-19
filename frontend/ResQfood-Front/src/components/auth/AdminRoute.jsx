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

  if (isProfileComplete && currentUserRole === 'ADMIN') {
    
    return <Outlet />; 
  }

  // 4. Si no es un administrador, lo redirige al dashboard normal 
  return <Navigate to="/dashboard" replace />;
};

export default AdminRoute;