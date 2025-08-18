import React from 'react';
import DropdownSolicitudes from './DropdownSolicitudes';
import SolicitudAceptada from './SolicitudAceptada';

const CardDonacion = ({ donacion, showManagement = false }) => {
  const {
    _id,
    titulo,
    imagenesUrl = [],
    categoria,
    estadoPublicacion,
    solicitudes = [],
    solicitudAceptada = null,
  } = donacion || {};

  if (!donacion) return null;

  const img = imagenesUrl[0] || 'https://via.placeholder.com/150?text=Sin+Imagen';

  return (
    <article className="w-full bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden">
      <div className="p-4 flex flex-col sm:flex-row sm:items-start gap-4">
        <div className="w-24 h-24 rounded-lg overflow-hidden bg-gray-50 shrink-0">
          <img src={img} alt={titulo} className="w-full h-full object-cover" loading="lazy" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex justify-between items-start">
            <div>
              <span className="text-[11px] px-2 py-0.5 rounded-full bg-gray-100 text-gray-700 font-medium">
                {estadoPublicacion}
              </span>
              <h3 className="font-semibold text-gray-900 mt-1">{titulo}</h3>
              <p className="text-sm text-gray-500">{categoria}</p>
            </div>
            {showManagement && (
              <button className="bg-red-500 hover:bg-red-600 text-white text-xs px-3 py-1 rounded-md transition-colors">
                Eliminar
              </button>
            )}
          </div>
          
          {showManagement && (
            <div className="mt-4 space-y-2">
              <DropdownSolicitudes 
                solicitudes={solicitudes} 
                solicitudAceptada={solicitudAceptada} 
                donacionId={_id} 
              />
              {solicitudAceptada && (
                <SolicitudAceptada solicitud={solicitudAceptada} />
              )}
            </div>
          )}
        </div>
      </div>
    </article>
  );
};

export default CardDonacion;