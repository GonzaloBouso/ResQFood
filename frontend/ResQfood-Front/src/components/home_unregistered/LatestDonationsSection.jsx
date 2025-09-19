import React, { useState, useEffect } from 'react'; 
import { useNavigate } from 'react-router-dom';
import DonationCardLimited from './DonationCardLimited';
import API_BASE_URL from '../../api/config.js'; 

import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import { Navigation, Pagination } from 'swiper/modules';

const LatestDonationsSection = () => {
  const navigate = useNavigate();
  
 
  const [donations, setDonations] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Usamos useEffect para buscar los datos cuando el componente se monta
  useEffect(() => {
    const fetchPublicDonations = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await fetch(`${API_BASE_URL}/api/donacion/publicas`);
        if (!response.ok) {
          throw new Error('No se pudieron cargar las donaciones.');
        }
        const data = await response.json();
        setDonations(data.donaciones || []);
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPublicDonations();
  }, []); // El array vacío asegura que se ejecute solo una vez

  const handleViewMoreClick = () => {
    navigate('/sign-up');
  };

  // Creamos una función para renderizar el contenido del carrusel
  const renderSwiperContent = () => {
    if (isLoading) {
      return <p className="text-center text-gray-500">Cargando donaciones...</p>;
    }
    if (error) {
      return <p className="text-center text-red-500">Error: {error}</p>;
    }
    if (donations.length === 0) {
      return <p className="text-center text-gray-500">No hay donaciones disponibles en este momento.</p>;
    }
    return (
      <Swiper
        modules={[Navigation, Pagination]}
        spaceBetween={20}
        slidesPerView={1}
        navigation
        pagination={{ clickable: true }}
        breakpoints={{
          640: { slidesPerView: 2, spaceBetween: 20 },
          1024: { slidesPerView: 3, spaceBetween: 30 },
        }}
        className="pb-12"
      >
        {donations.map((donation) => (
          <SwiperSlide key={donation._id}>
            <DonationCardLimited donation={donation} />
          </SwiperSlide>
        ))}
      </Swiper>
    );
  };

  return (
    <section className="py-16 sm:py-20 bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12 sm:mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-textMain">
            Donaciones Recientes
          </h2>
          <p className="mt-4 text-lg text-textMuted max-w-xl mx-auto">
            Echa un vistazo a algunos de los alimentos que se están compartiendo ahora mismo en ResQFood.
          </p>
        </div>

        {/* Renderizamos el contenido del carrusel */}
        {renderSwiperContent()}

        <div className="text-center mt-10">
          <button
            onClick={handleViewMoreClick}
            className="bg-primary hover:bg-brandPrimaryDarker text-white font-semibold py-3 px-10 rounded-lg shadow-md transform transition-transform hover:scale-105 text-lg"
          >
            Ver más y Registrarse
          </button>
        </div>
      </div>
    </section>
  );
};

export default LatestDonationsSection;