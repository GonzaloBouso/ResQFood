// src/components/layout/CardDonacion.jsx
import React from 'react';
import { Link } from 'react-router-dom'; 


const FALLBACK_IMAGE_URL = 'https://via.placeholder.com/300x200.png?text=Sin+Imagen';

const CardDonacion = ({ donacion, onSolicitar }) => { // Se espera una prop 'donacion' y opcionalmente 'onSolicitar'
  
  if (!donacion) {
    return null; 
  }

  // Desestructurar las propiedades del objeto 'donacion'
  const {
    _id, // ID de la donación para el enlace de detalles
    titulo,
    
    imagenesUrl, 
    categoria,
    ubicacionRetiro, // Objeto con ciudad, provincia, etc.
    donanteId, // Objeto del donante si se ha populado en el backend
    // Otros campos que podrías querer usar: estadoAlimento, fechaExpiracionPublicacion, etc.
  } = donacion;

  
  const imageUrl = imagenesUrl && imagenesUrl.length > 0 ? imagenesUrl[0] : FALLBACK_IMAGE_URL;

 
  const ubicacionSimple = ubicacionRetiro 
    ? `${ubicacionRetiro.ciudad || ''}${ubicacionRetiro.provincia ? ', ' + ubicacionRetiro.provincia : ''}`.trim() 
    : 'Ubicación no especificada';


  const nombreDonante = donanteId?.nombre || 'Donante Anónimo';
  const inicialesDonante = nombreDonante
    .split(' ')
    .map(n => n[0])
    .join('')
    .substring(0, 2) 
    .toUpperCase();

  const handleSolicitarClick = () => {
    if (onSolicitar) {
      onSolicitar(donacion); 
    } else {
      console.warn("La función onSolicitar no fue proporcionada a CardDonacion para la donación:", titulo);
      
    }
  };

  return (
    <div className="rounded-lg border border-gray-200 bg-white shadow-sm overflow-hidden flex flex-col h-full transition-shadow hover:shadow-md">
      {/* Header de la tarjeta con avatar y nombre del donante */}
      {donanteId && ( // Solo mostrar si hay info del donante
        <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
          <div className="flex items-center space-x-3">
            {donanteId.fotoDePerfilUrl ? (
              <img className="w-8 h-8 rounded-full object-cover" src={donanteId.fotoDePerfilUrl} alt={nombreDonante} />
            ) : (
              <div className="w-8 h-8 bg-primary/20 text-primary font-semibold rounded-full flex items-center justify-center text-sm">
                {inicialesDonante}
              </div>
            )}
            <span className="font-medium text-sm text-gray-700 truncate" title={nombreDonante}>{nombreDonante}</span>
          </div>
        </div>
      )}

      {/* Imagen del producto */}
      <div className="w-full h-48 bg-gray-100">
        <img
          className="w-full h-full object-cover"
          src={imageUrl}
          alt={titulo || 'Imagen de la donación'}
          onError={(e) => { 
            e.target.onerror = null;
            e.target.src = FALLBACK_IMAGE_URL; 
          }}
        />
      </div>

      {/* Contenido principal de la tarjeta */}
      <div className="p-4 flex flex-col flex-grow">
        {categoria && (
          <span className="text-xs font-semibold uppercase tracking-wider text-primary mb-1">
            {categoria}
          </span>
        )}
        <h3 className="text-lg font-semibold text-gray-800 mb-2 truncate" title={titulo}>
          {titulo || 'Donación sin título'}
        </h3>
        
        {ubicacionSimple && ubicacionSimple !== ',' && (
          <p className="text-xs text-gray-500 mt-auto pt-2">
            📍 {ubicacionSimple}
          </p>
        )}
      </div>
      
      {/* Footer de la tarjeta con botones separados */}
      <div className="px-4 pb-4 pt-3 border-t border-gray-100">
        <div className="flex flex-col sm:flex-row justify-between items-center gap-2">
          <Link 
            to={`/donacion/${_id}`} // Enlace a la página de detalles de la donación
            className="w-full sm:w-auto flex-1 text-center px-3 py-2 border border-primary text-primary rounded-md text-sm font-medium hover:bg-primary/10 transition-colors whitespace-nowrap"
          >
            Ver Detalles
          </Link>
          <button 
            className="w-full sm:w-auto flex-1 px-3 py-2 bg-primary text-white rounded-md text-sm font-medium hover:bg-brandPrimaryDarker transition-colors whitespace-nowrap"
            onClick={handleSolicitarClick}
      
          >
            Solicitar
          </button>
        </div>
      </div>
    </div>
  );
};

export default CardDonacion;