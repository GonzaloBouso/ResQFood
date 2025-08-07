// src/pages/MyDonationsPage.jsx
import React from 'react';
import { Link } from 'react-router-dom';

const MyDonationsPage = () => {
  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">
          Mis Donaciones Activas
        </h1>
        <Link 
          to="/publicar-donacion" 
          className="inline-block bg-primary text-white font-bold py-2 px-4 rounded-lg hover:bg-brandPrimaryDarker transition-colors shadow-sm"
        >
          + Nueva Donación
        </Link>
      </div>

      {/* 
        Este es el espacio donde se mostrarán las donaciones en el futuro.
        Por ahora, está vacio
      */}
      <div className="text-center p-10 bg-gray-50 border-2 border-dashed border-gray-200 rounded-lg">
        <p className="text-gray-500">
          Cuando publiques donaciones, aparecerán aquí.
        </p>
      </div>
    </div>
  );
};

export default MyDonationsPage;