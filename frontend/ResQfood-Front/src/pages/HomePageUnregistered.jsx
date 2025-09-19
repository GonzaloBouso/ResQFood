import React from 'react';
import HeroSlider from '../components/home_unregistered/HeroSlider';
import BenefitsSection from '../components/home_unregistered/BenefitsSection';
import HowItWorksSection from '../components/home_unregistered/HowItWorksSection';
import LatestDonationsSection from '../components/home_unregistered/LatestDonationsSection';
const HomePageUnregistered = () => {
  return (
    <div>
      <HeroSlider /> 
      <BenefitsSection />
      <HowItWorksSection />
      <LatestDonationsSection />
       </div>
  );
};

export default HomePageUnregistered;