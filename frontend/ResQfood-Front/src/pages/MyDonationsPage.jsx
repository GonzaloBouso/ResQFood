import React, { useState, useEffect, useCallback, useContext } from 'react';
import { useAuth } from '@clerk/clerk-react';
import { Link } from 'react-router-dom';
import { ProfileStatusContext } from '../context/ProfileStatusContext';
import API_BASE_URL from '../api/config';
import { ChevronDown, Loader2 } from 'lucide-react';

// --- Sub-componente para la lista de solicitudes (con lógica de Aceptar/Rechazar) ---
const SolicitudesList = ({ solicitudes, onAccept, onReject, isSubmitting }) => {
    const pendientes = solicitudes.filter(s => s.estado === 'PENDIENTE');

    if (pendientes.length === 0) {
        return <p className="text-xs text-gray-500 italic px-4 py-3 bg-gray-50">No hay nuevas solicitudes pendientes.</p>;
    }

    return (
        <div className="space-y-2 p-3 bg-gray-50 border-t">
            {pendientes.map(solicitud => (
                <div key={solicitud._id} className="flex justify-between items-center bg-white p-2 rounded border shadow-sm">
                    <div className="flex items-center gap-2">
                        <img src={solicitud.solicitanteId?.fotoDePerfilUrl || 'https://via.placeholder.com/150'} alt={solicitud.solicitanteId?.nombre} className="w-8 h-8 rounded-full object-cover" />
                        <span className="text-sm font-medium">{solicitud.solicitanteId?.nombre || 'Usuario Desconocido'}</span>
                    </div>
                    <div className="flex gap-2">
                        <button disabled={isSubmitting} onClick={() => onReject(solicitud._id)} className="px-2 py-1 text-xs text-red-700 bg-red-100 rounded hover:bg-red-200 disabled:opacity-50">Rechazar</button>
                        <button disabled={isSubmitting} onClick={() => onAccept(solicitud._id)} className="px-2 py-1 text-xs text-white bg-green-600 rounded hover:bg-green-700 disabled:opacity-50">Aceptar</button>
                    </div>
                </div>
            ))}
        </div>
    );
};

// --- Componente principal de la página ---
const MyDonationsPage = () => {
    const { getToken } = useAuth();
    const [donaciones, setDonaciones] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [expandedDonationId, setExpandedDonationId] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const fetchDonations = useCallback(async () => {
        setIsLoading(true);
        setError(null);
        try {
            const token = await getToken();
            // LA SOLUCIÓN: Hacemos una única llamada al nuevo endpoint inteligente
            const response = await fetch(`${API_BASE_URL}/api/donacion/mis-donaciones-activas`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (!response.ok) throw new Error('No se pudieron cargar tus donaciones.');
            const data = await response.json();
            console.log("Datos recibidos del backend:", JSON.stringify(data, null, 2));
            setDonaciones(data.donaciones);
        } catch (err) {
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    }, [getToken]);

    useEffect(() => {
        fetchDonations();
    }, [fetchDonations]);
    
    const handleAccept = async (solicitudId) => {
        setIsSubmitting(true);
        try {
            const token = await getToken();
            const horario = prompt("Por favor, sugiere un horario de entrega (ej: Mañana de 10 a 12hs):");
            if (!horario || horario.trim() === '') {
                setIsSubmitting(false);
                return;
            }

            await fetch(`${API_BASE_URL}/api/solicitud/${solicitudId}/aceptar`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
                body: JSON.stringify({ horarioSugerido: horario }),
            });
            fetchDonations(); // Refresca toda la lista para ver los cambios
        } catch (err) {
            alert("Error al aceptar la solicitud: " + err.message);
        } finally {
            setIsSubmitting(false);
        }
    };
    
    const handleReject = async (solicitudId) => {
        if (!window.confirm("¿Estás seguro de que quieres rechazar esta solicitud?")) return;
        setIsSubmitting(true);
        try {
            const token = await getToken();
            await fetch(`${API_BASE_URL}/api/solicitud/${solicitudId}/rechazar`, {
                method: 'POST',
                headers: { 'Authorization': `Bearer ${token}` },
            });
            fetchDonations();
        } catch (err) {
            alert("Error al rechazar la solicitud: " + err.message);
        } finally {
            setIsSubmitting(false);
        }
    };

    if (isLoading) return <div className="text-center py-20"><Loader2 className="animate-spin inline-block mr-2" /> Cargando tus donaciones...</div>;
    if (error) return <div className="text-center py-20 text-red-600">Error: {error}</div>;

    return (
        <div className="max-w-4xl mx-auto py-10">
            <h1 className="text-3xl font-bold mb-8">Gestionar Mis Donaciones Activas</h1>
            {donaciones.length > 0 ? (
                <div className="space-y-4">
                    {donaciones.map(donacion => (
                        <div key={donacion._id} className="border rounded-lg bg-white shadow-sm overflow-hidden">
                            <div className="p-4 flex justify-between items-center cursor-pointer" onClick={() => setExpandedDonationId(expandedDonationId === donacion._id ? null : donacion._id)}>
                                <div>
                                    <h3 className="font-semibold">{donacion.titulo}</h3>
                                    <p className="text-sm text-gray-500">{donacion.estadoPublicacion}</p>
                                </div>
                                <div className="flex items-center gap-1 text-sm text-primary font-medium">
                                    <span>Solicitudes ({donacion.solicitudes.filter(s => s.estado === 'PENDIENTE').length})</span>
                                    <ChevronDown className={`transition-transform ${expandedDonationId === donacion._id ? 'rotate-180' : ''}`} size={16} />
                                </div>
                            </div>
                            {expandedDonationId === donacion._id && (
                                <SolicitudesList 
                                    solicitudes={donacion.solicitudes}
                                    onAccept={handleAccept}
                                    onReject={handleReject}
                                    isSubmitting={isSubmitting}
                                />
                            )}
                        </div>
                    ))}
                </div>
            ) : (
                <div className="text-center py-10 border-2 border-dashed rounded-lg">
                    <p className="text-gray-600 mb-4">No tienes donaciones activas en este momento.</p>
                    <Link to="/publicar-donacion" className="inline-block bg-primary text-white font-bold py-2 px-4 rounded hover:bg-brandPrimaryDarker transition-colors">
                        ¡Publica tu primera donación!
                    </Link>
                </div>
            )}
        </div>
    );
};

export default MyDonationsPage;