import React from "react";

export default function CardVerInformacion({ titulo, descripcion, imagenUrl, estado, fecha }) {
  return (
    <div className="max-w-sm rounded-lg border border-gray-300 shadow-sm overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3">
        <span className="font-medium text-gray-800 truncate">{titulo}</span>
        <span className="text-xs text-gray-500">{new Date(fecha).toLocaleDateString()}</span>
      </div>

      {/* Imagen */}
      <img
        className="w-full h-48 object-cover"
        src={imagenUrl}
        alt={titulo}
      />

      {/* Contenido */}
      <div className="px-4 py-3 space-y-1">
        <p className="text-sm text-gray-600 truncate">{descripcion}</p>
        <p className="text-xs text-gray-500">Estado: {estado}</p>
      </div>
      <div className="flex justify-center mt-1 mb-5">
        <button className="px-4 py-2 border border-purple-600 text-purple-700 rounded-full text-sm hover:bg-purple-50">
          Ver más información
        </button>
      </div>
    </div>
  );
}
