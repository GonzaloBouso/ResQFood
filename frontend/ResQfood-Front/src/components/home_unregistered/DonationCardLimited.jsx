// src/components/home_unregistered/DonationCardLimited.jsx
import React from 'react';
import { MoreVertical, Info, Send } from 'lucide-react'; // Iconos para opciones, info y solicitar

// Asumimos que los datos de la donación vienen como props
const DonationCardLimited = ({ donation }) => {
  const {
    imageUrl = "https://via.placeholder.com/300x200/E0E0E0/BDBDBD?text=Alimento", // Placeholder si no hay imagen
    donanteNombre = "Donante Anónimo",
    donanteAvatar = "https://via.placeholder.com/40x40/A8D5BA/FFFFFF?Text=A", // Placeholder para avatar
    titulo = "Título del Alimento",
    cantidad = "Cantidad no especificada",
    descripcionCorta = "Descripción breve del alimento para atraer interés...",
  } = donation || {};

  const handleActionClick = (e) => {
    e.preventDefault(); // Prevenir cualquier acción por defecto del enlace/botón
    // Idealmente, aquí se mostraría un modal o se redirigiría a la página de registro/login
    alert("Por favor, regístrate o inicia sesión para ver más detalles o solicitar esta donación.");
  };

  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden flex flex-col h-full group">
      <div className="relative">
        <img 
          src={imageUrl} 
          alt={titulo} 
          className="w-full h-48 object-cover" // Altura fija para la imagen
        />
        {/* Podrías añadir una marca de agua o un efecto de "blur" para usuarios no registrados si lo deseas */}
        {/* <div className="absolute inset-0 bg-black bg-opacity-20 backdrop-blur-sm"></div> */}
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
        <p className="text-xs text-textMuted mb-2">Cantidad: {cantidad}</p>
        <p className="text-sm text-textMuted mb-4 flex-grow text-ellipsis overflow-hidden line-clamp-3">
          {descripcionCorta}
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