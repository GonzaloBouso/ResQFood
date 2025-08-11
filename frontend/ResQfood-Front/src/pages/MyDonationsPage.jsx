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
      if (!isLoadingUserProfile) setIsLoading(false);
      return;
    }

    const fetchMisDonaciones = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const token = await getToken();
        const userId = currentUserDataFromDB._id;

        const res = await fetch(`${API_BASE_URL}/api/donacion/usuario/${userId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) throw new Error('No se pudieron cargar tus donaciones.');
        const data = await res.json();
        setDonaciones(data.donaciones || []);
      } catch (e) {
        setError(e.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchMisDonaciones();
  }, [currentUserDataFromDB, isLoadingUserProfile, getToken]);

  const handleEliminarDonacion = async (id) => {
    if (!window.confirm('¿Seguro que querés eliminar esta donación?')) return;
    try {
      const token = await getToken();
      const res = await fetch(`${API_BASE_URL}/api/donacion/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.message || 'No se pudo eliminar la donación.');
      }
      // Quitarla de la lista inmediatamente
      setDonaciones((prev) => prev.filter((d) => d._id !== id));
    } catch (e) {
      alert(e.message || 'Error al eliminar la donación.');
    }
  };

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
          <p className="text-gray-600 mb-4">No tenés donaciones activas.</p>
          <Link
            to="/publicar-donacion"
            className="inline-block bg-primary text-white font-bold py-2 px-4 rounded hover:bg-brandPrimaryDarker transition-colors"
          >
            ¡Publicá tu primera donación!
          </Link>
        </div>
      );
    }

    // Cards de ancho completo, separadas en vertical
    return (
      <div className="max-w-5xl mx-auto space-y-4 px-1 sm:px-2">
        <ListaDonaciones donaciones={donaciones} onEliminar={handleEliminarDonacion} />
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
