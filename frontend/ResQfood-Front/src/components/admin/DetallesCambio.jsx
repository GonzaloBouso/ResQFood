import React from 'react';

// Función para formatear valores booleanos o nulos a texto legible
const formatValue = (key, value) => {
  if (typeof value === 'boolean') {
    return value ? 'Activo' : 'Suspendido';
  }
  if (value === null || value === undefined) {
    return 'No asignado';
  }
  return String(value);
};

const DetallesCambio = ({ detalles }) => {
  // Si no hay detalles o no hay cambios, muestra un texto alternativo
  if (!detalles || !detalles.antes || !detalles.despues || Object.keys(detalles.despues).length === 0) {
    return <span className="text-gray-400 italic">Sin detalles</span>;
  }

  const clavesCambiadas = Object.keys(detalles.despues);

  return (
    <ul className="text-xs space-y-1.5">
      {clavesCambiadas.map(key => (
        <li key={key} className="flex flex-col">
          <span className="font-semibold capitalize text-gray-700">{key}:</span>
          <div className="pl-2 flex items-center gap-1.5 flex-wrap">
            <span className="bg-red-100 text-red-700 px-1.5 py-0.5 rounded text-center line-through">{formatValue(key, detalles.antes[key])}</span>
            <span className="font-bold text-gray-500">→</span>
            <span className="bg-green-100 text-green-800 font-bold px-1.5 py-0.5 rounded text-center">{formatValue(key, detalles.despues[key])}</span>
          </div>
        </li>
      ))}
    </ul>
  );
};

export default DetallesCambio;