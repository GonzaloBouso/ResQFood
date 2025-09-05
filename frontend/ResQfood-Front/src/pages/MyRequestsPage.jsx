import React, { useState, useEffect, useCallback, useContext } from 'react';
import { useAuth } from '@clerk/clerk-react';
import { Link } from 'react-router-dom';
import API_BASE_URL from '../api/config';
import toast from 'react-hot-toast';
import { ProfileStatusContext } from '../context/ProfileStatusContext';
import CodigoRetiroModal from '../components/modals/CodigoRetiroModal';
import CalificacionModal from '../components/modals/CalificacionModal'; 


const SolicitudCard = ({ solicitud, isSubmitting, onConfirm, onReject, onCopy, onCalificarClick }) => {
    if (!solicitud || !solicitud.donacionId || !solicitud.donanteId) { return null; }
    const entrega = solicitud.entregaId;

    const renderContent = () => {
        switch (solicitud.estadoSolicitud) {
            case 'PENDIENTE_APROBACION': return <div className="flex items-center gap-2 text-yellow-600 font-medium text-sm"><span>🕒</span><span>Pendiente de aprobación</span></div>;
            case 'RECHAZADA_DONANTE': return <div className="flex items-center gap-2 text-red-600 font-medium text-sm"><span>❌</span><span>Rechazada por el donante</span></div>;
            case 'CANCELADA_RECEPTOR': return <div className="flex items-center gap-2 text-gray-500 font-medium text-sm"><span>👎</span><span>Cancelaste esta solicitud</span></div>;
            
            
            case 'COMPLETADA_CON_ENTREGA': 
                return (
                    <div className="flex flex-col sm:flex-row items-center justify-between gap-2 mt-2">
                        <div className="flex items-center gap-2 text-green-700 font-semibold text-sm">
                            <span>✔️</span>
                            <span>¡Retiro exitoso!</span>
                        </div>
                       
                         {entrega && entrega.estadoEntrega === 'COMPLETADA' && !entrega.calificacionRealizada && (
                          <button onClick={() => onCalificarClick(entrega)}
                           className="bg-yellow-400 text-yellow-900 font-bold text-xs px-3 py-1.5 rounded-full hover:bg-yellow-500 transition-colors"
                            >
                                 Calificar Donante
                             </button>
                         )}
                    </div>
                );

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
                                <button onClick={() => onCopy(entrega.codigoConfirmacionReceptor)} title="Copiar código" className="text-sm font-medium text-blue-600 hover:underline">(Copiar)</button>
                            </div>
                            <p className="text-xs text-center">Muestra este código al donante.</p>
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
                src={solicitud.donacionId?.imagenesUrl?.[0] || 'https://via.placeholder.com/150'} 
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

// --- Componente MyRequestsPage MODIFICADO ---
const MyRequestsPage = () => {
    const { getToken } = useAuth();
    const { currentUserDataFromDB } = useContext(ProfileStatusContext);
    const [solicitudes, setSolicitudes] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [codigoParaMostrar, setCodigoParaMostrar] = useState(null);
    const [entregaParaCalificar, setEntregaParaCalificar] = useState(null); 
    
    const fetchSolicitudes = useCallback(async () => {
        // Ponemos setIsLoading en false al final, no importa si hay error o no.
        setIsLoading(true);
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
        fetchSolicitudes(); 
    }, [fetchSolicitudes]);

    const handleConfirmarHorario = async (entregaId) => {
        setIsSubmitting(true);
        const toastId = toast.loading('Confirmando horario...');
        try {
            const token = await getToken();
            const response = await fetch(`${API_BASE_URL}/api/entrega/${entregaId}/confirmar-horario`, { method: 'POST', headers: { 'Authorization': `Bearer ${token}` } });
            if (!response.ok) throw new Error((await response.json()).message || 'Error al confirmar');
            const data = await response.json();
            toast.dismiss(toastId);
            setCodigoParaMostrar(data?.entrega?.codigoConfirmacionReceptor);
        } catch (err) {
            toast.error(`Error: ${err.message}`, { id: toastId });
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleCloseModal = () => {
        setCodigoParaMostrar(null);
        fetchSolicitudes(); // Refrescamos para ver el nuevo estado
    };
    
   
    const handleCloseCalificacionModal = (seCalifico) => {
        setEntregaParaCalificar(null);
        if (seCalifico) {
            // Si el usuario calificó, refrescamos la lista para que el botón "Calificar" desaparezca.
            fetchSolicitudes();
        }
    };

    const executeRechazarHorario = async (entregaId) => {
        setIsSubmitting(true);
        try {
            const token = await getToken();
            await fetch(`${API_BASE_URL}/api/entrega/${entregaId}/rechazar-horario`, { method: 'POST', headers: { 'Authorization': `Bearer ${token}` } });
            toast.success('Propuesta rechazada.');
            fetchSolicitudes();
        } catch (err) {
            toast.error(`Error: ${err.message}`);
        } finally {
            setIsSubmitting(false);
        }
    };
    
    const handleRechazarHorario = (entregaId) => {
        toast((t) => (
            <div className="flex flex-col items-center gap-3 p-2">
                <span className="text-center font-semibold">¿Seguro que no puedes en este horario?</span>
                <div className="flex gap-3 mt-2">
                    <button onClick={() => toast.dismiss(t.id)} className="px-3 py-1 rounded border bg-gray-100 text-gray-700">Cancelar</button>
                    <button onClick={() => { toast.dismiss(t.id); executeRechazarHorario(entregaId); }} className="px-3 py-1 rounded bg-red-600 text-white">Sí, rechazar</button>
                </div>
            </div>
        ));
    };
    
    const copyToClipboard = (text) => {
        navigator.clipboard.writeText(text);
        toast.success('¡Código copiado!');
    };

    if (!currentUserDataFromDB) return <div className="text-center py-20">Cargando...</div>;
    if (isLoading) return <div className="text-center py-20"><span>Cargando tus solicitudes...</span></div>;
    if (error) return <div className="text-center py-20 text-red-600"><strong>Error:</strong> {error}</div>;

    return (
        <>
            <div className="max-w-4xl mx-auto py-10 px-4">
                <h1 className="text-3xl font-bold mb-8">Mis Solicitudes</h1>
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
                                onCalificarClick={setEntregaParaCalificar}
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
            
            
            <CodigoRetiroModal codigo={codigoParaMostrar} onClose={handleCloseModal} />

            {entregaParaCalificar && (
                <CalificacionModal
                    entregaData={entregaParaCalificar}
                    onClose={handleCloseCalificacionModal}
                />
            )}
        </>
    );
};

export default MyRequestsPage;