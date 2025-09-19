import React, { useState } from 'react';
import { useAuth } from '@clerk/clerk-react';
import { ChevronDown, ChevronRight } from 'lucide-react';
import toast from 'react-hot-toast'; 

import ProposeScheduleModal from './ProposeScheduleModal'; 
import API_BASE_URL from '../../api/config';

const DropdownSolicitudes = ({ solicitudes, solicitudAceptada, onActionComplete }) => {
  const [open, setOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [solicitudParaAceptar, setSolicitudParaAceptar] = useState(null); 
  const { getToken } = useAuth();

  const handleRechazarClick = async (solicitud) => {
    if (!window.confirm(`¿Seguro que quieres rechazar la solicitud de ${solicitud.solicitanteId?.nombre}?`)) return;
    
    setIsSubmitting(true);
    const toastId = toast.loading('Rechazando solicitud...');
    
    try {
      const token = await getToken();
      const response = await fetch(`${API_BASE_URL}/api/solicitud/${solicitud._id}/rechazar`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Error al rechazar');
      }
      
      toast.success('Solicitud rechazada.', { id: toastId });
      if (onActionComplete) onActionComplete(); 
      
    } catch (error) {
      toast.error(`Error: ${error.message}`, { id: toastId });
    } finally {
      setIsSubmitting(false);
    }
  };

  
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
        const errorPayload = await response.json();
        throw new Error(errorPayload.message);
      }

      toast.success('¡Propuesta enviada con éxito!', { id: toastId });
      setSolicitudParaAceptar(null); // Cierra el modal
      if (onActionComplete) onActionComplete(); // Recarga los datos
      
    } catch (err) {
      toast.error(`Error: ${err.message}`, { id: toastId });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <div className="bg-gray-50 text-black rounded-lg shadow-sm overflow-hidden w-full border border-gray-200">
        <button
          onClick={() => setOpen(!open)}
          className="w-full flex items-center justify-between px-4 py-3 text-left font-medium text-sm hover:bg-gray-100 transition"
        >
          <span>Lista de solicitudes ({solicitudes.length})</span>
          {open ? <ChevronDown className="w-5 h-5" /> : <ChevronRight className="w-5 h-5" />}
        </button>

        {open && (
          <div className="divide-y border-t border-gray-200 px-4 pb-3">
            {solicitudes.length === 0 ? (
              <p className="text-sm py-3 text-gray-500">No hay solicitudes pendientes.</p>
            ) : (
              solicitudes.map((s) => (
                <div key={s._id} className="py-3 flex flex-col sm:flex-row justify-between sm:items-center">
                  <div className="text-sm">
                    <p><strong>Usuario:</strong> {s.solicitanteId?.nombre || 'Usuario desconocido'}</p>
                  </div>
                  <div className="flex gap-2 mt-2 sm:mt-0">
                    <button
                        // Abre el modal de proponer horario
                        onClick={() => setSolicitudParaAceptar(s)}
                        className={`text-xs px-3 py-1 rounded transition ${
                        solicitudAceptada
                            ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                            : 'bg-green-500 hover:bg-green-600 text-white'
                        }`}
                        disabled={!!solicitudAceptada || isSubmitting}
                    >
                        Aceptar
                    </button>
                    <button
                      onClick={() => handleRechazarClick(s)}
                      className="bg-red-500 hover:bg-red-600 text-white text-xs px-3 py-1 rounded transition"
                      disabled={!!solicitudAceptada || isSubmitting}
                    >
                      Rechazar
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>

      {solicitudParaAceptar && (
          <ProposeScheduleModal 
              solicitud={solicitudParaAceptar} 
              onClose={() => setSolicitudParaAceptar(null)}
              onSubmit={handleAcceptAndPropose}
              isSubmitting={isSubmitting}
          />
      )}
    </>
  );
};

export default DropdownSolicitudes;