import React, { useContext } from 'react';
import { ProfileStatusContext } from '../context/ProfileStatusContext';
import PerfilUsuarioGeneral from './PerfilUsuarioGeneral'; // Asegúrate de tener este componente
import PerfilUsuarioEmpresa from './PerfilUsuarioEmpresa'; // Asegúrate de tener este componente

const UserProfilePage = () => {
  const { isLoading, isComplete, currentUserDataFromDB } = useContext(ProfileStatusContext);

  if (isLoading) {
    return <div className="text-center py-10">Cargando perfil...</div>;
  }

  if (!isComplete || !currentUserDataFromDB) {
    return <p className="text-center py-10">No se pudo cargar el perfil o está incompleto.</p>;
  }

  if (currentUserDataFromDB.rol === 'LOCAL') {
    return <PerfilUsuarioEmpresa userData={currentUserDataFromDB} />;
  } 
  
  if (currentUserDataFromDB.rol === 'GENERAL') {
    return <PerfilUsuarioGeneral userData={currentUserDataFromDB} />;
  }

  return <p className="text-center py-10">Tipo de perfil no reconocido.</p>;
};

export default UserProfilePage;