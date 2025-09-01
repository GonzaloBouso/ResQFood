const MyDonationsPage = () => {
    const { getToken } = useAuth();
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
            setDonaciones(data.donaciones);
        } catch (err) { setError(err.message); } finally { setIsLoading(false); }
    }, [getToken]);

    useEffect(() => { fetchDonations(); }, [fetchDonations]);

    const handleAcceptAndPropose = async (solicitudId, propuesta) => {
        setIsSubmitting(true);
        const toastId = toast.loading('Enviando propuesta...');
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
            toast.success('¡Propuesta enviada!', { id: toastId });
            setSolicitudParaAceptar(null);
            fetchDonations();
        } catch (err) {
            toast.error(`Error: ${err.message}`, { id: toastId });
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleReject = (solicitud) => {
        toast((t) => (
            <div className="flex flex-col items-center gap-3 p-2">
                <span className="text-center font-semibold">¿Rechazar la solicitud de {solicitud.solicitanteId?.nombre}?</span>
                <div className="flex gap-3">
                    <button onClick={() => toast.dismiss(t.id)} className="px-3 py-1 text-sm bg-gray-200 rounded-md hover:bg-gray-300">Cancelar</button>
                    <button onClick={() => { toast.dismiss(t.id); executeReject(solicitud._id); }} className="px-3 py-1 text-sm bg-red-600 text-white rounded-md hover:bg-red-700">Rechazar</button>
                </div>
            </div>
        ), { duration: 6000 });
    };

    const executeReject = async (solicitudId) => {
        setIsSubmitting(true);
        const toastId = toast.loading('Rechazando...');
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
            toast.success('Solicitud rechazada.', { id: toastId });
            fetchDonations();
        } catch (err) {
            toast.error(`Error: ${err.message}`, { id: toastId });
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleCompleteDelivery = async (entregaId, codigo) => {
        setIsSubmitting(true);
        const toastId = toast.loading('Confirmando entrega...');
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
            toast.success('¡Entrega completada con éxito!', { id: toastId });
            fetchDonations();
        } catch (err) {
            toast.error(`Error: ${err.message}`, { id: toastId });
        } finally {
            setIsSubmitting(false);
        }
    };

    if (isLoading) return <div className="text-center py-20"><Loader2 className="animate-spin inline-block mr-2" /> Cargando...</div>;
    if (error) return <div className="text-center py-20 text-red-600"><strong>Error:</strong> {error}</div>;

    return (
        <div className="max-w-4xl mx-auto py-10 px-4">
            <h1 className="text-3xl font-bold text-gray-800 mb-8">Gestionar Mis Donaciones</h1>
            {donaciones.length > 0 ? (
                <div className="space-y-4">
                    {donaciones.map(donacion => {
                        
                        const solicitudes = donacion.solicitudes || [];
                        const isExpanded = expandedDonationId === donacion._id;
                        const solicitudAceptada = solicitudes.find(s => s.entregaId && s.estadoSolicitud !== 'CANCELADA_RECEPTOR');
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
                                        }`}>{donacion.estadoPublicacion.replace('-', ' ')}</div>
                                    </div>
                                    <ChevronDown className={`transition-transform ${isExpanded ? 'rotate-180' : ''}`} size={20} />
                                </div>
                                
                                {isExpanded && (
                                    <div className="animate-fade-in-up">
                                        {donacion.estadoPublicacion === 'DISPONIBLE' && (
                                            <SolicitudesList solicitudes={solicitudes} onAcceptClick={setSolicitudParaAceptar} onReject={handleReject} isSubmitting={isSubmitting} />
                                        )}
                                        
                                        {donacion.estadoPublicacion === 'PENDIENTE-ENTREGA' && entregaActiva && (
                                            <div className="p-4 bg-gray-50 border-t">
                                                <p className="font-semibold text-sm mb-2">Estado para: <span className="font-bold">{solicitudAceptada.solicitanteId?.nombre}</span></p>
                                                
                                                {entregaActiva.estadoEntrega === 'PENDIENTE_CONFIRMACION_SOLICITANTE' && (
                                                    <div className="flex items-center gap-2 text-yellow-700 bg-yellow-100 p-2 rounded-md">
                                                        <Clock size={16} />
                                                        <span className="text-xs font-medium">Esperando confirmación del horario por el receptor.</span>
                                                    </div>
                                                )}

                                                {entregaActiva.estadoEntrega === 'LISTA_PARA_RETIRO' && (
                                                    <>
                                                        <div className="flex items-center gap-2 text-green-700 bg-green-100 p-2 rounded-md mb-3">
                                                            <CheckCircle size={16} />
                                                            <span className="text-xs font-medium">¡Horario confirmado! Listo para el retiro.</span>
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
