import React, { useState, useEffect, useContext } from 'react';
import { useParams } from 'react-router-dom';
import { useAuth } from '@clerk/clerk-react';
import { ProfileStatusContext } from '../context/ProfileStatusContext';

import PerfilUsuarioGeneral from './PerfilUsuarioGeneral';
import PerfilUsuarioEmpresa from './PerfilUsuarioEmpresa';
import API_BASE_URL from '../api/config.js';

const UserProfilePage = () => {
  const { id: userIdFromUrl } = useParams();
  const { getToken } = useAuth();
  const { currentUserDataFromDB } = useContext(ProfileStatusContext);

  const [userDataToDisplay, setUserDataToDisplay] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUserProfile = async () => {
      // Optimización: Si estamos viendo nuestro propio perfil, usamos los datos del contexto.
      if (currentUserDataFromDB && currentUserDataFromDB._id === userIdFromUrl) {
        setUserDataToDisplay(currentUserDataFromDB);
        setIsLoading(false);
        return;
      }

      // Si es el perfil de otro usuario, hacemos la llamada a la API.
      setIsLoading(true);
      setError(null);
      try {
        const token = await getToken();
        const response = await fetch(`${API_BASE_URL}/api/usuario/${userIdFromUrl}`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || `Error del servidor: ${response.status}`);
        }
        const data = await response.json();
        setUserDataToDisplay(data.user);
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserProfile();
  }, [userIdFromUrl, getToken, currentUserDataFromDB]);

  if (isLoading) {
    return <div className="text-center py-20">Cargando perfil...</div>;
  }

  if (error) {
    return <div className="text-center py-20 text-red-600"><strong>Error:</strong> {error}</div>;
  }

  if (!userDataToDisplay) {
    return <div className="text-center py-20">No se pudo encontrar la información del perfil.</div>;
  }

  if (userDataToDisplay.rol === 'LOCAL') {
    return <PerfilUsuarioEmpresa userData={userDataToDisplay} />;
  } else {
    return <PerfilUsuarioGeneral userData={userDataToDisplay} />;
  }
};

export default UserProfilePage;