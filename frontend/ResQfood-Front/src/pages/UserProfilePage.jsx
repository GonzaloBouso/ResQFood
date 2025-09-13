import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useAuth } from '@clerk/clerk-react';
import API_BASE_URL from '../api/config.js';

// Importamos las "vistas" de perfil que solo se encargan de mostrar datos.
import PerfilGeneralView from '../components/profile/PerfilGeneralView.jsx';
import PerfilEmpresaView from '../components/profile/PerfilEmpresaView.jsx';

const UserProfilePage = () => {
  // Leemos el ID del usuario de la URL (ej: /perfil/12345)
  const { id: userId } = useParams();
  const { getToken } = useAuth();

  // Estados para manejar la carga de datos de este perfil específico
  const [userData, setUserData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // ==================================================================
  // LA SOLUCIÓN:
  // Usamos useEffect para buscar los datos del usuario cuando el
  // componente se monta o cuando el ID en la URL cambia.
  // ==================================================================
  useEffect(() => {
    const fetchUserProfile = async () => {
      // Guarda de seguridad por si no hay ID
      if (!userId) {
        setError("No se proporcionó un ID de usuario en la URL.");
        setIsLoading(false);
        return;
      }
      
      setIsLoading(true);
      setError(null);
      setUserData(null); // Limpiamos datos anteriores al empezar una nueva búsqueda

      try {
        const token = await getToken();
        // Llamamos al endpoint del backend que creamos para buscar por ID
        const response = await fetch(`${API_BASE_URL}/api/usuario/${userId}`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || `Error del servidor: ${response.status}`);
        }

        const data = await response.json();
        setUserData(data.user); // Guardamos los datos del usuario en el estado
      } catch (err) {
        console.error("Error al buscar el perfil del usuario:", err);
        setError(err.message);
      } finally {
        setIsLoading(false); // Terminamos la carga, ya sea con éxito o con error
      }
    };

    fetchUserProfile();
  }, [userId, getToken]); // El efecto se ejecuta de nuevo si el userId en la URL cambia


  // --- Renderizado Condicional ---

  if (isLoading) {
    return <div className="text-center py-20">Cargando perfil...</div>;
  }
  if (error) {
    return <div className="text-center py-20 text-red-600"><strong>Error:</strong> {error}</div>;
  }
  if (!userData) {
    return <div className="text-center py-20">No se pudo encontrar la información de este perfil.</div>;
  }

  // Una vez que tenemos los datos, decidimos qué VISTA de perfil mostrar.
  if (userData.rol === 'LOCAL') {
    return <PerfilEmpresaView userData={userData} />;
  } else {
    return <PerfilGeneralView userData={userData} />;
  }
};

export default UserProfilePage;