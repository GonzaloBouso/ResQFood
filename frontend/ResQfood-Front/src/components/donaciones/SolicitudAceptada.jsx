import React, { useState } from 'react';
import { useAuth } from '@clerk/clerk-react';
import { ChevronDown, ChevronRight } from 'lucide-react';
import API_BASE_URL from '../../api/config';

const SolicitudAceptada = ({ solicitud }) => {
  const [open, setOpen] = useState(false);
  const [codigoIngresado, setCodigoIngresado] = useState('');
  const [verificado, setVerificado] = useState(null);
  const { getToken } = useAuth();
  
  if (!solicitud) return null;

  const handleVerificar = async () => {
    try {
        const token = await getToken();
        // Asumimos que la entrega se crea al aceptar y podemos obtener su ID
        // Esto puede necesitar ajuste dependiendo de cómo obtengas el ID de la entrega
        const entregaId = solicitud.entregaId; // O como se llame la propiedad

        const response = await fetch(`${API_BASE_URL}/api/entrega/${entregaId}/completar`, {
            method: 'POST',
            headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
            body: JSON.stringify({ codigoConfirmacion: codigoIngresado.trim().toUpperCase() })
        });
        
        const data = await response.json();
        if (!response.ok) {
            setVerificado(false); // Muestra código incorrecto
            alert(data.message || 'Error al verificar el código');
            return;
        }

        setVerificado(true);
        alert('¡Entrega completada exitosamente!');
        window.location.reload();

    } catch(error) {
        setVerificado(false);
        alert('Error de red al verificar el código.');
    }
  };

  return (
    <div className="bg-white text-black rounded-lg shadow-md overflow-hidden w-full border border-green-300">
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
            {/* --- CORRECCIÓN ---: Usamos la propiedad correcta */}
            <p>{solicitud.solicitanteId?.nombre || 'Usuario desconocido'}</p>
          </div>

          <div>
            <p className="font-semibold">Ingresar código de retiro:</p>
            <input
              type="text"
              value={codigoIngresado}
              onChange={(e) => {
                setCodigoIngresado(e.target.value);
                setVerificado(null);
              }}
              className="border border-gray-300 rounded px-3 py-1 w-full mt-1"
              placeholder="Código proporcionado por el receptor"
            />

            <button
              onClick={handleVerificar}
              className="mt-2 bg-blue-600 text-white text-xs px-3 py-1 rounded transition hover:bg-blue-700"
            >
              Confirmar Entrega
            </button>

            {verificado === true && (
              <p className="text-green-600 text-xs mt-1">✅ ¡Entrega confirmada!</p>
            )}
            {verificado === false && (
              <p className="text-red-600 text-xs mt-1">❌ Código incorrecto o la entrega no está lista.</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default SolicitudAceptada;