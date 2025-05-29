// src/pages/HomePageUnregistered.jsx
import React from 'react';
import HeroSlider from '../components/home_unregistered/HeroSlider'; // IMPORTA el slider
// ... (otras importaciones si las tienes para BenefitsSection, etc.)

const HomePageUnregistered = () => {
  return (
    <div>
      <HeroSlider /> {/* USA el slider */}
      
      {/* Aquí irán las siguientes secciones: Beneficios, Cómo Funciona, etc. */}
      {/* <BenefitsSection /> */}
      {/* <HowItWorksSection /> */}
      {/* ... */}
    </div>
  );
};

export default HomePageUnregistered;