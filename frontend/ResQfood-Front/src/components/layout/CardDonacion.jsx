// src/components/layout/CardDonacion.jsx
import React, { useState } from 'react';
import DetallesCardDonacion from './DetallesCardDonacion';

const FALLBACK_IMAGE_URL = 'https://via.placeholder.com/300x200.png?text=Sin+Imagen';

const CardDonacion = ({ donacion, onSolicitar }) => {
  const [mostrarModal, setMostrarModal] = useState(false);

  if (!donacion) return null;

  const {
    _id,
    titulo,
    imagenesUrl,
    categoria,
    ubicacionRetiro,
    donanteId,
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

  const abrirModal = () => setMostrarModal(true);
  const cerrarModal = () => setMostrarModal(false);

  return (
    <>
      <div className="rounded-lg border border-gray-200 bg-white shadow-sm overflow-hidden flex flex-col h-full transition-shadow hover:shadow-md">
        {/* Header con info del donante */}
        {donanteId && (
          <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
            <div className="flex items-center space-x-3">
              {donanteId.fotoDePerfilUrl ? (
                <img className="w-8 h-8 rounded-full object-cover" src={donanteId.fotoDePerfilUrl} alt={nombreDonante} />
              ) : (
                <div className="w-8 h-8 bg-primary/20 text-primary font-semibold rounded-full flex items-center justify-center text-sm">
                  {inicialesDonante}
                </div>
              )}
              <span className="font-medium text-sm text-gray-700 truncate" title={nombreDonante}>
                {nombreDonante}
              </span>
            </div>
          </div>
        )}

        {/* Imagen */}
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

        {/* Contenido */}
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

        {/* Botones */}
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

