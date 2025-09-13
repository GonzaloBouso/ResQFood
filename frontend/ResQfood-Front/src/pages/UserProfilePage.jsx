import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useAuth } from '@clerk/clerk-react';
import API_BASE_URL from '../api/config.js';
import ProfileLayout from '../components/profile/ProfileLayout';

const UserProfilePage = () => {
  const { id: userId } = useParams();
  const { getToken } = useAuth();

  const [userData, setUserData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUserProfile = async () => {
      if (!userId) {
        setError("No se proporcionó un ID de usuario.");
        setIsLoading(false);
        return;
      }
      
      setIsLoading(true);
      setError(null);
      setUserData(null);

      try {
        const token = await getToken();
        const response = await fetch(`${API_BASE_URL}/api/usuario/${userId}`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || 'Error del servidor');
        }

        const data = await response.json();
        setUserData(data.user);
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserProfile();
  }, [userId, getToken]);

  if (isLoading) {
    return <div className="text-center py-20">Cargando perfil del usuario...</div>;
  }
  if (error) {
    return <div className="text-center py-20 text-red-600"><strong>Error:</strong> {error}</div>;
  }
  if (!userData) {
    return <div className="text-center py-20">No se pudo encontrar el perfil de este usuario.</div>;
  }

 
  return (
    <ProfileLayout 
      userData={userData} 
      isEditable={false} 
    />
  );
};

export default UserProfilePage;