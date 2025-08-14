import React, { useState, useEffect, useContext } from 'react';
import { useAuth } from '@clerk/clerk-react';
import { Link } from 'react-router-dom';
import { ProfileStatusContext } from '../context/ProfileStatusContext';
import API_BASE_URL from '../api/config';
import ListaDonaciones from '../components/donaciones/ListaDonaciones'; 

const MyDonationsPage = () => {
  const { getToken } = useAuth();
  const { currentUserDataFromDB, isLoadingUserProfile } = useContext(ProfileStatusContext);

  const [donaciones, setDonaciones] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  
  useEffect(() => {
   
    if (isLoadingUserProfile || !currentUserDataFromDB?._id) {
      if (!isLoadingUserProfile) {
        setIsLoading(false); 
      }
      return;
    }

    const fetchMisDonaciones = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const token = await getToken();
        const userId = currentUserDataFromDB._id;
        
        const response = await fetch(`${API_BASE_URL}/api/donacion/usuario/${userId}`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });

        if (!response.ok) {
          throw new Error('No se pudieron cargar tus donaciones.');
        }

        const data = await response.json();
        setDonaciones(data.donaciones || []);
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchMisDonaciones();
  }, [currentUserDataFromDB, isLoadingUserProfile, getToken]); 


  const renderContent = () => {
    if (isLoading || isLoadingUserProfile) {
      return <p className="text-center py-10 text-gray-500">Cargando tus donaciones...</p>;
    }

    if (error) {
      return <p className="text-center py-10 text-red-600"><strong>Error:</strong> {error}</p>;
    }

    if (donaciones.length === 0) {
      return (
        <div className="text-center py-10">
          <p className="text-gray-600 mb-4">No tienes donaciones activas en este momento.</p>
          <Link 
            to="/publicar-donacion" 
            className="inline-block bg-primary text-white font-bold py-2 px-4 rounded hover:bg-brandPrimaryDarker transition-colors"
          >
            ¡Publica tu primera donación!
          </Link>
        </div>
      );
    }

    return <ListaDonaciones donaciones={donaciones} />;
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">
          Mis Donaciones Activas
        </h1>
        <Link 
          to="/publicar-donacion" 
          className="inline-block bg-primary text-white font-bold py-2 px-4 rounded-lg hover:bg-brandPrimaryDarker transition-colors shadow-sm"
        >
          + Nueva Donación
        </Link>
      </div>
      {renderContent()}
    </div>
  );
};

export default MyDonationsPage;