import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@clerk/clerk-react';
import { Link } from 'react-router-dom';
import API_BASE_URL from '../api/config';
import { ChevronDown, Loader2, Clock, CheckCircle } from 'lucide-react';
import ProposeScheduleModal from '../components/solicitudes/ProposeScheduleModal';

const ConfirmarEntregaForm = ({ entregaId, onConfirm, isSubmitting }) => {
    const [codigo, setCodigo] = useState('');
    const handleSubmit = (e) => {
        e.preventDefault();
        onConfirm(entregaId, codigo);
    };
    return (
        <form onSubmit={handleSubmit} className="p-3 bg-blue-50 border-t flex items-center gap-2">
            <input type="text" value={codigo} onChange={(e) => setCodigo(e.target.value.toUpperCase())} placeholder="Ingresar código del receptor" className="flex-grow p-1 border rounded text-sm" maxLength="6" required />
            <button type="submit" disabled={isSubmitting} className="px-3 py-1 text-xs text-white bg-blue-600 rounded hover:bg-blue-700 disabled:opacity-50">Confirmar</button>
        </form>
    );
};

const SolicitudesList = ({ solicitudes, onAcceptClick, onReject, isSubmitting }) => {
    const pendientes = solicitudes.filter(s => s.estadoSolicitud === 'PENDIENTE_APROBACION');
    if (pendientes.length === 0) return <p className="text-xs text-gray-500 italic px-4 py-3 bg-gray-50 border-t">No hay nuevas solicitudes pendientes.</p>;
    return (
        <div className="space-y-2 p-3 bg-gray-50 border-t">
            {pendientes.map(solicitud => (
                <div key={solicitud._id} className="flex justify-between items-center bg-white p-2 rounded border shadow-sm">
                    <div className="flex items-center gap-2">
                        <img src={solicitud.solicitanteId?.fotoDePerfilUrl} alt={solicitud.solicitanteId?.nombre} className="w-8 h-8 rounded-full object-cover" />
                        <span className="text-sm font-medium">{solicitud.solicitanteId?.nombre}</span>
                    </div>
                    <div className="flex gap-2">
                        <button disabled={isSubmitting} onClick={() => onReject(solicitud._id)} className="px-2 py-1 text-xs text-red-700 bg-red-100 rounded hover:bg-red-200">Rechazar</button>
                        

                        <button disabled={isSubmitting} onClick={() => onAcceptClick(solicitud)} className="px-2 py-1 text-xs text-white bg-green-600 rounded hover:bg-green-700">Aceptar</button>
                    </div>
                </div>
            ))}
        </div>
    );
};

const MyDonationsPage = () => {
    const { getToken } = useAuth();
    const [donaciones, setDonaciones] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [expandedDonationId, setExpandedDonationId] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [solicitudParaAceptar, setSolicitudParaAceptar] = useState(null);

    const fetchDonations = useCallback(async () => {
        setIsLoading(true);
        setError(null);
        try {
            const token = await getToken();
            
              const response = await fetch(`${API_BASE_URL}/api/donacion/mis-donaciones-activas`, { 
                headers: { 'Authorization': `Bearer ${token}` } 
            });
            
            if (!response.ok) throw new Error('No se pudieron cargar tus donaciones.');
            const data = await response.json();
            setDonaciones(data.donaciones);
        } catch (err) { setError(err.message); } finally { setIsLoading(false); }
    }, [getToken]);

    useEffect(() => { fetchDonations(); }, [fetchDonations]);

    const handleAcceptAndPropose = async (solicitudId, propuesta) => {
        setIsSubmitting(true);
        try {
            const token = await getToken();
            const response = await fetch(`${API_BASE_URL}/api/solicitud/${solicitudId}/aceptar-y-proponer`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
                body: JSON.stringify(propuesta),
            });
            
            if (!response.ok) {
                let errorPayload;
                try {
                    errorPayload = await response.json();
                } catch (e) {
                    const textError = await response.text();
                    throw new Error(`El servidor respondió con un error ${response.status}. Respuesta: ${textError || 'Sin cuerpo de respuesta'}`);
                }
                throw new Error(errorPayload.message || 'Ocurrió un error desconocido.');
            }

            setSolicitudParaAceptar(null);
            fetchDonations();
        } catch (err) { 
            console.error("Error completo al aceptar la solicitud:", err);
            alert("Error al aceptar la solicitud: " + err.message); 
        } finally { 
            setIsSubmitting(false); 
        }
    };
    
    const handleReject = async (solicitudId) => {
        if (!window.confirm("¿Estás seguro de que deseas rechazar esta solicitud?")) return;
        setIsSubmitting(true);
        try {
            const token = await getToken();
            const response = await fetch(`${API_BASE_URL}/api/solicitud/${solicitudId}/rechazar`, { 
                method: 'POST', 
                headers: { 'Authorization': `Bearer ${token}` } 
            });

            if (!response.ok) {
                 const errorData = await response.json().catch(() => ({ message: 'No se pudo procesar la respuesta del servidor.' }));
                 throw new Error(errorData.message || 'Falló el rechazo de la solicitud.');
            }
            
            fetchDonations();
        } catch (err) { 
            alert("Error al rechazar: " + err.message); 
        } finally { 
            setIsSubmitting(false); 
        }
    };

    const handleCompleteDelivery = async (entregaId, codigo) => {
        setIsSubmitting(true);
        try {
            const token = await getToken();
            const response = await fetch(`${API_BASE_URL}/api/entrega/${entregaId}/completar`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
                body: JSON.stringify({ codigoConfirmacion: codigo }),
            });
            if (!response.ok) throw new Error((await response.json()).message);
            alert('¡Entrega completada!');
            fetchDonations();
        } catch (err) { alert('Error al confirmar: ' + err.message); } finally { setIsSubmitting(false); }
    };

    if (isLoading) return <div className="text-center py-20"><Loader2 className="animate-spin inline-block mr-2" /> Cargando...</div>;
    if (error) return <div className="text-center py-20 text-red-600"><strong>Error:</strong> {error}</div>;

    return (
        <div className="max-w-4xl mx-auto py-10 px-4">
            <h1 className="text-3xl font-bold text-gray-800 mb-8">Gestionar Mis Donaciones</h1>
            {donaciones.length > 0 ? (
                <div className="space-y-4">
                    {donaciones.map(donacion => {
                        const isExpanded = expandedDonationId === donacion._id;
                       
                        const solicitudConEntrega = donacion.solicitudes.find(s => s.entregaId);
                        const entregaActiva = solicitudConEntrega?.entregaId;

                        return (
                            <div key={donacion._id} className="border rounded-lg bg-white shadow-sm overflow-hidden">
                                <div className="p-4 flex justify-between items-center cursor-pointer" onClick={() => setExpandedDonationId(isExpanded ? null : donacion._id)}>
                                    <div>
                                        <h3 className="font-semibold text-gray-900">{donacion.titulo}</h3>
                                        <div className="text-sm text-gray-500">{donacion.estadoPublicacion}</div>
                                    </div>
                                    <ChevronDown className={`transition-transform ${isExpanded ? 'rotate-180' : ''}`} size={16} />
                                </div>
                                
                                {isExpanded && donacion.estadoPublicacion === 'DISPONIBLE' && (
                                    <SolicitudesList 
                                        solicitudes={donacion.solicitudes}
                                        onAcceptClick={setSolicitudParaAceptar} 
                                        onReject={handleReject}
                                        isSubmitting={isSubmitting}
                                    />
                                )}
                                
                                {isExpanded && entregaActiva && entregaActiva.estadoEntrega === 'LISTA_PARA_RETIRO' && (
                                    <ConfirmarEntregaForm 
                                        entregaId={entregaActiva._id} 
                                        onConfirm={handleCompleteDelivery} 
                                        isSubmitting={isSubmitting} 
                                    />
                                )}
                            </div>
                        );
                    })}
                </div>
            ) : (
                <div className="text-center py-10 border-2 border-dashed rounded-lg">
                    <p className="text-gray-600 mb-4">No tienes donaciones.</p>
                    <Link to="/publicar-donacion" className="inline-block bg-primary text-white font-bold py-2 px-4 rounded hover:bg-brandPrimaryDarker transition-colors">¡Publica una donación!</Link>
                </div>
            )}
            
           
            {solicitudParaAceptar && (
                <ProposeScheduleModal 
                    solicitud={solicitudParaAceptar} 
                    onClose={() => setSolicitudParaAceptar(null)}
                    onSubmit={handleAcceptAndPropose}
                    isSubmitting={isSubmitting}
                />
            )}
        </div>
    );
};

export default MyDonationsPage;