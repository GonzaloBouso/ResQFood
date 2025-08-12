import React, { useState, useEffect, useContext } from 'react';
import { useAuth } from '@clerk/clerk-react';
import { Link } from 'react-router-dom';
import { ProfileStatusContext } from '../context/ProfileStatusContext';
import API_BASE_URL from '../api/config';
import ListaDonaciones from '../components/donaciones/ListaDonaciones';

const MyDonationsPage = () => {
  const { getToken } = useAuth();
  const { currentUserDataFromDB, isLoadingUserProfile } = useContext(ProfileStatusContext);

  const [donacionesConSolicitudes, setDonacionesConSolicitudes] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (isLoadingUserProfile || !currentUserDataFromDB?._id) {
      if (!isLoadingUserProfile) setIsLoading(false);
      return;
    }

    const fetchDatos = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const token = await getToken();
        const userId = currentUserDataFromDB._id;
        
        const [donacionesRes, solicitudesRes] = await Promise.all([
          fetch(`${API_BASE_URL}/api/donacion/usuario/${userId}`, { headers: { 'Authorization': `Bearer ${token}` } }),
          fetch(`${API_BASE_URL}/api/solicitud/recibidas`, { headers: { 'Authorization': `Bearer ${token}` } })
        ]);

        if (!donacionesRes.ok) throw new Error('No se pudieron cargar tus donaciones.');
        if (!solicitudesRes.ok) throw new Error('No se pudieron cargar las solicitudes.');

        const donacionesData = await donacionesRes.json();
        const solicitudesData = await solicitudesRes.json();
        
        const donaciones = donacionesData.donaciones || [];
        const solicitudes = solicitudesData.solicitudes || [];
        
        const donacionesConDatos = donaciones.map(donacion => {
            const solicitudesParaEstaDonacion = solicitudes.filter(s => s.donacionId?._id === donacion._id);
            const solicitudAceptada = solicitudesParaEstaDonacion.find(s => s.estadoSolicitud === 'APROBADA_ESPERANDO_CONFIRMACION_HORARIO');
            
            return {
                ...donacion,
                solicitudes: solicitudesParaEstaDonacion.filter(s => s.estadoSolicitud === 'PENDIENTE_APROBACION'),
                solicitudAceptada: solicitudAceptada || null,
            };
        });

        setDonacionesConSolicitudes(donacionesConDatos);
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDatos();
  }, [currentUserDataFromDB, isLoadingUserProfile, getToken]);

  const renderContent = () => {
    if (isLoading || isLoadingUserProfile) {
      return <p className="text-center py-10 text-gray-500">Cargando tus donaciones...</p>;
    }

    if (error) {
      return <p className="text-center py-10 text-red-600"><strong>Error:</strong> {error}</p>;
    }

    if (donacionesConSolicitudes.length === 0) {
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

    return <ListaDonaciones donaciones={donacionesConSolicitudes} showManagement={true} />;
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Gestionar Mis Donaciones Activas</h1>
      {renderContent()}
    </div>
  );
};

export default MyDonationsPage;