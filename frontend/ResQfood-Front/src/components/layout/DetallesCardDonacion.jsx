import React, { useEffect, useState } from 'react';
import { useAuth } from '@clerk/clerk-react';
import API_BASE_URL from '../../api/config.js';
import { ChevronLeft, ChevronRight } from 'lucide-react'; // <<< 1. Importamos iconos para el carrusel

const FALLBACK_IMAGE = 'https://via.placeholder.com/400x400.png?text=Sin+Imagen';

const DetallesCardDonacion = ({ donacionId, onClose }) => {
  const [donacion, setDonacion] = useState(null);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);
  const { getToken } = useAuth();

  // <<< 2. Estado para manejar la imagen actual en el carrusel >>>
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    if (!donacionId) return;

    const fetchDonacion = async () => {
      // ... tu lógica de fetch (sin cambios) ...
    };

    fetchDonacion();
  }, [donacionId, getToken]);

  // <<< 3. Funciones para navegar por el carrusel de imágenes >>>
  const goToNextImage = () => {
    if (donacion?.imagenesUrl) {
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % donacion.imagenesUrl.length);
    }
  };

  const goToPrevImage = () => {
    if (donacion?.imagenesUrl) {
      setCurrentImageIndex((prevIndex) => (prevIndex - 1 + donacion.imagenesUrl.length) % donacion.imagenesUrl.length);
    }
  };

  if (!donacionId) return null;

  // El JSX principal ha sido reestructurado para ser responsivo y scrollable
  return (
    <div 
      onClick={onClose} // Cierra el modal si se hace clic en el fondo
      className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-sm"
    >
      <div 
        onClick={(e) => e.stopPropagation()} // Evita que el clic dentro del modal lo cierre
        className="bg-white rounded-xl w-full max-w-lg shadow-2xl flex flex-col max-h-[90vh]" // <<< 4. Estructura principal del modal
      >
        {/* Encabezado del Modal */}
        <div className="flex-shrink-0 p-4 border-b border-gray-200 flex justify-between items-center">
          <h2 className="text-lg font-semibold text-gray-800 truncate">
            {donacion?.titulo || "Detalles de la Donación"}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-800 transition-colors rounded-full p-1"
            aria-label="Cerrar modal"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
          </button>
        </div>

        {/* Contenido Principal (Scrollable) */}
        <div className="flex-grow overflow-y-auto">
          {cargando ? (
            <div className="p-8 text-center text-gray-500">Cargando detalles...</div>
          ) : error ? (
            <div className="p-8 text-center text-red-600">{error}</div>
          ) : (
            <div>
              {/* <<< 5. Carrusel de Imágenes >>> */}
              <div className="relative w-full aspect-video bg-gray-100">
                <img
                  src={donacion.imagenesUrl?.[currentImageIndex] || FALLBACK_IMAGE}
                  alt={`Imagen ${currentImageIndex + 1} de ${donacion.titulo}`}
                  className="w-full h-full object-cover"
                />
                {donacion.imagenesUrl && donacion.imagenesUrl.length > 1 && (
                  <>
                    <button onClick={goToPrevImage} className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/40 text-white p-2 rounded-full hover:bg-black/60 transition-colors">
                      <ChevronLeft size={20} />
                    </button>
                    <button onClick={goToNextImage} className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/40 text-white p-2 rounded-full hover:bg-black/60 transition-colors">
                      <ChevronRight size={20} />
                    </button>
                    <div className="absolute bottom-2 right-2 bg-black/50 text-white text-xs px-2 py-1 rounded-full">
                      {currentImageIndex + 1} / {donacion.imagenesUrl.length}
                    </div>
                  </>
                )}
              </div>

              {/* Detalles de la Donación */}
              <div className="p-6 space-y-5 text-sm">
                <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-5">
                  <div>
                    <dt className="font-semibold text-gray-800">Descripción</dt>
                    <dd className="text-gray-600 mt-1">{donacion.descripcion}</dd>
                  </div>
                  <div>
                    <dt className="font-semibold text-gray-800">Categoría</dt>
                    <dd className="text-gray-600 mt-1">{donacion.categoria}</dd>
                  </div>
                  <div>
                    <dt className="font-semibold text-gray-800">Estado del alimento</dt>
                    <dd className="text-gray-600 mt-1">{donacion.estadoAlimento}</dd>
                  </div>
                  <div>
                    <dt className="font-semibold text-gray-800">Ubicación de Retiro</dt>
                    <dd className="text-gray-600 mt-1">{`${donacion.ubicacionRetiro?.direccion}, ${donacion.ubicacionRetiro?.ciudad}`}</dd>
                  </div>
                  {donacion.condicionesEspeciales && (
                    <div className="sm:col-span-2">
                      <dt className="font-semibold text-gray-800">Condiciones especiales</dt>
                      <dd className="text-gray-600 mt-1">{donacion.condicionesEspeciales}</dd>
                    </div>
                  )}
                </dl>
              </div>
            </div>
          )}
        </div>

        {/* Pie del Modal (Botón de Acción) */}
        {!cargando && !error && (
            <div className="flex-shrink-0 p-4 border-t border-gray-200 bg-gray-50">
                <button
                    onClick={() => { console.log("Solicitud enviada para:", donacion._id); }}
                    className="w-full px-4 py-2.5 bg-primary text-white rounded-lg font-semibold hover:bg-brandPrimaryDarker transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
                >
                    Solicitar Donación
                </button>
            </div>
        )}
      </div>
    </div>
  );
};

export default DetallesCardDonacion;