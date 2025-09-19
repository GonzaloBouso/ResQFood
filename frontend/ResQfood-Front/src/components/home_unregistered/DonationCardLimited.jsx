import React from 'react';
import { MoreVertical, Info, Send } from 'lucide-react';

const FALLBACK_IMAGE_URL = 'https://via.placeholder.com/300x200/E0E0E0/BDBDBD?text=Alimento';
const FALLBACK_AVATAR_URL = 'https://via.placeholder.com/40x40/A8D5BA/FFFFFF?text=A';

const DonationCardLimited = ({ donation }) => {
  if (!donation) return null;

  const {
    titulo = "Título del Alimento",
    categoria = "Categoría no especificada",
    imagenesUrl,
    donanteId,
  } = donation;


  const imageUrl = imagenesUrl && imagenesUrl.length > 0 ? imagenesUrl[0] : FALLBACK_IMAGE_URL;
  const donanteNombre = donanteId?.nombre || "Donante Anónimo";
  const donanteAvatar = donanteId?.fotoDePerfilUrl || FALLBACK_AVATAR_URL;

  const handleActionClick = (e) => {
    e.preventDefault();
    alert("Por favor, regístrate o inicia sesión para ver más detalles o solicitar esta donación.");
  };

  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden flex flex-col h-full group">
      <div className="relative">
        <img 
          src={imageUrl} 
          alt={titulo} 
          className="w-full h-48 object-cover"
        />
        <div className="absolute top-2 right-2 bg-white bg-opacity-70 p-1.5 rounded-full cursor-pointer hover:bg-opacity-100">
          <MoreVertical size={20} className="text-gray-600" />
        </div>
        <div className="absolute top-2 left-2 flex items-center bg-white bg-opacity-80 px-2 py-1 rounded-md text-xs">
          <img src={donanteAvatar} alt={donanteNombre} className="w-5 h-5 rounded-full mr-1.5 border border-gray-300" />
          <span className="font-medium text-gray-700">{donanteNombre}</span>
        </div>
      </div>

      <div className="p-4 flex flex-col flex-grow">
        <h3 className="text-lg font-semibold text-textMain mb-1 truncate" title={titulo}>
          {titulo}
        </h3>
        
        <p className="text-sm text-textMuted mb-4 flex-grow text-ellipsis overflow-hidden line-clamp-3">
          {categoria}
        </p>
        <div className="mt-auto pt-3 border-t border-gray-200 flex space-x-2">
          <button
            onClick={handleActionClick}
            className="flex-1 text-xs sm:text-sm bg-gray-100 hover:bg-gray-200 text-textMuted font-medium py-2 px-3 rounded-md transition-colors flex items-center justify-center space-x-1.5"
          >
            <Info size={14} />
            <span>Ver más</span>
          </button>
          <button
            onClick={handleActionClick}
            className="flex-1 text-xs sm:text-sm bg-primary/10 hover:bg-primary/20 text-primary font-medium py-2 px-3 rounded-md transition-colors flex items-center justify-center space-x-1.5"
          >
            <Send size={14} />
            <span>Solicitar</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default DonationCardLimited;