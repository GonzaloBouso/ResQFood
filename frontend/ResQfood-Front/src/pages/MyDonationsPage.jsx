import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@clerk/clerk-react';
import { Link } from 'react-router-dom';
import API_BASE_URL from '../api/config';
import { ChevronDown, Loader2, Clock, CheckCircle } from 'lucide-react';
import ProposeScheduleModal from '../components/ProposeScheduleModal';

// Componente para ingresar el código y confirmar la entrega
const ConfirmarEntregaForm = ({ entregaId, onConfirm, isSubmitting }) => {
    const [codigo, setCodigo] = useState('');
    const handleSubmit = (e) => {
        e.preventDefault();
        onConfirm(entregaId, codigo);
    };
    return (
        <form onSubmit={handleSubmit} className="p-3 bg-blue-50 border-t flex items-center gap-2">
            <input
                type="text"
                value={codigo}
                onChange={(e) => setCodigo(e.target.value.toUpperCase())}
                placeholder="Ingresar código del receptor"
                className="flex-grow p-1 border rounded text-sm"
                maxLength="6"
                required
            />
            <button type="submit" disabled={isSubmitting} className="px-3 py-1 text-xs text-white bg-blue-600 rounded hover:bg-blue-700 disabled:opacity-50">Confirmar</button>
        </form>
    );
};

// Componente para la lista de solicitudes PENDIENTES
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
                        <button disabled={isSubmitting} onClick={() => onReject(solicitud._id)} className="px-2 py-1 text-xs text-red-700 bg-red-100 rounded hover:bg-red-200 disabled:opacity-50">Rechazar</button>
                       
                        <button disabled={isSubmitting} onClick={() => onAcceptClick(solicitud)} className="px-2 py-1 text-xs text-white bg-green-600 rounded hover:bg-green-700 disabled:opacity-50">Aceptar</button>
                    </div>
                </div>
            ))}
        </div>
    );
};

// Componente principal
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
            
            const response = await fetch(`${API_BASE_URL}/api/donacion/mis-donaciones`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (!response.ok) throw new Error('No se pudieron cargar tus donaciones.');
            const data = await response.json();
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

    const handleAcceptAndPropose = async (solicitudId, propuesta) => {
        setIsSubmitting(true);
        try {
            const token = await getToken();
            const response = await fetch(`${API_BASE_URL}/api/solicitud/${solicitudId}/aceptar-y-proponer`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
                body: JSON.stringify(propuesta),
            });
            if (!response.ok) throw new Error((await response.json()).message);
            setSolicitudParaAceptar(null);
            fetchDonations();
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
            alert('¡Entrega completada exitosamente!');
            fetchDonations();
        } catch (err) {
            alert('Error al confirmar la entrega: ' + err.message);
        } finally {
            setIsSubmitting(false);
        }
    };

    if (isLoading) return <div className="text-center py-20"><Loader2 className="animate-spin inline-block mr-2" /> Cargando tus donaciones...</div>;
    if (error) return <div className="text-center py-20 text-red-600"><strong>Error:</strong> {error}</div>;

    const renderDonationStatus = (donacion) => {
        switch (donacion.estadoPublicacion) {
            case 'DISPONIBLE':
                const pendientes = donacion.solicitudes.filter(s => s.estadoSolicitud === 'PENDIENTE_APROBACION').length;
                return <span className="text-sm text-green-600">{pendientes} solicitudes pendientes</span>;
            case 'PENDIENTE-ENTREGA':
                return <div className="flex items-center gap-1 text-sm text-blue-600"><Clock size={14}/> Esperando entrega</div>;
            case 'ENTREGADA':
                return <div className="flex items-center gap-1 text-sm text-gray-500"><CheckCircle size={14}/> Completada</div>;
            default:
                return <p className="text-sm text-gray-500">{donacion.estadoPublicacion}</p>;
        }
    };

    return (
        <div className="max-w-4xl mx-auto py-10 px-4">
            <h1 className="text-3xl font-bold text-gray-800 mb-8">Gestionar Mis Donaciones</h1>
            {donaciones.length > 0 ? (
                <div className="space-y-4">
                    {donaciones.map(donacion => {
                       
                        const isExpanded = expandedDonationId === donacion._id;
                        const solicitudActiva = donacion.solicitudes.find(s => s.entregaId);
                        const entregaActiva = solicitudActiva?.entregaId;

                        return (
                            <div key={donacion._id} className="border rounded-lg bg-white shadow-sm overflow-hidden">
                                <div className="p-4 flex justify-between items-center cursor-pointer" onClick={() => setExpandedDonationId(isExpanded ? null : donacion._id)}>
                                    <div>
                                        <h3 className="font-semibold text-gray-900">{donacion.titulo}</h3>
                                        {renderDonationStatus(donacion)}
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
                    <p className="text-gray-600 mb-4">No tienes donaciones en este momento.</p>
                    <Link to="/publicar-donacion" className="inline-block bg-primary text-white font-bold py-2 px-4 rounded hover:bg-brandPrimaryDarker transition-colors">
                        ¡Publica una donación!
                    </Link>
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