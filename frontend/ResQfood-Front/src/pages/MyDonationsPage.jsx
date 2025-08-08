// src/pages/MyDonationsPage.jsx
import React, { useState, useEffect, useContext } from 'react';
import { useAuth } from '@clerk/clerk-react';
import { Link } from 'react-router-dom';
import { ProfileStatusContext } from '../context/ProfileStatusContext';
import API_BASE_URL from '../api/config';
import CardDonacion from '../components/layout/CardDonacion'; 

const MyDonationsPage = () => {
  const { getToken } = useAuth();
  // Obtiene los datos del usuario logueado desde nuestro contexto global
  const { currentUserDataFromDB, isLoading: isProfileLoading } = useContext(ProfileStatusContext);

  const [donaciones, setDonaciones] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Este useEffect se encargará de buscar las donaciones cuando el componente se cargue
  useEffect(() => {
    // No hacemos nada hasta que sepa quien es el usuairo
    if (isProfileLoading || !currentUserDataFromDB?._id) {
      if (!isProfileLoading) {
        setIsLoading(false); // Si ya no está cargando el perfil pero no hay ID, dejamos de cargar esta página
      }
      return;
    }

    const fetchMisDonaciones = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const token = await getToken();
        const userId = currentUserDataFromDB._id;
        
        // Llamamos a la ruta del backend 
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
  }, [currentUserDataFromDB, isProfileLoading, getToken]); // Se ejecuta si cambia el usuario

  // Función para decidir qué mostrar en pantalla (cargando, error, datos, etc.)
  const renderContent = () => {
    if (isLoading || isProfileLoading) {
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

    // Aquí renderizamos la lista de donaciones reales
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {donaciones.map(donacion => (
          
          <CardDonacion key={donacion._id} donacion={donacion} />
        ))}
      </div>
    );
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Mis Donaciones Activas</h1>
      {renderContent()}
    </div>
  );
};

export default MyDonationsPage;