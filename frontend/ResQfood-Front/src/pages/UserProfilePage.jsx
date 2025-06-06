// src/pages/UserProfilePage.jsx
import React, { useContext } from 'react';
import { ProfileStatusContext } from '../context/ProfileStatusContext'; // Ajusta la ruta si es necesario
import PerfilUsuarioGeneral from './PerfilUsuarioGeneral';
import PerfilUsuarioEmpresa from './PerfilUsuarioEmpresa'; // Asegúrate de que esta página exista y esté correcta
// import LoadingSpinner from '../components/common/LoadingSpinner'; // Si tienes un componente de carga

const UserProfilePage = () => {
  const profileCtx = useContext(ProfileStatusContext);

  // Si isLoadingUserProfile es true (del contexto), muestra un spinner o mensaje.
  if (profileCtx.isLoadingUserProfile || !profileCtx.currentUserDataFromDB) {
    // return <LoadingSpinner />;
    return <div className="text-center py-10">Cargando perfil del usuario...</div>;
  }

  // Si el perfil no está completo, ProtectedRoute ya debería haber redirigido.
  // Pero como doble verificación:
  if (!profileCtx.isProfileComplete) {
    return <p className="text-center py-10">Perfil incompleto. Por favor, completa tu perfil.</p>;
  }

  // Renderiza el componente de perfil correcto basado en el rol
  // y pasa los datos completos del usuario como prop.
  if (profileCtx.currentUserDataFromDB.rol === 'LOCAL') {
    return <PerfilUsuarioEmpresa userData={profileCtx.currentUserDataFromDB} />;
  } else if (profileCtx.currentUserDataFromDB.rol === 'GENERAL') {
    return <PerfilUsuarioGeneral userData={profileCtx.currentUserDataFromDB} />;
  } else {
    // Manejar otros roles si es necesario, o un estado por defecto.
    return <p className="text-center py-10">Tipo de perfil no reconocido o no disponible.</p>;
  }
};

export default UserProfilePage;