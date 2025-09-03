import React, { useState, useEffect, useCallback, useContext } from 'react';
import { useAuth } from '@clerk/clerk-react';
import { Link } from 'react-router-dom';
import API_BASE_URL from '../api/config';
// import { Loader2, CheckCircle, XCircle, Clock, Gift, Copy, ThumbsDown } from 'lucide-react'; // --- ELIMINADO ---
import toast from 'react-hot-toast';
import { ProfileStatusContext } from '../context/ProfileStatusContext';

// --- COMPONENTE HIJO "TONTO" (SIN ICONOS) ---
const SolicitudCard = ({ solicitud, isSubmitting, onConfirm, onReject, onCopy }) => {
    
    if (!solicitud || !solicitud.donacionId || !solicitud.donanteId) {
        return null;
    }

    const entrega = solicitud.entregaId;

    const renderContent = () => {
        switch (solicitud.estadoSolicitud) {
            case 'PENDIENTE_APROBACION': return <div className="flex items-center gap-2 text-yellow-600"><span>🕒 Pendiente de aprobación</span></div>;
            case 'RECHAZADA_DONANTE': return <div className="flex items-center gap-2 text-red-600"><span>❌ Rechazada por el donante</span></div>;
            case 'CANCELADA_RECEPTOR': return <div className="flex items-center gap-2 text-gray-500"><span>👎 Cancelaste esta solicitud</span></div>;
            case 'COMPLETADA_CON_ENTREGA': return <div className="flex items-center gap-2 text-green-700 font-semibold"><span>✔️ ¡Retiro exitoso!</span></div>;
            case 'APROBADA_ESPERANDO_CONFIRMACION_HORARIO':
                if (!entrega?.horarioPropuesto) return <div className="text-gray-500">Cargando detalles...</div>;
                return (
                    <div className="bg-blue-50 p-3 rounded-md">
                        <p className="font-semibold text-blue-800">¡Aprobada! Confirma el horario:</p>
                        <p className="text-sm"><strong>Fecha:</strong> {new Date(entrega.horarioPropuesto.fecha).toLocaleDateString()}</p>
                        <p className="text-sm"><strong>Horario:</strong> {entrega.horarioPropuesto.horaInicio} - {entrega.horarioPropuesto.horaFin}</p>
                        <div className="flex gap-2 mt-2">
                            <button onClick={() => onReject(entrega._id)} disabled={isSubmitting} className="flex-1 text-xs bg-red-100 text-red-700 py-1 rounded hover:bg-red-200">No puedo</button>
                            <button onClick={() => onConfirm(entrega._id)} disabled={isSubmitting} className="flex-1 text-xs bg-blue-600 text-white py-1 rounded hover:bg-blue-700">Confirmar</button>
                        </div>
                    </div>
                );
            case 'HORARIO_CONFIRMADO':
                if (entrega?.estadoEntrega === 'LISTA_PARA_RETIRO') {
                    return (
                        <div className="bg-green-50 p-3 rounded-md">
                            <p className="font-semibold text-green-800">¡Listo para retirar!</p>
                            <p className="text-sm">Tu código de confirmación es:</p>
                            <div className="flex items-center justify-center gap-2 my-2 p-2 bg-green-200 rounded">
                                <span className="font-bold text-lg tracking-widest">{entrega.codigoConfirmacionReceptor}</span>
                                <button onClick={() => onCopy(entrega.codigoConfirmacionReceptor)} title="Copiar código" className="text-sm">(Copiar)</button>
                            </div>
                            <p className="text-xs text-center">Muestra este código al donante al momento del retiro.</p>
                        </div>
                    );
                }
                return <p className="text-gray-500">Horario Confirmado</p>;
            default:
                return <p className="text-gray-500">{solicitud.estadoSolicitud}</p>;
        }
    };
    
    return (
        <div className="border rounded-lg bg-white shadow-sm p-4 flex items-start gap-4">
            <img 
                src={solicitud.donacionId?.imagenesUrl?.[0] || 'url_a_imagen_por_defecto.png'} 
                alt={solicitud.donacionId?.titulo} 
                className="w-20 h-20 rounded-md object-cover" 
            />
            <div className="flex-grow">
                <h3 className="font-semibold text-gray-900">{solicitud.donacionId?.titulo || "Donación eliminada"}</h3>
                <p className="text-sm text-gray-600">Donado por: {solicitud.donanteId?.nombre || "Usuario eliminado"}</p>
                <div className="mt-3">{renderContent()}</div>
            </div>
        </div>
    );
};

const MyRequestsPage = () => {
    const { getToken } = useAuth();
    const { currentUserDataFromDB } = useContext(ProfileStatusContext);
    const [solicitudes, setSolicitudes] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    
    const fetchSolicitudes = useCallback(async () => { /* ... (sin cambios) */ }, [getToken]);
    useEffect(() => { setIsLoading(true); fetchSolicitudes(); }, [fetchSolicitudes]);
    const handleConfirmarHorario = async (entregaId) => { /* ... (sin cambios) */ };
    const handleRechazarHorario = (entregaId) => { /* ... (sin cambios) */ };
    const executeRechazarHorario = async (entregaId) => { /* ... (sin cambios) */ };
    const copyToClipboard = (text) => { /* ... (sin cambios) */ };

    if (!currentUserDataFromDB) return <div className="text-center py-20">Cargando datos de usuario...</div>;
    
    // Se reemplaza el icono de Loader por texto simple
    if (isLoading) return <div className="text-center py-20"><span>Cargando...</span></div>;
    if (error) return <div className="text-center py-20 text-red-600"><strong>Error:</strong> {error}</div>;

    return (
        <div className="max-w-4xl mx-auto py-10 px-4">
            <h1 className="text-3xl font-bold text-gray-800 mb-8">Mis Solicitudes</h1>
            {solicitudes && solicitudes.length > 0 ? (
                <div className="space-y-4">
                    {solicitudes.map(solicitud => (
                        <SolicitudCard
                            key={solicitud._id}
                            solicitud={solicitud}
                            isSubmitting={isSubmitting}
                            onConfirm={handleConfirmarHorario}
                            onReject={handleRechazarHorario}
                            onCopy={copyToClipboard}
                        />
                    ))}
                </div>
            ) : (
                <div className="text-center py-10 border-2 border-dashed rounded-lg">
                    <p className="text-gray-600 mb-4">Aún no has realizado ninguna solicitud.</p>
                    <Link to="/dashboard" className="inline-block bg-primary text-white font-bold py-2 px-4 rounded hover:bg-brandPrimaryDarker">
                        <span>🎁 Ver donaciones</span>
                    </Link>
                </div>
            )}
        </div>
    );
};
export default MyRequestsPage;