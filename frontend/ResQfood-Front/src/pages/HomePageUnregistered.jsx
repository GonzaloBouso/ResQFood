// src/pages/HomePageUnregistered.jsx
import React from 'react';
import HeroSlider from '../components/home_unregistered/HeroSlider';
import BenefitsSection from '../components/home_unregistered/BenefitsSection';
const HomePageUnregistered = () => {
  return (
    <div>
      <HeroSlider /> {/* USA el slider */}
      <BenefitsSection />
      
      {/* Aquí irán las siguientes secciones: Beneficios, Cómo Funciona, etc. */}
      {/* <BenefitsSection /> */}
      {/* <HowItWorksSection /> */}
      {/* ... */}
    </div>
  );
};

export default HomePageUnregistered;