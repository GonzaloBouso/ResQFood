import React, { useState, useEffect, useCallback, useContext } from 'react';
import { useAuth } from '@clerk/clerk-react';
import { Link } from 'react-router-dom';
import API_BASE_URL from '../api/config';
import { Loader2, Gift } from 'lucide-react';
import { ProfileStatusContext } from '../context/ProfileStatusContext';

const MyRequestsPage = () => {
    const { getToken } = useAuth();
    const { currentUserDataFromDB } = useContext(ProfileStatusContext);
    const [solicitudes, setSolicitudes] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    
    const fetchSolicitudes = useCallback(async () => {
        try {
            const token = await getToken();
            const response = await fetch(`${API_BASE_URL}/api/solicitud/mis-solicitudes`, { headers: { 'Authorization': `Bearer ${token}` } });
            if (!response.ok) throw new Error('Error al cargar tus solicitudes.');
            const data = await response.json();
            setSolicitudes(data.solicitudes || []);
        } catch (err) { 
            setError(err.message); 
        } finally { 
            setIsLoading(false); 
        }
    }, [getToken]);

    useEffect(() => {
        setIsLoading(true);
        fetchSolicitudes();
    }, [fetchSolicitudes]);

    // Guarda de renderizado para prevenir la "race condition"
    if (!currentUserDataFromDB) {
        return <div className="text-center py-20">Cargando datos de usuario...</div>;
    }
    
    if (isLoading) return <div className="text-center py-20"><Loader2 className="animate-spin inline-block mr-2" /> Cargando...</div>;
    if (error) return <div className="text-center py-20 text-red-600"><strong>Error:</strong> {error}</div>;

    return (
        <div className="max-w-4xl mx-auto py-10 px-4">
            <h1 className="text-3xl font-bold text-gray-800 mb-8">Mis Solicitudes</h1>
            {solicitudes && solicitudes.length > 0 ? (
                <div className="space-y-4">
                    {/* --- RENDERIZADO EXTREMADAMENTE SIMPLE PARA DEPURACIÓN --- */}
                    {solicitudes.map(solicitud => (
                        <div key={solicitud?._id} className="border rounded-lg bg-white shadow-sm p-4">
                            <h3 className="font-semibold text-gray-900">
                                {solicitud?.donacionId?.titulo || "Donación sin título"}
                            </h3>
                            <p className="text-sm text-gray-600">
                                Estado: {solicitud?.estadoSolicitud || "Desconocido"}
                            </p>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="text-center py-10 border-2 border-dashed rounded-lg">
                    <p className="text-gray-600 mb-4">Aún no has realizado ninguna solicitud.</p>
                    <Link to="/dashboard" className="inline-block bg-primary text-white font-bold py-2 px-4 rounded hover:bg-brandPrimaryDarker">
                        <Gift className="inline-block mr-2" size={16} /> Ver donaciones
                    </Link>
                </div>
            )}
        </div>
    );
};

export default MyRequestsPage;