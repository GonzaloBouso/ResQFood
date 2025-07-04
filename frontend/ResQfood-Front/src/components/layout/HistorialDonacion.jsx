// src/components/layout/HistorialDonacion.jsx
import React, { useEffect, useState } from 'react';
import CardVerInformacion from './CardVerInformacion';
import API_BASE_URL from '../../api/config';

const HistorialDonacion = ({ userId }) => {
  const [donaciones, setDonaciones] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDonaciones = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/donacion/usuario/${userId}`);
        const data = await res.json();
        setDonaciones(data.donaciones || []);
      } catch (error) {
        console.error('Error al cargar donaciones:', error);
      } finally {
        setLoading(false);
      }
    };

    if (userId) {
      fetchDonaciones();
    }
  }, [userId]);

  if (loading) return <div className="text-center py-4">Cargando donaciones...</div>;

  if (donaciones.length === 0) {
    return <div className="text-center py-4 text-gray-600">No hay donaciones registradas.</div>;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {donaciones.map((donacion) => (
        <CardVerInformacion
          key={donacion._id}
          titulo={donacion.titulo}
          descripcion={donacion.descripcion}
          imagenUrl={donacion.imagenesUrl?.[0] || ''}
          estado={donacion.estadoPublicacion}
          fecha={donacion.createdAt}
        />
      ))}
    </div>
  );
};

export default HistorialDonacion;