import React, { useState, useEffect, useCallback, useContext } from 'react';
import { useAuth } from '@clerk/clerk-react';
import { Link } from 'react-router-dom';
import API_BASE_URL from '../api/config';
import { ProfileStatusContext } from '../context/ProfileStatusContext';

const MyRequestsPage = () => {
    const { getToken } = useAuth();
    const { currentUserDataFromDB } = useContext(ProfileStatusContext);
    
    // Se mantiene la gestión de estado simple
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

    // Guarda de renderizado
    if (!currentUserDataFromDB) {
        return <div className="text-center py-20">Cargando datos de usuario...</div>;
    }
    
    if (isLoading) return <div className="text-center py-20"><span>Cargando...</span></div>;
    if (error) return <div className="text-center py-20" style={{color: 'red'}}><strong>Error:</strong> {error}</div>;

    return (
        <div style={{ maxWidth: '40rem', margin: 'auto', padding: '2.5rem 1rem' }}>
            <h1 style={{ fontSize: '1.875rem', fontWeight: 'bold', marginBottom: '2rem' }}>Mis Solicitudes</h1>
            
            {solicitudes && solicitudes.length > 0 ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    {/* --- RENDERIZADO MÍNIMO --- */}
                    {solicitudes.map(solicitud => (
                        <div key={solicitud?._id} style={{ border: '1px solid #e5e7eb', borderRadius: '0.5rem', padding: '1rem' }}>
                            <h3 style={{ fontWeight: '600' }}>
                                {solicitud?.donacionId?.titulo || "Donación sin título"}
                            </h3>
                            <p style={{ fontSize: '0.875rem', color: '#4b5563' }}>
                                Estado: {solicitud?.estadoSolicitud || "Desconocido"}
                            </p>
                        </div>
                    ))}
                </div>
            ) : (
                <div style={{ textAlign: 'center', padding: '2.5rem 0', border: '2px dashed #e5e7eb', borderRadius: '0.5rem' }}>
                    <p style={{ color: '#4b5563', marginBottom: '1rem' }}>Aún no has realizado ninguna solicitud.</p>
                    <Link to="/dashboard" style={{ display: 'inline-block', backgroundColor: '#007bff', color: 'white', fontWeight: 'bold', padding: '0.5rem 1rem', borderRadius: '0.25rem' }}>
                        Ver donaciones
                    </Link>
                </div>
            )}
        </div>
    );
};

export default MyRequestsPage;