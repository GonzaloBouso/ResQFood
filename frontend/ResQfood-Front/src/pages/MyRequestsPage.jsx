// pages/MyRequestsPage.jsx
import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@clerk/clerk-react';
import { Link } from 'react-router-dom';
import API_BASE_URL from '../api/config';
import { Loader2, CheckCircle, XCircle, Clock, Gift, Copy, ThumbsDown } from 'lucide-react';

const MyRequestsPage = () => {
    const { getToken } = useAuth();
    const [solicitudes, setSolicitudes] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    
    const fetchSolicitudes = useCallback(async () => {
        setIsLoading(true);
        try {
            const token = await getToken();
            const response = await fetch(`${API_BASE_URL}/api/solicitud/mis-solicitudes`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (!response.ok) throw new Error('Error al cargar tus solicitudes.');
            const data = await response.json();
            setSolicitudes(data.solicitudes);
        } catch (err) {
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    }, [getToken]);

    useEffect(() => { fetchSolicitudes(); }, [fetchSolicitudes]);

    const handleConfirmarHorario = async (entregaId) => {
        if (!window.confirm("¿Confirmas que puedes retirar la donación en este horario?")) return;
        setIsSubmitting(true);
        try {
            const token = await getToken();
            const response = await fetch(`${API_BASE_URL}/api/entrega/${entregaId}/confirmar-horario`, {
                method: 'POST',
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (!response.ok) throw new Error((await response.json()).message || 'Error al confirmar');
            alert('¡Horario confirmado! El donante ha sido notificado.');
            fetchSolicitudes();
        } catch (err) {
            alert('Error al confirmar: ' + err.message);
        } finally {
            setIsSubmitting(false);
        }
    };

    // --- NUEVA FUNCIÓN ---
    const handleRechazarHorario = async (entregaId) => {
        if (!window.confirm("¿Seguro que no puedes en este horario? La donación volverá a estar disponible para otros.")) return;
        setIsSubmitting(true);
        try {
            const token = await getToken();
            const response = await fetch(`${API_BASE_URL}/api/entrega/${entregaId}/rechazar-horario`, {
                method: 'POST',
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (!response.ok) throw new Error((await response.json()).message || 'Error al rechazar');
            alert('Propuesta rechazada. La donación ahora está disponible para otros usuarios.');
            fetchSolicitudes();
        } catch (err) {
            alert('Error al rechazar: ' + err.message);
        } finally {
            setIsSubmitting(false);
        }
    };
    
    const copyToClipboard = (text) => {
        navigator.clipboard.writeText(text);
        alert('¡Código copiado al portapapeles!');
    };
    
    const renderCardContent = (solicitud) => {
        const entrega = solicitud.entregaId;
        switch (solicitud.estadoSolicitud) {
            case 'PENDIENTE_APROBACION':
                return <div className="flex items-center gap-2 text-yellow-600"><Clock size={16} /><span>Pendiente de aprobación</span></div>;
            case 'RECHAZADA_DONANTE':
                return <div className="flex items-center gap-2 text-red-600"><XCircle size={16} /><span>Rechazada por el donante</span></div>;
            case 'CANCELADA_RECEPTOR':
                return <div className="flex items-center gap-2 text-gray-500"><ThumbsDown size={16} /><span>Cancelaste esta solicitud</span></div>;
            case 'COMPLETADA_CON_ENTREGA':
                return <div className="flex items-center gap-2 text-green-700 font-semibold"><CheckCircle size={16} /><span>¡Retiro exitoso!</span></div>;
            case 'APROBADA_ESPERANDO_CONFIRMACION_HORARIO':
                if (!entrega) return <div className="text-gray-500">Cargando detalles de la entrega...</div>;
                return (
                    <div className="bg-blue-50 p-3 rounded-md">
                        <p className="font-semibold text-blue-800">¡Aprobada! Confirma el horario:</p>
                        <p className="text-sm"><strong>Fecha:</strong> {new Date(entrega.fechaPropuesto.fechaInicio).toLocaleDateString()}</p>
                        <p className="text-sm"><strong>Horario:</strong> {entrega.horarioEntregaPropuestaPorDonante.horaInicio} - {entrega.horarioEntregaPropuestaPorDonante.horaFin}</p>
                        {/* --- BOTONES ACTUALIZADOS --- */}
                        <div className="flex gap-2 mt-2">
                            <button onClick={() => handleRechazarHorario(entrega._id)} disabled={isSubmitting} className="flex-1 text-xs bg-red-100 text-red-700 py-1 rounded hover:bg-red-200">No puedo</button>
                            <button onClick={() => handleConfirmarHorario(entrega._id)} disabled={isSubmitting} className="flex-1 text-xs bg-blue-600 text-white py-1 rounded hover:bg-blue-700">Confirmar</button>
                        </div>
                    </div>
                );
            default:
                if (entrega && entrega.estadoEntrega === 'LISTA_PARA_RETIRO') {
                    return (
                        <div className="bg-green-50 p-3 rounded-md">
                            <p className="font-semibold text-green-800">¡Listo para retirar!</p>
                            <p className="text-sm">Tu código de confirmación es:</p>
                            <div className="flex items-center justify-center gap-2 my-2 p-2 bg-green-200 rounded">
                                <span className="font-bold text-lg tracking-widest">{entrega.codigoConfirmacionReceptor}</span>
                                <button onClick={() => copyToClipboard(entrega.codigoConfirmacionReceptor)} title="Copiar código"><Copy size={16} /></button>
                            </div>
                            <p className="text-xs text-center">Muestra este código al donante al momento del retiro.</p>
                        </div>
                    );
                }
                return <p className="text-gray-500">{solicitud.estadoSolicitud}</p>;
        }
    };

    if (isLoading) return <div className="text-center py-20"><Loader2 className="animate-spin inline-block mr-2" /> Cargando tus solicitudes...</div>;
    if (error) return <div className="text-center py-20 text-red-600"><strong>Error:</strong> {error}</div>;

    return (
        <div className="max-w-4xl mx-auto py-10 px-4">
            <h1 className="text-3xl font-bold text-gray-800 mb-8">Mis Solicitudes</h1>
            {solicitudes.length > 0 ? (
                <div className="space-y-4">
                    {solicitudes.map(solicitud => (
                        <div key={solicitud._id} className="border rounded-lg bg-white shadow-sm p-4 flex items-start gap-4">
                            <img src={solicitud.donacionId.imagenesUrl[0]} alt={solicitud.donacionId.titulo} className="w-20 h-20 rounded-md object-cover" />
                            <div className="flex-grow">
                                <h3 className="font-semibold text-gray-900">{solicitud.donacionId.titulo}</h3>
                                <p className="text-sm text-gray-600">Donado por: {solicitud.donanteId.nombre}</p>
                                <div className="mt-3">
                                    {renderCardContent(solicitud)}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="text-center py-10 border-2 border-dashed rounded-lg">
                    <p className="text-gray-600 mb-4">Aún no has realizado ninguna solicitud.</p>
                    <Link to="/" className="inline-block bg-primary text-white font-bold py-2 px-4 rounded hover:bg-brandPrimaryDarker transition-colors">
                        <Gift className="inline-block mr-2" size={16} /> Ver donaciones disponibles
                    </Link>
                </div>
            )}
        </div>
    );
};
export default MyRequestsPage;