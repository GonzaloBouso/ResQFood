import React, { useState } from 'react';
import { useAuth } from '@clerk/clerk-react';
import { ChevronDown, ChevronRight } from 'lucide-react';
import API_BASE_URL from '../../api/config';

const SolicitudAceptada = ({ solicitud }) => {
  const [open, setOpen] = useState(true);
  const [codigoIngresado, setCodigoIngresado] = useState('');
  const [verificado, setVerificado] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { getToken } = useAuth();
  
  if (!solicitud || !solicitud.entregaId) return null; // No renderizar si no hay solicitud o entregaId

  const handleVerificar = async () => {
    if (!codigoIngresado.trim()) {
        alert("Por favor, ingresa el código de confirmación.");
        return;
    }
    
    setIsSubmitting(true);
    setVerificado(null);

    try {
        const token = await getToken();
        const entregaId = solicitud.entregaId._id;
        
        const response = await fetch(`${API_BASE_URL}/api/entrega/${entregaId}/completar`, {
            method: 'POST',
            headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
            body: JSON.stringify({ codigoConfirmacion: codigoIngresado.trim() })
        });
        
        const data = await response.json();

        if (!response.ok) {
            setVerificado(false);
            alert(data.message || 'Error al verificar el código');
            return;
        }

        setVerificado(true);
        alert('¡Entrega completada exitosamente!');
        // Espera un momento para que el usuario vea el mensaje de éxito y luego recarga
        setTimeout(() => window.location.reload(), 1500);

    } catch(error) {
        setVerificado(false);
        alert('Error de red al verificar el código.');
        console.error("Error en handleVerificar:", error);
    } finally {
        setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white text-black rounded-lg shadow-sm overflow-hidden w-full border border-green-300">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-4 py-3 text-left font-medium text-sm bg-green-50 hover:bg-green-100 transition"
      >
        <span>Solicitud aceptada (1)</span>
        {open ? <ChevronDown className="w-5 h-5" /> : <ChevronRight className="w-5 h-5" />}
      </button>

      {open && (
        <div className="px-4 pb-4 pt-3 border-t text-sm space-y-4">
          <div>
            <p className="font-semibold">Usuario:</p>
            <p>{solicitud.solicitanteId?.nombre || 'Usuario desconocido'}</p>
          </div>

          <div>
            <p className="font-semibold">Ingresar código de retiro:</p>
            <p className="text-xs text-gray-500 mb-1">Pídele al receptor el código que recibió para confirmar la entrega.</p>
            <input
              type="text"
              value={codigoIngresado}
              onChange={(e) => {
                setCodigoIngresado(e.target.value.toUpperCase());
                setVerificado(null);
              }}
              className="border border-gray-300 rounded px-3 py-1 w-full mt-1 uppercase"
              placeholder="CÓDIGO DE RETIRO"
            />

            <button
              onClick={handleVerificar}
              disabled={isSubmitting}
              className="mt-2 bg-blue-600 text-white text-xs px-3 py-1 rounded transition hover:bg-blue-700 disabled:bg-gray-400"
            >
              {isSubmitting ? 'Verificando...' : 'Confirmar Entrega'}
            </button>

            {verificado === true && ( <p className="text-green-600 text-xs mt-1">✅ ¡Entrega confirmada!</p> )}
            {verificado === false && ( <p className="text-red-600 text-xs mt-1">❌ Código incorrecto.</p> )}
          </div>
        </div>
      )}
    </div>
  );
};

export default SolicitudAceptada;