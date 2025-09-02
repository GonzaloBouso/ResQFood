import React, { useEffect, useState } from 'react';
import API_BASE_URL from '../../api/config';
import { useAuth } from '@clerk/clerk-react';

const HistorialCard = ({ titulo, imagenUrl, fecha, receptor }) => (
    <div className="bg-white p-3 rounded-lg shadow-sm border flex items-center gap-4">
        <img src={imagenUrl} alt={titulo} className="w-16 h-16 object-cover rounded-md" />
        <div className="flex-1">
            <p className="font-semibold text-gray-800">{titulo}</p>
            {receptor && <p className="text-xs text-gray-500">Entregado a: {receptor}</p>}
            <p className="text-xs text-gray-400 mt-1">{new Date(fecha).toLocaleDateString()}</p>
        </div>
    </div>
);

const HistorialDonacion = () => {
    const [donaciones, setDonaciones] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { getToken } = useAuth();

    useEffect(() => {
        const fetchDonaciones = async () => {
            setLoading(true); setError(null);
            try {
                const token = await getToken();
               
                const res = await fetch(`${API_BASE_URL}/api/donacion/historial/hechas`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                if (!res.ok) throw new Error(`Error ${res.status}`);
                const data = await res.json();
                setDonaciones(data.donaciones || []);
            } catch (e) {
                setError(e.message);
            } finally {
                setLoading(false);
            }
        };
        fetchDonaciones();
    }, [getToken]);

    if (loading) return <div className="text-center py-4">Cargando historial...</div>;
    if (error) return <div className="text-center py-4 text-red-600">{error}</div>;
    if (donaciones.length === 0) return <div className="text-center py-4 text-gray-600">No hay donaciones finalizadas.</div>;

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {donaciones.map((d) => (
                <HistorialCard
                    key={d._id}
                    titulo={d.titulo}
                    imagenUrl={d.imagenesUrl?.[0] || ''}
                    fecha={d.updatedAt} 
                    receptor={d.solicitudes?.[0]?.solicitanteId?.nombre || 'Receptor'}
                />
            ))}
        </div>
    );
};

export default HistorialDonacion;