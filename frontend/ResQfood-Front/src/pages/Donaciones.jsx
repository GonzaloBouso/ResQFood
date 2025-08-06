import { useEffect, useState, useContext } from 'react';
import { useAuth } from '@clerk/clerk-react';
import ListaDonaciones from '../components/donaciones/ListaDonaciones';
import API_BASE_URL from '../api/config';
import { ProfileStatusContext } from '../context/ProfileStatusContext';

const Donaciones = () => {
  const { getToken } = useAuth();
  const { currentUserDataFromDB } = useContext(ProfileStatusContext);
  
  const [donaciones, setDonaciones] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDonaciones = async () => {
      if (!currentUserDataFromDB?._id) {
        setError('No se encontró el ID del usuario.');
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        setError(null);

        const token = await getToken();
        const res = await fetch(`${API_BASE_URL}/api/donacion/usuario/${currentUserDataFromDB._id}`, {
          headers: {
            Authorization: `Bearer ${token}`, // opcional pero recomendable
          },
        });

        if (!res.ok) {
          const data = await res.json();
          throw new Error(data.message || 'Error al obtener las donaciones');
        }

        const data = await res.json();

        // Filtrar solo las que estén DISPONIBLE o PENDIENTE-ENTREGA
        const activas = data.donaciones.filter(d =>
          ['DISPONIBLE', 'PENDIENTE-ENTREGA'].includes(d.estadoPublicacion)
        );

        setDonaciones(activas);
      } catch (err) {
        console.error('Error al obtener las donaciones:', err);
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDonaciones();
  }, [getToken, currentUserDataFromDB]);

  // 📦 Renderizado condicional
  if (isLoading) {
    return <div className="text-center py-20">Cargando tus donaciones...</div>;
  }

  if (error) {
    return <div className="text-center py-20 text-red-600"><strong>Error:</strong> {error}</div>;
  }

  if (donaciones.length === 0) {
    return <div className="text-center py-20 text-gray-600">No tenés donaciones activas.</div>;
  }

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Tus Donaciones</h2>
      <ListaDonaciones donaciones={donaciones} />
    </div>
  );
};

export default Donaciones;
