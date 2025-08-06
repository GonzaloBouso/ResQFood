import { useEffect, useState, useContext } from 'react';
import { useAuth } from '@clerk/clerk-react';
import ListaDonaciones from '../components/donaciones/ListaDonaciones';
import API_BASE_URL from '../api/config';
import { ProfileStatusContext } from '../context/ProfileStatusContext';

const Donaciones = () => {
  const [donaciones, setDonaciones] = useState([]);
  const { getToken } = useAuth();
  const { currentClerkUserId } = useContext(ProfileStatusContext);

  // ✅ NUEVO: función para probar Clerk con endpoint debug
  const testClerkAuth = async () => {
    try {
      const token = await getToken();
      console.log("🔵 TOKEN PARA TEST:", token);

      const response = await fetch(`${API_BASE_URL}/debug/clerk`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();
      console.log("🧪 Resultado de Clerk Auth Test:", data);
    } catch (error) {
      console.error("❌ Error al probar Clerk:", error);
    }
  };

  useEffect(() => {
    const fetchDonaciones = async () => {
      try {
        const token = await getToken();
        console.log("🔵 TOKEN ENVIADO:", token);
        const response = await fetch(`${API_BASE_URL}/api/donacion/mis-donaciones`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) throw new Error('Error al obtener las donaciones');

        const data = await response.json();

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
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">Tus Donaciones</h2>
        {/* ✅ BOTÓN DE TESTEO */}
        <button
          onClick={testClerkAuth}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded text-sm transition"
        >
          Probar Clerk Auth
        </button>
      </div>

      <ListaDonaciones donaciones={donaciones} />
    </div>
  );
};

export default Donaciones;
