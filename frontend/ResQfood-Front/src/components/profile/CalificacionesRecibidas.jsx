import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@clerk/clerk-react';
import API_BASE_URL from '../../api/config';
import { Star } from 'lucide-react';

const CalificacionCard = ({ calificacion }) => {
    return (
        <div className="bg-white p-4 rounded-lg border shadow-sm">
            <div className="flex items-start gap-4">
                <img src={calificacion.calificadorId.fotoDePerfilUrl || 'https://via.placeholder.com/150'} alt={calificacion.calificadorId.nombre} className="w-12 h-12 rounded-full object-cover" />
                <div className="flex-grow">
                    <div className="flex justify-between items-center">
                        <p className="font-semibold text-gray-800">{calificacion.calificadorId.nombre}</p>
                        <span className="text-xs text-gray-500">{new Date(calificacion.createdAt).toLocaleDateString()}</span>
                    </div>
                    <div className="flex items-center my-1">
                        {[...Array(5)].map((_, i) => (
                            <Star key={i} size={16} className={i < calificacion.puntuacion ? 'text-yellow-400' : 'text-gray-300'} fill="currentColor" />
                        ))}
                    </div>
                    {calificacion.comentario && <p className="text-sm text-gray-600 italic">"{calificacion.comentario}"</p>}
                </div>
            </div>
        </div>
    );
};

const CalificacionesRecibidas = ({ userId }) => {
    const { getToken } = useAuth();
    const [calificaciones, setCalificaciones] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchCalificaciones = useCallback(async () => {
        if (!userId) return;
        setIsLoading(true);
        try {
            const token = await getToken();
            const response = await fetch(`${API_BASE_URL}/api/calificacion/recibidas/${userId}`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (!response.ok) throw new Error('No se pudieron cargar las calificaciones.');
            const data = await response.json();
            setCalificaciones(data.calificaciones);
        } catch (err) {
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    }, [userId, getToken]);

    useEffect(() => {
        fetchCalificaciones();
    }, [fetchCalificaciones]);

    if (isLoading) return <p className="text-center py-8">Cargando calificaciones...</p>;
    if (error) return <p className="text-center py-8 text-red-500">{error}</p>;

    return (
        <div className="space-y-4">
            {calificaciones.length > 0 ? (
                calificaciones.map(cal => <CalificacionCard key={cal._id} calificacion={cal} />)
            ) : (
                <p className="text-center py-8 text-gray-500">Aún no has recibido ninguna calificación.</p>
            )}
        </div>
    );
};

export default CalificacionesRecibidas;