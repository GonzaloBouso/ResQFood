import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import DetallesCardDonacion from './DetallesCardDonacion';

const FALLBACK_IMAGE_URL = 'https://via.placeholder.com/300x200.png?text=Sin+Imagen';

const CardDonacion = ({ donacion, onSolicitar }) => {
  const [mostrarModal, setMostrarModal] = useState(false);

  // Verificación de seguridad: si no hay donación, no renderizamos nada para evitar errores.
  if (!donacion) {
    return null;
  }

  const {
    _id,
    titulo,
    imagenesUrl,
    categoria,
    ubicacionRetiro,
    donanteId,
  } = donacion;

 
  const isDonantePopulated = donanteId && typeof donanteId === 'object';

  const imageUrl = imagenesUrl && imagenesUrl.length > 0 ? imagenesUrl[0] : FALLBACK_IMAGE_URL;

  const ubicacionSimple = ubicacionRetiro
    ? `${ubicacionRetiro.ciudad || ''}${ubicacionRetiro.provincia ? ', ' + ubicacionRetiro.provincia : ''}`.trim()
    : 'Ubicación no especificada';

  
  const nombreDonante = isDonantePopulated ? donanteId.nombre : 'Donante';
  const inicialesDonante = nombreDonante
    .split(' ')
    .map(n => n[0])
    .join('')
    .substring(0, 2)
    .toUpperCase();

  const handleSolicitarClick = () => {
    if (onSolicitar) {
      onSolicitar(donacion);
    }
  };

  const abrirModal = () => setMostrarModal(true);
  const cerrarModal = () => setMostrarModal(false);

  return (
    <>
      <div className="rounded-lg border border-gray-200 bg-white shadow-sm overflow-hidden flex flex-col h-full transition-shadow hover:shadow-lg">
       
        {isDonantePopulated ? (
          <Link 
            to={`/perfil/${donanteId._id}`} 
            className="block px-4 py-3 border-b border-gray-100 hover:bg-gray-50 transition-colors"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                {donanteId.fotoDePerfilUrl ? (
                  <img className="w-8 h-8 rounded-full object-cover" src={donanteId.fotoDePerfilUrl} alt={nombreDonante} />
                ) : (
                  <div className="w-8 h-8 bg-primary/20 text-primary font-semibold rounded-full flex items-center justify-center text-sm flex-shrink-0">
                    {inicialesDonante}
                  </div>
                )}
                <span className="font-medium text-sm text-gray-700 truncate" title={nombreDonante}>
                  {nombreDonante}
                </span>
              </div>
            </div>
          </Link>
        ) : (
          // Si 'donanteId' no está poblado, muestra un estado genérico sin enlace.
          <div className="px-4 py-3 border-b border-gray-100">
             <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-gray-200 text-gray-500 rounded-full flex items-center justify-center text-sm flex-shrink-0">?</div>
                <span className="font-medium text-sm text-gray-500 italic">Donante Anónimo</span>
             </div>
          </div>
        )}

        
        <div className="w-full h-48 bg-gray-100">
          <img
            className="w-full h-full object-cover"
            src={imageUrl}
            alt={titulo || 'Imagen de la donación'}
            onError={(e) => { e.target.onerror = null; e.target.src = FALLBACK_IMAGE_URL; }}
          />
        </div>

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

        <div className="px-4 pb-4 pt-3 border-t border-gray-100">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-2">
            <button
              onClick={abrirModal}
              className="w-full sm:w-auto flex-1 text-center px-3 py-2 border border-primary text-primary rounded-md text-sm font-medium hover:bg-primary/10 transition-colors whitespace-nowrap"
            >
              Ver Detalles
            </button>
            <button
              className="w-full sm:w-auto flex-1 px-3 py-2 bg-primary text-white rounded-md text-sm font-medium hover:bg-brandPrimaryDarker transition-colors whitespace-nowrap"
              onClick={handleSolicitarClick}
            >
              Solicitar
            </button>
          </div>
        </div>
      </div>

      {mostrarModal && (
        <DetallesCardDonacion donacionId={_id} onClose={cerrarModal} />
      )}
    </>
  );
};

export default CardDonacion;