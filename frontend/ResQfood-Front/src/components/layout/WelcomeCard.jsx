import React from 'react';
import { useNavigate } from 'react-router-dom';


const WelcomeCard = ({ userName }) => {
  const navigate = useNavigate();

  
  const handlePublishClick = () => {
    navigate('/publicar-donacion');
  };

  
  const handleExploreClick = () => {
    const donationsSection = document.getElementById('donaciones-cercanas');
    if (donationsSection) {
      donationsSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="bg-gradient-to-br from-green-50 to-cyan-50 p-6 rounded-2xl shadow-md w-full max-w-4xl mx-auto text-center mb-12">
      <div className="flex flex-col md:flex-row items-center justify-between gap-6">
        {/* Saludo y Texto */}
        <div className="text-left">
          <p className="text-2xl sm:text-3xl font-bold text-gray-800">
            <span role="img" aria-label="wave" className="mr-2">👋</span>
            ¡Hola, {userName}!
          </p>
          <p className="text-gray-600 mt-2">
            ¿Listo para compartir y recibir alimentos hoy?
          </p>
        </div>

        {/* Botones de Acción */}
        <div className="flex flex-col sm:flex-row gap-3">
          <button
            onClick={handlePublishClick}
            className="bg-primary text-white font-semibold py-3 px-6 rounded-lg shadow-sm hover:bg-brandPrimaryDarker transition-transform transform hover:scale-105"
          >
            Publicar una donación
          </button>
          <button
            onClick={handleExploreClick}
            className="bg-gray-700 text-white font-semibold py-3 px-6 rounded-lg shadow-sm hover:bg-gray-800 transition-transform transform hover:scale-105"
          >
            Explorar donaciones cerca de ti
          </button>
        </div>
      </div>
    </div>
  );
};

export default WelcomeCard;