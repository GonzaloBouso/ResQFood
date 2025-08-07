import React, { useEffect, useState } from 'react';
import CardVerInformacion from './CardVerInformacion';
import API_BASE_URL from '../../api/config';
import { useAuth } from '@clerk/clerk-react';

const HistorialDonacion = ({ userId }) => {
  const [donaciones, setDonaciones] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { getToken } = useAuth();

  useEffect(() => {
    const fetchDonaciones = async () => {
      setLoading(true); setError(null);
      try {
        const token = await getToken();
        const res = await fetch(`${API_BASE_URL}/api/donacion/usuario/${userId}/historial`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!res.ok) {
          const err = await res.json().catch(() => ({}));
          throw new Error(err.message || `Error ${res.status}`);
        }

        const data = await res.json();
        setDonaciones(data.donaciones || []);
      } catch (e) {
        setError(e.message);
      } finally {
        setLoading(false);
      }
    };

    if (userId) fetchDonaciones();
  }, [userId, getToken]);

  if (loading) return <div className="text-center py-4">Cargando donaciones...</div>;
  if (error) return <div className="text-center py-4 text-red-600">{error}</div>;
  if (donaciones.length === 0) return <div className="text-center py-4 text-gray-600">No hay donaciones finalizadas.</div>;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {donaciones.map((d) => (
        <CardVerInformacion
          key={d._id}
          titulo={d.titulo}
          descripcion={d.descripcion}
          imagenUrl={d.imagenesUrl?.[0] || ''}
          estado={d.estadoPublicacion}
          fecha={d.createdAt}
        />
      ))}
    </div>
  );
};

export default HistorialDonacion;
