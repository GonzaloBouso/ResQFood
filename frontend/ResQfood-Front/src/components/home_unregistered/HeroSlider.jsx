import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';

import slide1Image from '../../assets/sliderNuevo1.jpg'; 
import slide2Image from '../../assets/sliderNuevo2.jpg';
import slide3Image from '../../assets/sliderNuevo3.jpg';

const slidesData = [
  { 
    id: 1, 
    imageUrl: slide1Image, 
    alt: 'Voluntario donando comida',
    title: 'Conectando Corazones, Compartiendo Alimentos', 
    description: 'Únete a ResQFood y sé parte de una comunidad que combate el desperdicio y ayuda a quienes más lo necesitan.' 
  },
  { 
    id: 2, 
    imageUrl: slide2Image,
    alt: 'Dona alimentos fácilmente', 
    title: 'Publica tus Donaciones Fácilmente', 
    description: 'Conecta con quienes necesitan tus alimentos.' 
  },
  { 
    id: 3, 
    imageUrl: slide3Image,
    alt: 'Encuentra donaciones cerca', 
    title: 'Encuentra Alimentos Gratis Cerca de Ti', 
    description: 'Explora donaciones disponibles en tu zona.' 
  },
];

const HeroSlider = () => {
  return (
    <div className="w-full">
      <Swiper
        modules={[Navigation, Pagination, Autoplay]}
        spaceBetween={0}
        slidesPerView={1}
        navigation
        pagination={{ clickable: true }}
        loop={true}
        autoplay={{
          delay: 8000,
          disableOnInteraction: false,
        }}
        className="hero-slider" 
      >
        {slidesData.map((slide) => (
          <SwiperSlide key={slide.id}>
            <div 
              className="h-[400px] sm:h-[500px] md:h-[550px] lg:h-[600px] w-full bg-cover bg-center relative"
              style={{ backgroundImage: `url(${slide.imageUrl})` }} 
            >
              <div className="absolute inset-0 bg-black bg-opacity-40 flex flex-col items-center justify-center text-center p-4">
                <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-4 leading-tight shadow-text">
                  {slide.title}
                </h2>
                <p className="text-lg sm:text-xl text-gray-200 max-w-xl mx-auto shadow-text">
                  {slide.description}
                </p>
                {/* <button className="mt-6 bg-primary hover:bg-brandPrimaryDarker text-white font-semibold py-3 px-8 rounded-lg shadow-md">
                      Más Información
                    </button> */}
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default HeroSlider;