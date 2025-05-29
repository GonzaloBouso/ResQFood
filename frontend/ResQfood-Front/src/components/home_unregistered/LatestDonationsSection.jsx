// src/components/home_unregistered/LatestDonationsSection.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import DonationCardLimited from './DonationCardLimited'; // Importa la tarjeta

// Import Swiper React components & styles (si aún no están importados globalmente)
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import { Navigation, Pagination } from 'swiper/modules'; // Solo Navigation y Pagination aquí

// Datos de donaciones de ejemplo (deberían venir de una API en el futuro)
const sampleDonations = [
  { id: 1, titulo: 'Hamburguesa Completa', cantidad: '1 unidad', descripcionCorta: 'Deliciosa hamburguesa con queso cheddar, lechuga fresca, tomate y pan artesanal. ¡Lista para disfrutar!', imageUrl: 'https://plus.unsplash.com/premium_photo-1664648005519-3d1708d8ded6?q=80&w=800&auto=format&fit=crop', donanteNombre: 'Juan P.' },
  { id: 2, titulo: 'Pan Casero Fresco', cantidad: '2 hogazas', descripcionCorta: 'Pan recién horneado, ideal para acompañar tus comidas o para un rico desayuno. Sin conservantes.', imageUrl: 'https://images.unsplash.com/photo-1509440159596-0ca480e54e6c?q=80&w=800&auto=format&fit=crop', donanteNombre: 'Ana G.' },
  { id: 3, titulo: 'Frutas de Estación', cantidad: '1 bolsa (aprox 1kg)', descripcionCorta: 'Variedad de frutas frescas de temporada: manzanas, bananas y naranjas. Perfectas para un snack saludable.', imageUrl: 'https://images.unsplash.com/photo-1593280464608-3a3e06934218?q=80&w=800&auto=format&fit=crop', donanteNombre: 'Carlos S.' },
  { id: 4, titulo: 'Porción de Lasaña', cantidad: '1 porción grande', descripcionCorta: 'Lasaña casera de carne y verduras, abundante y sabrosa. Calentar y listo.', imageUrl: 'https://images.unsplash.com/photo-1574894709920-31b297c1c4e0?q=80&w=800&auto=format&fit=crop', donanteNombre: 'Lucía M.' },
  // Añade más donaciones de ejemplo si quieres
];

const LatestDonationsSection = () => {
  const navigate = useNavigate();

  const handleViewMoreClick = () => {
    // Redirigir a la página de registro/login
    navigate('/sign-up'); // O a /sign-in, o mostrar un modal
  };

  return (
    <section className="py-16 sm:py-20 bg-white"> {/* O bg-gray-50 si quieres un fondo diferente */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12 sm:mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-textMain">
            Donaciones Recientes
          </h2>
          <p className="mt-4 text-lg text-textMuted max-w-xl mx-auto">
            Echa un vistazo a algunos de los alimentos que se están compartiendo ahora mismo en ResQFood.
          </p>
        </div>

        <Swiper
          modules={[Navigation, Pagination]}
          spaceBetween={20} // Espacio entre slides
          slidesPerView={1} // Slides visibles por defecto (móvil)
          navigation
          pagination={{ clickable: true }}
          breakpoints={{
            // Cuando el ancho de la ventana es >= 640px (sm)
            640: {
              slidesPerView: 2,
              spaceBetween: 20,
            },
            // Cuando el ancho de la ventana es >= 1024px (lg)
            1024: {
              slidesPerView: 3,
              spaceBetween: 30,
            },
          }}
          className="pb-12" // Padding inferior para que la paginación no se pegue al botón de abajo
        >
          {sampleDonations.map((donation) => (
            <SwiperSlide key={donation.id} className="pb-4"> {/* pb-4 en el slide para espacio si la sombra es grande */}
              <DonationCardLimited donation={donation} />
            </SwiperSlide>
          ))}
        </Swiper>

        <div className="text-center mt-10">
          <button
            onClick={handleViewMoreClick}
            className="bg-primary hover:bg-brandPrimaryDarker text-white font-semibold py-3 px-10 rounded-lg shadow-md transform transition-transform hover:scale-105 text-lg"
          >
            Ver más Donaciones
          </button>
        </div>
      </div>
    </section>
  );
};

export default LatestDonationsSection;