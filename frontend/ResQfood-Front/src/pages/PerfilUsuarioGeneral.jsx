import React, { useState } from 'react';
import { Link, useParams } from 'react-router-dom'; 
import { useAuth } from '@clerk/clerk-react'; // 
import HistorialDonacion from '../components/layout/HistorialDonacion';
import HistorialRecepcion from '../components/layout/HistorialRecepcion';
import BotonPublicar from '../components/layout/BotonPublicar'
import API_BASE_URL from '../api/config.js'; 

// Componente interno para mostrar la información del usuario de forma dinámica
const InfoUsuarioGeneralDinamico = ({ userData }) => {
  if (!userData) return <p className="text-center text-gray-600 py-4">Cargando información del usuario...</p>;

  return (
    <div className="space-y-6">
      <section className="border rounded-lg p-6 bg-white shadow">
        <h2 className="text-xl font-semibold text-gray-800 mb-3">Información Básica</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-2 text-sm text-gray-700">
          <p><strong>Nombre:</strong> {userData.nombre || 'No disponible'}</p>
          {/* Si tienes más campos como fecha de nacimiento, género, etc., agrégalos aquí */}
          {/* <p><strong>Fecha de Nacimiento:</strong> {userData.fechaNacimiento ? new Date(userData.fechaNacimiento).toLocaleDateString() : 'No disponible'}</p> */}
        </div>
      </section>

      <section className="border rounded-lg p-6 bg-white shadow">
        <h2 className="text-xl font-semibold text-gray-800 mb-3">Información de Contacto</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-2 text-sm text-gray-700">
          <p><strong>Correo Electrónico:</strong> {userData.email || 'No disponible'}</p>
          <p><strong>Teléfono:</strong> {userData.telefono || 'No especificado'}</p>
        </div>
      </section>

      {userData.ubicacion && (
        <section className="border rounded-lg p-6 bg-white shadow">
          <h2 className="text-xl font-semibold text-gray-800 mb-3">Ubicación</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-2 text-sm text-gray-700">
            <p><strong>Dirección:</strong> {userData.ubicacion.direccion || 'No disponible'}</p>
            <p><strong>Ciudad:</strong> {userData.ubicacion.ciudad || 'No disponible'}</p>
            <p><strong>Provincia:</strong> {userData.ubicacion.provincia || 'No disponible'}</p>
            <p><strong>País:</strong> {userData.ubicacion.pais || 'No disponible'}</p>
          </div>
        </section>
      )}

      {userData.estadisticasGenerales && (
        <section className="border rounded-lg p-6 bg-white shadow">
          <h2 className="text-xl font-semibold text-gray-800 mb-3">Actividad en ResQFood</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-2 text-sm text-gray-700">
            <p><strong>Donaciones Realizadas:</strong> {userData.estadisticasGenerales.totalDonacionesHechas ?? 0}</p>
            <p><strong>Donaciones Recibidas:</strong> {userData.estadisticasGenerales.totalDonacionesRecibidas ?? 0}</p>
            <p><strong>Calificación como Donante:</strong> {userData.estadisticasGenerales.calificacionPromedioComoDonante ? `${userData.estadisticasGenerales.calificacionPromedioComoDonante.toFixed(1)} ★` : 'Sin calificaciones'}</p>
            <p><strong>Calificación como Receptor:</strong> {userData.estadisticasGenerales.calificacionPromedioComoReceptor ? `${userData.estadisticasGenerales.calificacionPromedioComoReceptor.toFixed(1)} ★` : 'Sin calificaciones'}</p>
          </div>
        </section>
      )}
    </div>
  );
};

const PerfilUsuarioGeneral = () => {
  const { userId } = useParams(); // <<< 4. Lee el ID del usuario de la URL
  const { getToken } = useAuth(); // <<< 5. Obtiene la función para el token

  // <<< 6. Creamos estados para manejar la carga, los datos y los errores >>>
  const [userData, setUserData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const [activeTab, setActiveTab] = useState('info');

  // <<< 7. Usamos useEffect para buscar los datos del usuario cuando el componente se monta >>>
  useEffect(() => {
    const fetchUserProfile = async () => {
      if (!userId) {
        setError("No se proporcionó un ID de usuario.");
        setIsLoading(false);
        return;
      }
      
      setIsLoading(true);
      setError(null);

      try {
        const token = await getToken();
        const response = await fetch(`${API_BASE_URL}/api/usuario/${userId}`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || `Error ${response.status}`);
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
  }, [userId, getToken]); // Se ejecuta de nuevo si el ID o el token cambian

  const renderTabContent = () => {
    // ... tu código de renderTabContent (sin cambios)
  };

  // <<< 8. Manejamos los estados de carga y error antes de renderizar el perfil >>>
  if (isLoading) {
    return <div className="text-center py-20">Cargando perfil del usuario...</div>;
  }

  if (error) {
    return <div className="text-center py-20 text-red-600">Error: {error}</div>;
  }

  if (!userData) {
    return <div className="text-center py-20">No se encontró la información del usuario.</div>;
  }

  // Si todo está bien, renderizamos tu JSX original, que ahora recibe los datos del estado
  return (
    <div className="max-w-4xl mx-auto py-10 px-4 sm:px-6 lg:px-8">
      {/* ... Tu JSX original para mostrar el perfil ... */}
      {/* La única diferencia es que ahora 'userData' viene del estado 'useState' */}
      {/* que hemos llenado con la llamada a la API. */}
    </div>
  );
};

export default PerfilUsuarioGeneral;