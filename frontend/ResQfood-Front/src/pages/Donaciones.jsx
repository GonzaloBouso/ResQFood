import { useEffect, useState, useContext } from 'react';
import { useAuth } from '@clerk/clerk-react';
import ListaDonaciones from '../components/donaciones/ListaDonaciones';
import API_BASE_URL from '../api/config';
import { ProfileStatusContext } from '../context/ProfileStatusContext';

const Donaciones = () => {
  const [donaciones, setDonaciones] = useState([]);
  const { getToken } = useAuth();
  const { currentClerkUserId } = useContext(ProfileStatusContext);

  useEffect(() => {
    const fetchDonaciones = async () => {
      try {
        const token = await getToken();
        const response = await fetch(`${API_BASE_URL}/api/donacion/mis-donaciones`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) throw new Error('Error al obtener las donaciones');

        const data = await response.json();

        // Filtrar estados desde frontend (alternativamente, podrías hacerlo desde el backend)
        const donacionesFiltradas = data.donaciones.filter((d) =>
          ['DISPONIBLE', 'PENDIENTE-ENTREGA'].includes(d.estadoPublicacion)
        );

        setDonaciones(donacionesFiltradas);
      } catch (error) {
        console.error('Error al obtener las donaciones:', error);
      }
    };

    fetchDonaciones();
  }, [getToken, currentClerkUserId]);

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Tus Donaciones</h2>
      <ListaDonaciones donaciones={donaciones} />
    </div>
  );
};

export default Donaciones;