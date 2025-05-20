import React from "react";

export default function CardVerInformacion() {
  return (
    <div className="max-w-sm rounded-lg border border-gray-300 shadow-sm overflow-hidden">
      {/* Header con avatar y nombre */}
      <div className="flex items-center justify-between px-4 py-3">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-purple-100 text-purple-600 font-semibold rounded-full flex items-center justify-center">
            A
          </div>
          <span className="font-medium text-gray-800">Juan</span>
        </div>
        <button className="text-gray-500 hover:text-gray-700">
          ⋮
        </button>
      </div>

      {/* Imagen del producto */}
      <img
        className="w-full h-48 object-cover"
        src="https://images.unsplash.com/photo-1550547660-d9450f859349" // reemplaza con tu URL
        alt="Hamburguesa"
      />

      {/* Contenido */}
      <div className="px-4 py-3 space-y-1">
        <h2 className="text-lg font-semibold text-gray-800">Hamburguesa</h2>
        <p className="text-sm text-gray-600">Cantidad: 1</p>
        <p className="text-sm text-gray-600">
          Hamburguesa con Chedar, lechuga y tomate
        </p>

        {/* Boton */}
        <div className="flex justify-between mt-3">
          <button className="px-4 py-2 border border-purple-600 text-purple-700 rounded-full text-sm hover:bg-purple-50">
            Ver más información
          </button>
        </div>
      </div>
    </div>
  );
}
