// src/pages/UserProfilePage.jsx
import React, { useContext } from 'react';
import { ProfileStatusContext } from '../context/ProfileStatusContext'; // Ruta correcta al contexto
import PerfilUsuarioGeneral from './PerfilUsuarioGeneral';
import PerfilUsuarioEmpresa from './PerfilUsuarioEmpresa';

const UserProfilePage = () => {
  const profileCtx = useContext(ProfileStatusContext);

  // EXPLICACIÓN DE LA CORRECCIÓN:
  // 1. Obtenemos los datos directamente. Usamos un objeto vacío como fallback
  //    para evitar errores si el contexto es nulo en el primer milisegundo.
  const { isLoadingUserProfile, isProfileComplete, currentUserDataFromDB } = profileCtx || {};

  // 2. Condición de carga PRINCIPAL. Si isLoading es true, mostramos el mensaje de carga.

  if (isLoadingUserProfile) {
    return <div className="text-center py-10">Cargando perfil del usuario...</div>;
  }

  // 3. Después de cargar, verificamos si tenemos los datos y si el perfil está completo.
  //    Si no hay datos o el perfil no está completo, mostramos un mensaje de error/ayuda.
  //    Esta condición también protege contra el caso en que la carga falle.
  if (!isProfileComplete || !currentUserDataFromDB) {

    return <p className="text-center py-10">No se pudo cargar el perfil o está incompleto.</p>;
  }

  // 4. Si la carga terminó y tenemos los datos, decidimos qué componente renderizar.
  //    Pasamos los datos directamente como prop.
  if (currentUserDataFromDB.rol === 'LOCAL') {
    return <PerfilUsuarioEmpresa userData={currentUserDataFromDB} />;
  } 
  
  if (currentUserDataFromDB.rol === 'GENERAL') {
    return <PerfilUsuarioGeneral userData={currentUserDataFromDB} />;
  }

  
  return <p className="text-center py-10">Tipo de perfil no reconocido.</p>;
};

export default UserProfilePage;