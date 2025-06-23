// src/pages/DashboardPage.jsx
import React, { useState, useEffect, useContext } from 'react';
import CardDonacion from '../components/layout/CardDonacion'; // Asegúrate que esta ruta sea correcta
import { useAuth } from '@clerk/clerk-react';
import { ProfileStatusContext } from '../context/ProfileStatusContext'; // Ajusta la ruta si es diferente

const DashboardPage = () => {
  const { getToken } = useAuth();
  const profileContext = useContext(ProfileStatusContext);
  
  const userDataFromDB = profileContext?.userDataFromDB;
  const isLoadingUserProfile = profileContext?.isLoadingUserProfile ?? true; // Default a true

  const [donaciones, setDonaciones] = useState([]);
  const [isLoadingDonaciones, setIsLoadingDonaciones] = useState(false);
  const [errorDonaciones, setErrorDonaciones] = useState(null);
  const [coordenadasParaFetch, setCoordenadasParaFetch] = useState(null);
  const [mensajeUbicacion, setMensajeUbicacion] = useState('Determinando tu ubicación para buscar donaciones...');

  // Efecto para determinar y establecer las coordenadas del usuario
  useEffect(() => {
    console.log("Dashboard Effect (Ubicación) - isLoadingUserProfile:", isLoadingUserProfile);
    if (isLoadingUserProfile) {
      console.log("Dashboard: Esperando a que cargue el perfil del usuario...");
      setMensajeUbicacion('Cargando tu perfil para obtener ubicación...');
      return;
    }

    console.log("Dashboard: Perfil de usuario cargado. userDataFromDB:", JSON.stringify(userDataFromDB, null, 2));
    let foundProfileCoords = false;

    if (userDataFromDB?.ubicacion?.coordenadas?.coordinates &&
        Array.isArray(userDataFromDB.ubicacion.coordenadas.coordinates) &&
        userDataFromDB.ubicacion.coordenadas.coordinates.length === 2) {
      
      const [lon, lat] = userDataFromDB.ubicacion.coordenadas.coordinates;
      // Validar que sean números y estén en rangos válidos (básico)
      if (typeof lat === 'number' && typeof lon === 'number' && 
          lat >= -90 && lat <= 90 && lon >= -180 && lon <= 180) {
          // Evitar usar [0,0] como coordenadas válidas si ese es tu placeholder para "sin coordenadas"
          if (!(lat === 0 && lon === 0 && !userDataFromDB.ubicacion.direccion)) { // No usar [0,0] si no hay dirección (asume que [0,0] es un placeholder)
            console.log(`Dashboard: Usando ubicación del perfil: Lat ${lat}, Lon ${lon}`);
            setCoordenadasParaFetch({ lat, lon });
            setMensajeUbicacion(`Mostrando donaciones cerca de: ${userDataFromDB.ubicacion.ciudad || userDataFromDB.ubicacion.direccion || 'tu ubicación guardada'}.`);
            foundProfileCoords = true;
          } else {
            console.log("Dashboard: Coordenadas del perfil son [0,0] (placeholder) o inválidas, intentando geolocalización.");
          }
      } else {
        console.warn("Dashboard: Coordenadas del perfil no son números válidos o están fuera de rango.");
      }
    } else {
      console.log("Dashboard: No se encontraron coordenadas válidas en el perfil del usuario.");
    }
    
    if (!foundProfileCoords) {
      if (navigator.geolocation) {
        console.log("Dashboard: Intentando geolocalización del navegador...");
        setMensajeUbicacion('Solicitando tu ubicación actual para mostrar donaciones cercanas...');
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const { latitude, longitude } = position.coords;
            console.log(`Dashboard: Geolocalización del navegador obtenida: Lat ${latitude}, Lon ${longitude}`);
            setCoordenadasParaFetch({ lat: latitude, lon: longitude });
            setMensajeUbicacion('Mostrando donaciones cerca de tu ubicación actual.');
          },
          (error) => {
            console.error("Dashboard: Error obteniendo geolocalización del navegador:", error);
            setMensajeUbicacion(`No se pudo obtener tu ubicación actual (${error.message}). Las donaciones mostradas pueden no ser cercanas.`);
            // OPCIONAL: Podrías no setear coordenadas o setear unas por defecto para toda la ciudad/país
            setCoordenadasParaFetch(null); // O unas coordenadas por defecto muy amplias
          },
          { enableHighAccuracy: false, timeout: 10000, maximumAge: 60000 } // maximumAge: 1 minuto
        );
      } else {
        console.log("Dashboard: Ni ubicación de perfil ni geolocalización del navegador disponible.");
        setMensajeUbicacion('No se pudo determinar tu ubicación. Configúrala en tu perfil o permite el acceso en tu navegador para ver donaciones cercanas.');
        setCoordenadasParaFetch(null);
      }
    }
  }, [userDataFromDB, isLoadingUserProfile]);


  // Efecto para hacer fetch de las donaciones cuando tengamos las coordenadasParaFetch
  useEffect(() => {
    if (!coordenadasParaFetch) {
      // Si no hay coordenadas, podrías decidir mostrar todas las donaciones o un mensaje.
      // Por ahora, si no hay coordenadas, no hacemos fetch de "cercanas".
      // Podrías tener otro fetch para donaciones generales aquí si lo deseas.
      console.log("Dashboard Fetch Donaciones: No hay coordenadas para fetch, no se buscarán donaciones cercanas.");
      setDonaciones([]); // Limpiar donaciones si no hay coordenadas
      // setMensajeUbicacion(prev => prev || "No se pueden buscar donaciones cercanas sin tu ubicación."); // Actualiza mensaje si es el inicial
      return;
    }
    if (isLoadingDonaciones) return; // Evitar múltiples fetches si ya está cargando

    const fetchDonacionesCercanas = async () => {
      console.log("Dashboard: Iniciando fetch de donaciones cercanas con coords:", coordenadasParaFetch);
      setIsLoadingDonaciones(true);
      setErrorDonaciones(null);
      try {
        const token = await getToken(); // Asumimos que este endpoint podría estar protegido
        const { lat, lon } = coordenadasParaFetch;
        const distanciaMaxKm = 20; 

        const apiUrl = `/donacion/cercanas?lat=${lat}&lon=${lon}&distanciaMaxKm=${distanciaMaxKm}`;
        console.log("Dashboard: Fetching URL:", apiUrl);

        const response = await fetch(apiUrl, { 
          headers: { 
            'Authorization': `Bearer ${token}` // Envíalo si tu endpoint lo requiere
          } 
        });
        
        console.log("Dashboard: Respuesta del fetch de donaciones, status:", response.status);
        if (!response.ok) {
          const errorText = await response.text().catch(() => `Error ${response.status}`); 
          console.error("Dashboard: Respuesta no OK del backend:", response.status, errorText);
          throw new Error(`Error al obtener donaciones: ${response.status} - ${errorText.substring(0,100)}`);
        }
        
        const data = await response.json();
        setDonaciones(data.donaciones || []);
        console.log("Dashboard: Donaciones cercanas recibidas:", data.donaciones);
        if ((data.donaciones || []).length === 0) {
            setMensajeUbicacion(prev => prev.includes("Mostrando donaciones") ? "No se encontraron donaciones en tu área actual. ¡Intenta más tarde!" : prev);
        }

      } catch (error) {
        console.error("Dashboard: Catch error fetching nearby donations:", error);
        setErrorDonaciones(error.message);
        setDonaciones([]);
      } finally {
        setIsLoadingDonaciones(false);
      }
    };

    fetchDonacionesCercanas();
  }, [coordenadasParaFetch, getToken]); // Quitado isLoadingDonaciones de aquí para evitar bucles si se setea mal

  // --- JSX para renderizar ---
  if (isLoadingUserProfile && !userDataFromDB) { // Muestra carga solo si realmente no tenemos datos del perfil aún
    return <div className="text-center py-10">Cargando tu información de perfil...</div>;
  }

  return (
    <div className="py-8">
      <h1 className="text-3xl font-bold text-textMain mb-4">Panel Principal</h1>
      <p className="text-textMuted mb-8 text-sm italic">{mensajeUbicacion}</p>
      
      <section className="mt-8">
        <h2 className="text-2xl font-semibold text-textMain mb-6">Donaciones Cercanas</h2>
        
        {isLoadingDonaciones && <p className="text-center py-4">Buscando donaciones cercanas...</p>}
        
        {!isLoadingDonaciones && errorDonaciones && (
          <p className="text-red-500 bg-red-100 p-3 rounded-md text-center">Error al cargar donaciones: {errorDonaciones}</p>
        )}

        {!isLoadingDonaciones && !errorDonaciones && donaciones.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {donaciones.map(donacion => (
              <CardDonacion key={donacion._id} donacion={donacion} />
            ))}
          </div>
        )}

        {/* Mensaje si no hay donaciones Y no hubo error Y no está cargando Y tenemos coordenadas para buscar */}
        {!isLoadingDonaciones && !errorDonaciones && donaciones.length === 0 && coordenadasParaFetch && (
          <p className="text-textMuted text-center py-4">No se encontraron donaciones cercanas en este momento.</p>
        )}

        {/* Mensaje si no tenemos coordenadas Y no está cargando el perfil ni las donaciones Y no hubo error de geolocalización */}
        {!isLoadingDonaciones && !errorDonaciones && !coordenadasParaFetch && !mensajeUbicacion.toLowerCase().includes("no se pudo") && (
           <p className="text-textMuted text-center py-4">Esperando tu ubicación para buscar donaciones...</p>
        )}
      </section>
    </div>
  );
};

export default DashboardPage;