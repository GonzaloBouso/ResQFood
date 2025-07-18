// src/pages/DashboardPage.jsx
import React, { useState, useEffect, useContext } from 'react';
import { Link } from "react-router-dom"; 
import CardDonacion from '../components/layout/CardDonacion.jsx';
import { useAuth } from '@clerk/clerk-react';
import { ProfileStatusContext } from '../context/ProfileStatusContext.js'; 
import BotonPublicar from '../components/layout/BotonPublicar.jsx';
import API_BASE_URL from '../api/config.js';

const DashboardPage = () => {
  const { getToken } = useAuth();
  const profileContext = useContext(ProfileStatusContext);
  
  const {
    userDataFromDB,
    isLoadingUserProfile = true,
    donationCreationTimestamp,
    activeSearchLocation,
    setActiveSearchLocation,
  } = profileContext || {};

  const [donaciones, setDonaciones] = useState([]);
  const [isLoadingDonaciones, setIsLoadingDonaciones] = useState(false);
  const [errorDonaciones, setErrorDonaciones] = useState(null);
  const [mensajeUbicacion, setMensajeUbicacion] = useState('Determinando tu ubicación...');

  useEffect(() => {
    if (isLoadingUserProfile || activeSearchLocation) return;
    
    let initialLocationSet = false;

    if (userDataFromDB?.ubicacion?.coordenadas?.coordinates?.length === 2) {
      const [lon, lat] = userDataFromDB.ubicacion.coordenadas.coordinates;
      if (lat !== 0 || lon !== 0) {
        setActiveSearchLocation({ lat, lng: lon, address: userDataFromDB.ubicacion.ciudad || 'Ubicación de tu perfil' });
        initialLocationSet = true;
      }
    }
    
    if (!initialLocationSet && navigator.geolocation && setActiveSearchLocation) {
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
    } else if (!initialLocationSet) {
      setMensajeUbicacion('Selecciona una ubicación para ver donaciones.');
    }
    
  }, [isLoadingUserProfile, userDataFromDB, activeSearchLocation, setActiveSearchLocation]);

  useEffect(() => {
    if (activeSearchLocation?.address) {
      setMensajeUbicacion(`Mostrando donaciones cerca de: ${activeSearchLocation.address}`);
    } else if (!isLoadingUserProfile) {
      setMensajeUbicacion('Selecciona una ubicación en el menú superior para ver donaciones.');
    }
  }, [activeSearchLocation, isLoadingUserProfile]);

  useEffect(() => {
    if (!activeSearchLocation || typeof activeSearchLocation.lat !== 'number' || typeof activeSearchLocation.lng !== 'number') {
      setDonaciones([]);
      return;
    }

    const fetchDonacionesCercanas = async () => {
      console.log(`Buscando donaciones cercanas a: Lat ${activeSearchLocation.lat}, Lon ${activeSearchLocation.lng}`);
      setIsLoadingDonaciones(true); 
      setErrorDonaciones(null);
      try {
        const token = await getToken();
        const { lat, lng } = activeSearchLocation;
        const distanciaMaxKm = 50;

        const apiUrl = `${API_BASE_URL}/donacion/cercanas?lat=${lat}&lon=${lng}&distanciaMaxKm=${distanciaMaxKm}`;
        
        const response = await fetch(apiUrl, { headers: { 'Authorization': `Bearer ${token}` } });
        
        if (!response.ok) throw new Error(`Error del servidor: ${response.status}`);
        
        const data = await response.json();
        setDonaciones(data.donaciones || []);
        console.log("Dashboard: Donaciones cercanas recibidas:", data.donaciones?.length);
      } catch (error) {
        console.error("Dashboard: Error al buscar donaciones cercanas:", error);
        setErrorDonaciones(error.message); 
        setDonaciones([]);
      } finally {
        setIsLoadingDonaciones(false);
      }
    };

    fetchDonacionesCercanas();
  }, [activeSearchLocation, getToken, donationCreationTimestamp]);


  return (
    <div className="py-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-4">Panel Principal</h1>
      <p className="text-gray-600 mb-8 text-sm italic">{mensajeUbicacion}</p>

      <div className="flex justify-center mb-6">
        <BotonPublicar></BotonPublicar>
      </div>
      
      <section className="mt-8">
        <h2 className="text-2xl font-semibold text-gray-800 mb-6">Donaciones Cercanas</h2>
        
        {isLoadingDonaciones && <p className="text-center py-4 text-primary">Buscando donaciones...</p>}
        
        {!isLoadingDonaciones && errorDonaciones && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded" role="alert">
            <strong className="font-bold">Error:</strong> {errorDonaciones}
          </div>
        )}

        {!isLoadingDonaciones && !errorDonaciones && donaciones.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {donaciones.map(d => (
              <CardDonacion key={d._id} donacion={d} onSolicitar={() => console.log("Solicitar:", d._id)} />
            ))}
          </div>
        )}
        
        {!isLoadingDonaciones && !errorDonaciones && donaciones.length === 0 && activeSearchLocation && (
          <p className="text-gray-500 text-center py-4">No se encontraron donaciones en esta área.</p>
        )}
        
        {!activeSearchLocation && !isLoadingDonaciones && !isLoadingUserProfile && (
           <p className="text-gray-500 text-center py-4">Por favor, selecciona una ubicación para empezar.</p>
        )}
      </section>
    </div>
  );
};

export default DashboardPage;