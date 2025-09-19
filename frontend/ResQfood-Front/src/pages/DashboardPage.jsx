import React, { useState, useEffect, useContext, useCallback } from 'react';
import { useAuth } from '@clerk/clerk-react';
import CardDonacion from '../components/layout/CardDonacion.jsx';
import WelcomeCard from '../components/layout/WelcomeCard.jsx'; 
import HeroSlider from '../components/home_unregistered/HeroSlider.jsx';

import { ProfileStatusContext } from '../context/ProfileStatusContext.js'; 
import API_BASE_URL from '../api/config.js';

const DashboardPage = () => {
  const { getToken } = useAuth();
  
  
  const { 
    isLoadingUserProfile, 
    currentUserDataFromDB, 
    activeSearchLocation, 
    setActiveSearchLocation,
    donationCreationTimestamp,
    filters 
  } = useContext(ProfileStatusContext);

  const [donaciones, setDonaciones] = useState([]);
  const [isLoadingDonaciones, setIsLoadingDonaciones] = useState(false);
  const [errorDonaciones, setErrorDonaciones] = useState(null);
  const [mensajeUbicacion, setMensajeUbicacion] = useState('Determinando tu ubicación...');

  
  useEffect(() => {
    if (isLoadingUserProfile || activeSearchLocation) return;
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
  }, [isLoadingUserProfile, currentUserDataFromDB, activeSearchLocation, setActiveSearchLocation]);

  // Efecto para actualizar el mensaje de ubicación 
  useEffect(() => {
    if (activeSearchLocation?.address) {
      setMensajeUbicacion(`Mostrando donaciones cerca de: ${activeSearchLocation.address}`);
    } else if (!isLoadingUserProfile) {
      setMensajeUbicacion('Selecciona una ubicación en el menú superior para ver donaciones.');
    }
  }, [activeSearchLocation, isLoadingUserProfile]);

  // --- FUNCIÓN DE FETCH PARA USAR  FILTROS GLOBALES ---
  const fetchDonacionesCercanas = useCallback(async () => {
    if (!activeSearchLocation?.lat || !activeSearchLocation?.lng) {
      setDonaciones([]);
      return;
    }

    setIsLoadingDonaciones(true); 
    setErrorDonaciones(null);
    try {
      const token = await getToken();
      const { lat, lng } = activeSearchLocation;
      
      // parámetros de la URL a partir del estado 'filters'
      const params = new URLSearchParams({
        lat: lat,
        lon: lng,
        distanciaMaxKm: 50 
      });

      if (filters.searchTerm) {
        params.append('q', filters.searchTerm);
      }
      if (filters.categories && filters.categories.length > 0) {
        params.append('categorias', filters.categories.join(','));
      }
      if (filters.dateRange === 'lastWeek') {
        params.append('rangoFecha', 'ultimaSemana');
      }

      //URL final con todos los parámetros
      const apiUrl = `${API_BASE_URL}/api/donacion/cercanas?${params.toString()}`;
      
      const response = await fetch(apiUrl, { headers: { 'Authorization': `Bearer ${token}` } });
      if (!response.ok) throw new Error(`Error del servidor: ${response.statusText}`);
      
      const data = await response.json();
      setDonaciones(data.donaciones || []);
    } catch (error) {
      console.error("Dashboard: Error al buscar donaciones cercanas:", error);
      setErrorDonaciones(error.message); 
      setDonaciones([]);
    } finally {
      setIsLoadingDonaciones(false);
    }
  
  }, [getToken, activeSearchLocation, filters]);

  
  useEffect(() => {
    fetchDonacionesCercanas();
  }, [fetchDonacionesCercanas, donationCreationTimestamp]);
  
  const userName = currentUserDataFromDB?.nombre?.split(' ')[0] || 'Usuario';

  if (isLoadingUserProfile) {
      return <div className="text-center py-20">Cargando tu dashboard...</div>
  }

  return (
    <div className="space-y-12 md:space-y-16">
      <section><HeroSlider /></section>
      <section><WelcomeCard userName={userName} /></section>
      <section id="donaciones-cercanas" className="scroll-mt-24">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-semibold text-gray-800">Donaciones Cercanas</h2>
          <p className="text-gray-600 text-sm italic hidden sm:block">{mensajeUbicacion}</p>
        </div>
        
        {isLoadingDonaciones && <p className="text-center py-10 text-primary">Buscando donaciones...</p>}
        {errorDonaciones && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded text-center" role="alert"><strong className="font-bold">Error:</strong> {errorDonaciones}</div>}
        
        {!isLoadingDonaciones && !errorDonaciones && donaciones.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {donaciones.map(d => <CardDonacion key={d._id} donacion={d} />)}
          </div>
        )}

        {!isLoadingDonaciones && !errorDonaciones && donaciones.length === 0 && (
          <div className="text-center py-12 bg-gray-50 rounded-lg">
            <p className="text-gray-500">{activeSearchLocation ? 'No se encontraron donaciones con los filtros aplicados.' : 'Por favor, selecciona una ubicación para empezar.'}</p>
          </div>
        )}
      </section>
    </div>
  );
};

export default DashboardPage;