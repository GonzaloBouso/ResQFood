import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useAuth } from '@clerk/clerk-react';

// Importamos AMBOS componentes de perfil
import PerfilUsuarioGeneral from './PerfilUsuarioGeneral';
import PerfilUsuarioEmpresa from './PerfilUsuarioEmpresa';
import API_BASE_URL from '../api/config.js';

const UserProfilePage = () => {
  // Leemos el ID de la URL. Le cambiamos el nombre a 'userId' para claridad.
  const { id: userId } = useParams();
  const { getToken } = useAuth();

  // Estados para manejar la carga de datos
  const [userData, setUserData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // useEffect para buscar los datos del usuario cuando el componente se monta o el ID cambia
  useEffect(() => {
    const fetchUserProfile = async () => {
      if (!userId) {
        setError("No se proporcionó un ID de usuario.");
        setIsLoading(false);
        return;
      }
      
      setIsLoading(true);
      setError(null);
      setUserData(null); // Limpiamos datos anteriores

      try {
        const token = await getToken();
        // Llamamos al endpoint del backend que ya creamos
        const response = await fetch(`${API_BASE_URL}/api/usuario/${userId}`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || `Error del servidor: ${response.status}`);
        }

        const data = await response.json();
        setUserData(data.user);
      } catch (err) {
        console.error("Error al buscar el perfil del usuario:", err);
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserProfile();
  }, [userId, getToken]);

  // Manejo de estados de carga y error
  if (isLoading) {
    return <div className="text-center py-20">Cargando perfil...</div>;
  }

  if (error) {
    return <div className="text-center py-20 text-red-600"><strong>Error:</strong> {error}</div>;
  }

  if (!userData) {
    return <div className="text-center py-20">No se pudo encontrar la información del perfil.</div>;
  }

  // ==================================================================
  // LA LÓGICA CLAVE:
  // Basado en el 'rol' del usuario, decidimos qué componente de perfil renderizar.
  // Le pasamos los 'userData' que hemos obtenido de la API como prop.
  // ==================================================================
  if (userData.rol === 'LOCAL') {
    return <PerfilUsuarioEmpresa userData={userData} />;
  } else {
    // Por defecto, o si el rol es 'GENERAL', mostramos el perfil general.
    return <PerfilUsuarioGeneral userData={userData} />;
  }
};

export default UserProfilePage;