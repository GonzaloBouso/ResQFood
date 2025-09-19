import React, { useState, useEffect, useCallback, useContext } from 'react';
import { useAuth } from '@clerk/clerk-react';
import { Link } from 'react-router-dom';
import API_BASE_URL from '../api/config';
import ProposeScheduleModal from '../components/ProposeScheduleModal';
import toast from 'react-hot-toast'; 
import { ProfileStatusContext } from '../context/ProfileStatusContext';

const SolicitudesList = ({ solicitudes, onAcceptClick, onReject, isSubmitting }) => {
    const pendientes = (solicitudes || []).filter(s => s && s.estadoSolicitud === 'PENDIENTE_APROBACION');
    
    if (pendientes.length === 0) {
        const rechazoReciente = (solicitudes || []).find(s => s && s.estadoSolicitud === 'CANCELADA_RECEPTOR' && s.entregaId);
        if (rechazoReciente) {
            return (
                <div className="p-3 bg-red-50 border-t text-red-700 text-xs flex items-center gap-2">
                    <span>❌</span>
                    <span>El horario propuesto a <strong>{rechazoReciente.solicitanteId?.nombre}</strong> fue rechazado. La donación vuelve a estar disponible.</span>
                </div>
            );
        }
        return <p className="text-xs text-gray-500 italic px-4 py-3 bg-gray-50 border-t">No hay nuevas solicitudes pendientes.</p>;
    }

    return (
        <div className="space-y-2 p-3 bg-gray-50 border-t">
            {pendientes.map(solicitud => (
                <div key={solicitud?._id} className="flex justify-between items-center bg-white p-2 rounded border shadow-sm">
                    <div className="flex items-center gap-2">
                        <img src={solicitud?.solicitanteId?.fotoDePerfilUrl} alt={solicitud?.solicitanteId?.nombre} className="w-8 h-8 rounded-full object-cover" />
                        <span className="text-sm font-medium">{solicitud?.solicitanteId?.nombre || 'Usuario Desconocido'}</span>
                    </div>
                    <div className="flex gap-2">
                        <button disabled={isSubmitting} onClick={() => onReject(solicitud)} className="px-2 py-1 text-xs text-red-700 bg-red-100 rounded hover:bg-red-200 disabled:opacity-50">Rechazar</button>
                        <button disabled={isSubmitting} onClick={() => onAcceptClick(solicitud)} className="px-2 py-1 text-xs text-white bg-green-600 rounded hover:bg-green-700 disabled:opacity-50">Aceptar</button>
                    </div>
                </div>
            ))}
        </div>
    );
};

const ConfirmarEntregaForm = ({ onConfirm, isSubmitting }) => {
    const [codigo, setCodigo] = useState('');
    const handleSubmit = (e) => { e.preventDefault(); onConfirm(codigo); };
    return (
        <form onSubmit={handleSubmit} className="p-3 bg-blue-50 border-t flex items-center gap-2">
            <input type="text" value={codigo} onChange={(e) => setCodigo(e.target.value.toUpperCase())} placeholder="Ingresar código del receptor" className="flex-grow p-1 border rounded text-sm uppercase tracking-wider" maxLength="6" required />
            <button type="submit" disabled={isSubmitting} className="px-3 py-1 text-xs text-white bg-blue-600 rounded hover:bg-blue-700 disabled:opacity-50">{isSubmitting ? 'Confirmando...' : 'Confirmar'}</button>
        </form>
    );
};

const MyDonationsPage = () => {
    const { getToken } = useAuth();
    const { setNotifications, currentUserDataFromDB } = useContext(ProfileStatusContext);

    const [donaciones, setDonaciones] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [expandedDonationId, setExpandedDonationId] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [solicitudParaAceptar, setSolicitudParaAceptar] = useState(null);

    const fetchDonations = useCallback(async () => {
        setIsLoading(true); setError(null);
        try {
            const token = await getToken();
            const response = await fetch(`${API_BASE_URL}/api/donacion/mis-donaciones-activas`, { headers: { 'Authorization': `Bearer ${token}` } });
            if (!response.ok) throw new Error('No se pudieron cargar tus donaciones.');
            const data = await response.json();
            setDonaciones(data.donaciones || []);
        } catch (err) { setError(err.message); } finally { setIsLoading(false); }
    }, [getToken]);

    useEffect(() => { fetchDonations(); }, [fetchDonations]);

    const handleAcceptAndPropose = async (solicitudId, propuesta) => {
        setIsSubmitting(true);
        try {
            const token = await getToken();
            const response = await fetch(`${API_BASE_URL}/api/solicitud/${solicitudId}/aceptar-y-proponer`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
                body: JSON.stringify(propuesta),
            });
            if (!response.ok) {
                const errorPayload = await response.json().catch(() => ({ message: 'Error desconocido' }));
                throw new Error(errorPayload.message);
            }
            console.log('¡Propuesta enviada!');
            
            if (setNotifications) {
                setNotifications(prev => prev.map(n => (n.referenciaId === solicitudId && n.tipoNotificacion === 'SOLICITUD') ? { ...n, leida: true } : n));
            }

            setSolicitudParaAceptar(null);
            fetchDonations();
        } catch (err) {
            alert(`Error: ${err.message}`);
        } finally {
            setIsSubmitting(false);
        }
    };

    const executeReject = async (solicitudId) => {
        setIsSubmitting(true);
        try {
            const token = await getToken();
            const response = await fetch(`${API_BASE_URL}/api/solicitud/${solicitudId}/rechazar`, {
                method: 'POST',
                headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
                body: JSON.stringify({})
            });
            if (!response.ok) {
                const errorData = await response.json().catch(() => ({ message: 'No se pudo procesar la respuesta.' }));
                throw new Error(errorData.message || 'Falló el rechazo de la solicitud.');
            }
            console.log('Solicitud rechazada.');
            fetchDonations();
        } catch (err) {
            alert(`Error: ${err.message}`);
        } finally {
            setIsSubmitting(false);
        }
    };
    
    const handleReject = (solicitud) => {
        if (window.confirm(`¿Rechazar la solicitud de ${solicitud?.solicitanteId?.nombre}?`)) {
            executeReject(solicitud?._id);
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
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message);
            }
            console.log('¡Entrega completada con éxito!');
            fetchDonations();
        } catch (err) {
            alert(`Error: ${err.message}`);
        } finally {
            setIsSubmitting(false);
        }
    };

    if (!currentUserDataFromDB) {
        return <div className="text-center py-20">Cargando datos de usuario...</div>;
    }

    if (isLoading) return <div className="text-center py-20"><span>Cargando...</span></div>;
    if (error) return <div className="text-center py-20 text-red-600"><strong>Error:</strong> {error}</div>;

    return (
        <div className="max-w-4xl mx-auto py-10 px-4">
            <h1 className="text-3xl font-bold text-gray-800 mb-8">Gestionar Mis Donaciones</h1>
            {donaciones && donaciones.length > 0 ? (
                <div className="space-y-4">
                    {donaciones.filter(d => d).map(donacion => {
                        const solicitudes = donacion.solicitudes || [];
                        const isExpanded = expandedDonationId === donacion._id;
                        const solicitudAceptada = solicitudes.find(s => s?.entregaId && s?.estadoSolicitud !== 'CANCELADA_RECEPTOR');
                        const entregaActiva = solicitudAceptada?.entregaId;

                        return (
                            <div key={donacion._id} className="border rounded-lg bg-white shadow-sm overflow-hidden">
                                <div className="p-4 flex justify-between items-center cursor-pointer" onClick={() => setExpandedDonationId(isExpanded ? null : donacion._id)}>
                                    <div>
                                        <h3 className="font-semibold text-gray-900">{donacion.titulo}</h3>
                                        <div className={`text-xs font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full inline-block ${
                                            donacion.estadoPublicacion === 'DISPONIBLE' ? 'bg-green-100 text-green-800' :
                                            donacion.estadoPublicacion === 'PENDIENTE-ENTREGA' ? 'bg-blue-100 text-blue-800' :
                                            'bg-gray-100 text-gray-800'
                                        }`}>{donacion.estadoPublicacion?.replace('-', ' ')}</div>
                                    </div>
                                    <span className={`transition-transform inline-block ${isExpanded ? 'rotate-180' : ''}`}>▼</span>
                                </div>
                                
                                {isExpanded && (
                                    <div>
                                        {donacion.estadoPublicacion === 'DISPONIBLE' && (
                                            <SolicitudesList solicitudes={solicitudes} onAcceptClick={setSolicitudParaAceptar} onReject={handleReject} isSubmitting={isSubmitting} />
                                        )}
                                        
                                        {donacion.estadoPublicacion === 'PENDIENTE-ENTREGA' && entregaActiva && (
                                            <div className="p-4 bg-gray-50 border-t">
                                                <p className="font-semibold text-sm mb-2">Estado para: <span className="font-bold">{solicitudAceptada?.solicitanteId?.nombre}</span></p>
                                                
                                                {entregaActiva.estadoEntrega === 'PENDIENTE_CONFIRMACION_SOLICITANTE' && (
                                                    <div className="flex items-center gap-2 text-yellow-700 bg-yellow-100 p-2 rounded-md">
                                                        <span>🕒</span>
                                                        <span className="text-xs font-medium">Esperando confirmación...</span>
                                                    </div>
                                                )}

                                                {entregaActiva.estadoEntrega === 'LISTA_PARA_RETIRO' && (
                                                    <>
                                                        <div className="flex items-center gap-2 text-green-700 bg-green-100 p-2 rounded-md mb-3">
                                                            <span>✔️</span>
                                                            <span className="text-xs font-medium">¡Listo para el retiro!</span>
                                                        </div>
                                                        <ConfirmarEntregaForm onConfirm={(codigo) => handleCompleteDelivery(entregaActiva._id, codigo)} isSubmitting={isSubmitting} />
                                                    </>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            ) : (
                <div className="text-center py-10 border-2 border-dashed rounded-lg">
                    <p className="text-gray-600 mb-4">No tienes donaciones activas.</p>
                    <Link to="/publicar-donacion" className="inline-block bg-primary text-white font-bold py-2 px-4 rounded hover:bg-brandPrimaryDarker">¡Publica una donación!</Link>
                </div>
            )}
            
            {solicitudParaAceptar && (
                <ProposeScheduleModal solicitud={solicitudParaAceptar} onClose={() => setSolicitudParaAceptar(null)} onSubmit={handleAcceptAndPropose} isSubmitting={isSubmitting} />
            )}
        </div>
    );
};

export default MyDonationsPage;