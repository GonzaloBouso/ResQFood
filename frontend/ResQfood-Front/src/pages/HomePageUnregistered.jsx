// src/pages/HomePageUnregistered.jsx
import React from 'react';

const HomePageUnregistered = () => {
  return (
    <div className="text-center py-10">
      <h1 className="text-4xl font-bold text-emerald-700 mb-4">
        Bienvenido a ResQFood
      </h1>
      <p className="text-lg text-gray-600 mb-8 px-4">
        Dale una segunda oportunidad a la comida y ayuda a quienes lo necesitan.
        <br />
        Conéctate, comparte y reduce el desperdicio alimentario en tu comunidad.
      </p>
      <div className="space-x-4">
        {/* Estos botones son placeholders. Los CTAs reales estarán en HeroSection. */}
        <button
          className="bg-emerald-500 hover:bg-emerald-600 text-white font-semibold py-3 px-8 rounded-lg shadow-md transition duration-150 ease-in-out transform hover:scale-105"
          // onClick={() => navigate('/sign-up')} // Necesitaríamos useNavigate de react-router-dom si lo activamos aquí
        >
          Regístrate Gratis
        </button>
        <button
          className="bg-green-500 hover:bg-green-600 text-white font-semibold py-3 px-8 rounded-lg shadow-md transition duration-150 ease-in-out transform hover:scale-105"
          // onClick={() => navigate('/explore')} // Para una futura página de exploración
        >
          Explorar Donaciones
        </button>
      </div>
    </div>
  );
};

export default HomePageUnregistered;