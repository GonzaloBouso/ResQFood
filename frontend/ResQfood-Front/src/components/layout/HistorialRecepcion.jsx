import React, { useEffect, useState } from 'react';
import API_BASE_URL from '../../api/config';
import { useAuth } from '@clerk/clerk-react';

const HistorialCard = ({ titulo, imagenUrl, fecha, donante }) => (
    <div className="bg-white p-3 rounded-lg shadow-sm border flex items-center gap-4">
        <img src={imagenUrl} alt={titulo} className="w-16 h-16 object-cover rounded-md" />
        <div className="flex-1">
            <p className="font-semibold text-gray-800">{titulo}</p>
            {donante && <p className="text-xs text-gray-500">Recibido de: {donante}</p>}
            <p className="text-xs text-gray-400 mt-1">{new Date(fecha).toLocaleDateString()}</p>
        </div>
    </div>
);

const HistorialRecepcion = () => {
    const [entregas, setEntregas] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { getToken } = useAuth();

    useEffect(() => {
        const fetchRecepciones = async () => {
            setLoading(true); setError(null);
            try {
                const token = await getToken();
                
                const res = await fetch(`${API_BASE_URL}/api/donacion/historial/recibidas`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                if (!res.ok) throw new Error(`Error ${res.status}`);
                const data = await res.json();
                setEntregas(data.entregas || []);
            } catch (e) {
                setError(e.message);
            } finally {
                setLoading(false);
            }
        };
        fetchRecepciones();
    }, [getToken]);

    if (loading) return <div className="text-center py-4">Cargando historial...</div>;
    if (error) return <div className="text-center py-4 text-red-600">{error}</div>;
    if (entregas.length === 0) return <div className="text-center py-4 text-gray-600">No hay donaciones recibidas.</div>;

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {entregas.map((entrega) => (
                <HistorialCard
                    key={entrega._id}
                    titulo={entrega.donacionId?.titulo}
                    imagenUrl={entrega.donacionId?.imagenesUrl?.[0] || ''}
                    fecha={entrega.updatedAt}
                    donante={entrega.donacionId?.donanteId?.nombre || 'Donante'}
                />
            ))}
        </div>
    );
};

export default HistorialRecepcion;