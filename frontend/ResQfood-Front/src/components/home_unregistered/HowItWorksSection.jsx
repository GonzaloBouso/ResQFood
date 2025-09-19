// src/components/home_unregistered/HowItWorksSection.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';

// 1. IMPORTA TUS IMÁGENES PARA LOS PASOS
import step1Image from '../../assets/Recurso-UserPlus.png'; // Reemplaza con tus nombres de archivo reales
import step2Image from '../../assets/Recurso-Frutas.png';
import step3Image from '../../assets/Recurso-Mensaje.png';
import step4Image from '../../assets/Recurso-Corazon2.png';

const stepsData = [
  {
    id: 1,
    imageSrc: step1Image,
    title: 'Regístrate',
    description: 'Como usuario general o local. ¡Es gratis y rápido!',
  },
  {
    id: 2,
    imageSrc: step2Image,
    title: 'Publica o Solicita',
    description: 'Ofrece los alimentos que no necesitas o busca donaciones disponibles cerca de tu ubicación.',
  },
  {
    id: 3,
    imageSrc: step3Image,
    title: 'Coordina',
    description: 'Comunícate de forma segura para acordar la entrega de los alimentos.',
  },
  {
    id: 4,
    imageSrc: step4Image,
    title: '¡Reduce el Desperdicio!',
    description: 'Contribuye al medio ambiente y ayuda a quienes más lo necesitan en tu comunidad.',
  },
];

const HowItWorksSection = () => {
  const navigate = useNavigate();

  return (
    <section className="py-16 sm:py-20 bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12 sm:mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-textMain">
            ¿Cómo Funciona ResQFood?
          </h2>
          <p className="mt-4 text-lg text-textMuted max-w-2xl mx-auto">
            Empezar a compartir y recibir es muy fácil. Sigue estos simples pasos:
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 sm:gap-10">
          {stepsData.map((step) => (
            <div 
              key={step.id} 
              className="flex flex-col items-center text-center p-4" // Reducido p-6 a p-4 si las imágenes son el foco
            >
              {/* NÚMERO DEL PASO (opcional, si tus imágenes no lo incluyen) */}
              <div className="flex items-center justify-center w-12 h-12 mb-4 bg-primary text-white rounded-full text-xl font-bold shadow-md">
                {step.id}
              </div>

              {/* IMAGEN DEL PASO */}
              <div className="mb-4"> {/* Puedes ajustar el margen inferior */}
                <img 
                  src={step.imageSrc} 
                  alt={`Paso ${step.id}: ${step.title}`} 
                  className="h-24 w-24 mx-auto object-contain" // Ajusta h- y w- según el tamaño de tus imágenes
                                                                // object-contain asegura que toda la imagen se vea
                />
              </div>
              
              <h3 className="text-xl font-semibold text-textMain mb-2">
                {step.title}
              </h3>
              <p className="text-sm text-textMuted leading-relaxed">
                {step.description}
              </p>
            </div>
          ))}
        </div>

        <div className="text-center mt-12 sm:mt-16">
          <button
            onClick={() => navigate('/sign-up')}
            className="bg-primary hover:bg-brandPrimaryDarker text-white font-semibold py-3 px-10 rounded-lg shadow-md transform transition-transform hover:scale-105 text-lg"
          >
            Regístrate Ahora
          </button>
        </div>
      </div>
    </section>
  );
};

export default HowItWorksSection;