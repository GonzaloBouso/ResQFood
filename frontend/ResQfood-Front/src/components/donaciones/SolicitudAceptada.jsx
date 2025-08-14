import React, { useState } from 'react';
import { ChevronDown, ChevronRight } from 'lucide-react';

const SolicitudAceptada = ({ solicitud }) => {
  const [open, setOpen] = useState(true);
  const [codigoIngresado, setCodigoIngresado] = useState('');
  const [verificado, setVerificado] = useState(null);

  if (!solicitud) return null;

  const haySolicitud = 1;

  const handleVerificar = () => {
    
    alert('Funcionalidad de completar entrega en desarrollo.');
  };

  return (
    <div className="bg-white text-black rounded-lg shadow-md overflow-hidden w-full mt-4 border border-green-300">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-4 py-3 text-left font-medium text-sm bg-green-50 hover:bg-green-100 transition"
      >
        <span>Solicitud aceptada ({haySolicitud})</span>
        {open ? <ChevronDown className="w-5 h-5" /> : <ChevronRight className="w-5 h-5" />}
      </button>

      {open && (
        <div className="px-4 pb-4 pt-3 border-t text-sm space-y-4">
          <div>
            <p className="font-semibold">Usuario:</p>
            
            <p>{solicitud.solicitanteId?.nombre || 'Usuario desconocido'}</p>
          </div>
          <div>
            <p className="font-semibold">Ingresar código:</p>
            <input
              type="text"
              value={codigoIngresado}
              onChange={(e) => {
                setCodigoIngresado(e.target.value);
                setVerificado(null);
              }}
              className="border border-gray-300 rounded px-3 py-1 w-full mt-1"
              placeholder="Código de retiro"
            />
            <button
              onClick={handleVerificar}
              className="mt-2 bg-black text-white text-xs px-3 py-1 rounded transition hover:bg-gray-800"
            >
              Comprobar código
            </button>
            {verificado === true && <p className="text-green-600 text-xs mt-1">✅ Código correcto</p>}
            {verificado === false && <p className="text-red-600 text-xs mt-1">❌ Código incorrecto</p>}
          </div>
          <div>
            <button className="bg-red-500 hover:bg-red-600 text-white text-xs px-3 py-1 rounded transition">
              Cancelar
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default SolicitudAceptada;