import React, { useState, useEffect, useContext } from 'react';
import CardDonacion from '../components/layout/CardDonacion.jsx';
import { useAuth } from '@clerk/clerk-react';
import { ProfileStatusContext } from '../context/ProfileStatusContext.js'; 
import BotonPublicar from '../components/layout/BotonPublicar.jsx';
import API_BASE_URL from '../api/config.js';

const DashboardPage = () => {
  const { getToken } = useAuth();
  const { 
    isLoading, 
    currentUserDataFromDB, 
    activeSearchLocation, 
    setActiveSearchLocation,
    donationCreationTimestamp 
  } = useContext(ProfileStatusContext);

  const [donaciones, setDonaciones] = useState([]);
  const [isLoadingDonaciones, setIsLoadingDonaciones] = useState(false);
  const [errorDonaciones, setErrorDonaciones] = useState(null);
  const [mensajeUbicacion, setMensajeUbicacion] = useState('Determinando tu ubicación...');

  useEffect(() => {
    if (isLoading || activeSearchLocation) return;

    if (currentUserDataFromDB?.ubicacion?.coordenadas?.coordinates?.length === 2) {
      const [lon, lat] = currentUserDataFromDB.ubicacion.coordenadas.coordinates;
      if (lat !== 0 || lon !== 0) {
        setActiveSearchLocation({ lat, lng: lon, address: currentUserDataFromDB.ubicacion.ciudad || 'Ubicación de tu perfil' });
        return;
      }
    }

    if (navigator.geolocation) {
      setMensajeUbicacion('Solicitando tu ubicación actual...');
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setActiveSearchLocation({ lat: latitude, lng: longitude, address: "Tu ubicación actual" });
        },
        (error) => {
          console.error("Dashboard: Error geolocalización inicial:", error);
          setMensajeUbicacion('No se pudo obtener tu ubicación. Por favor, selecciona una.');
        }
      );
    } else {
      setMensajeUbicacion('Selecciona una ubicación para ver donaciones.');
    }
  }, [isLoading, currentUserDataFromDB, activeSearchLocation, setActiveSearchLocation]);

  useEffect(() => {
    if (activeSearchLocation?.address) {
      setMensajeUbicacion(`Mostrando donaciones cerca de: ${activeSearchLocation.address}`);
    } else if (!isLoading) {
      setMensajeUbicacion('Selecciona una ubicación en el menú superior para ver donaciones.');
    }
  }, [activeSearchLocation, isLoading]);

  useEffect(() => {
    if (!activeSearchLocation?.lat || !activeSearchLocation?.lng) {
      setDonaciones([]);
      return;
    }

    const fetchDonacionesCercanas = async () => {
      setIsLoadingDonaciones(true); 
      setErrorDonaciones(null);
      try {
        const token = await getToken();
        const { lat, lng } = activeSearchLocation;
        const distanciaMaxKm = 50;
        const apiUrl = `${API_BASE_URL}/api/donacion/cercanas?lat=${lat}&lon=${lng}&distanciaMaxKm=${distanciaMaxKm}`;
        
        const response = await fetch(apiUrl, { headers: { 'Authorization': `Bearer ${token}` } });
        
        if (!response.ok) throw new Error(`Error del servidor: ${response.status}`);
        
        const data = await response.json();
        setDonaciones(data.donaciones || []);
      } catch (error) {
        console.error("Dashboard: Error al buscar donaciones cercanas:", error);
        setErrorDonaciones(error.message); 
        setDonaciones([]);
      } finally {
        setIsLoadingDonaciones(false);
      }
    };

    fetchDonacionesCercanas();
  }, [activeSearchLocation, donationCreationTimestamp, getToken]);

  return (
    <div className="py-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-4">Panel Principal</h1>
      <p className="text-gray-600 mb-8 text-sm italic">{mensajeUbicacion}</p>

      <div className="flex justify-center mb-6">
        <BotonPublicar />
      </div>
      
      <section className="mt-8">
        <h2 className="text-2xl font-semibold text-gray-800 mb-6">Donaciones Cercanas</h2>
        
        {isLoadingDonaciones && <p className="text-center py-4 text-primary">Buscando donaciones...</p>}
        
        {errorDonaciones && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded" role="alert">
            <strong className="font-bold">Error:</strong> {errorDonaciones}
          </div>
        )}

        {!isLoadingDonaciones && !errorDonaciones && donaciones.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {donaciones.map(d => (
              <CardDonacion key={d._id} donacion={d} />
            ))}
          </div>
        )}
        
        {!isLoadingDonaciones && !errorDonaciones && donaciones.length === 0 && activeSearchLocation && (
          <p className="text-gray-500 text-center py-4">No se encontraron donaciones en esta área.</p>
        )}
        
        {!activeSearchLocation && !isLoadingDonaciones && !isLoading && (
           <p className="text-gray-500 text-center py-4">Por favor, selecciona una ubicación para empezar.</p>
        )}
      </section>
    </div>
  );
};

export default DashboardPage;