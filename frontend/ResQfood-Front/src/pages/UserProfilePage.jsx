import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useAuth } from '@clerk/clerk-react';
import API_BASE_URL from '../api/config.js';

// LA SOLUCIÓN: Importamos las nuevas "vistas"
import PerfilGeneralView from '../components/profile/PerfilGeneralView';
import PerfilEmpresaView from '../components/profile/PerfilEmpresaView';

const UserProfilePage = () => {
  const { id: userId } = useParams();
  const { getToken } = useAuth();
  const [userData, setUserData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // ... Tu lógica de fetch (sin cambios) ...
  }, [userId, getToken]);

  if (isLoading) return <div className="text-center py-20">Cargando perfil...</div>;
  if (error) return <div className="text-center py-20 text-red-600"><strong>Error:</strong> {error}</div>;
  if (!userData) return <div className="text-center py-20">No se pudo encontrar el perfil.</div>;

  // Decidimos qué VISTA renderizar
  if (userData.rol === 'LOCAL') {
    return <PerfilEmpresaView userData={userData} />;
  } else {
    return <PerfilGeneralView userData={userData} />;
  }
};

export default UserProfilePage;