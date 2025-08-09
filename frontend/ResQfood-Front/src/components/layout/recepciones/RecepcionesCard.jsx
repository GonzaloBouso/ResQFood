import React from 'react';

export default function RecepcionCard({ entrega, onClick }) {
  const d = entrega?.donacionId || {};
  const img = d?.imagenesUrl?.[0] || "https://via.placeholder.com/600x400?text=Sin+imagen";
  const titulo = d?.titulo || "Sin título";
  const descripcion = d?.descripcion || "";
  const fecha = entrega?.fechaCompletada || entrega?.fechaCancelada || entrega?.fechaFallida || entrega?.updatedAt;
  const fechaTxt = fecha ? new Date(fecha).toLocaleDateString() : "—";

  return (
    <div className="max-w-sm rounded-lg border border-gray-300 shadow-sm overflow-hidden">
      <div className="flex items-center justify-between px-4 py-3">
        <span className="font-medium text-gray-800 truncate">{titulo}</span>
        <span className="text-xs text-gray-500">{fechaTxt}</span>
      </div>
      <img className="w-full h-48 object-cover" src={img} alt={titulo} />
      <div className="px-4 py-3 space-y-1">
        {descripcion && <p className="text-sm text-gray-600 truncate">{descripcion}</p>}
        <p className="text-xs text-gray-500">Estado entrega: {entrega?.estadoEntrega}</p>
      </div>
      <div className="flex justify-center mt-1 mb-5">
        <button
          type="button"
          className="px-4 py-2 border border-purple-600 text-purple-700 rounded-full text-sm hover:bg-purple-50"
          onClick={onClick}
        >
          Ver más información
        </button>
      </div>
    </div>
  );
}
