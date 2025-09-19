import React from 'react';

import IconAccesoAlimentos from '../../assets/Recurso-Canasta.png'; // Reemplaza con tus nombres de archivo reales
import IconContribucionSocial from '../../assets/Recurso-Corazon.png';
import IconReduccionDesperdicio from '../../assets/Recurso-Planeta.png';
import IconFacilRapido from '../../assets/Recurso-Reloj.png';
import IconMultiDispositivo from '../../assets/Recurso-Celular.png';
import IconRegistroSeguro from '../../assets/Recurso-Candado.png';

const benefitsData = [
  {
    iconSrc: IconAccesoAlimentos, 
    title: 'Acceso a alimentos',
    description: 'Encuentra donaciones disponibles en tu zona de forma sencilla y gratuita.'
  },
  {
    iconSrc: IconContribucionSocial,
    title: 'Contribución social',
    description: 'Ayuda a personas y familias necesitadas de tu comunidad.'
  },
  {
    iconSrc: IconReduccionDesperdicio,
    title: 'Reducción del desperdicio',
    description: 'Colabora en una causa ambiental urgente, evitando que la comida termine en la basura.'
  },
  {
    iconSrc: IconFacilRapido,
    title: 'Fácil y rápido',
    description: 'Publicar o solicitar alimentos solo toma unos segundos.'
  },
  {
    iconSrc: IconMultiDispositivo,
    title: 'Desde cualquier dispositivo',
    description: 'Plataforma responsive, accede desde tu móvil o computadora.'
  },
  {
    iconSrc: IconRegistroSeguro,
    title: 'Registro seguro y datos protegidos',
    description: 'Tus datos están protegidos. Ser parte no cuesta nada.'
  },
];

const BenefitsSection = () => {
  return (
    <section className="py-16 sm:py-20 bg-gray-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12 sm:mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-textMain">
            ¿Por qué ser parte de ResQFood?
          </h2>
          <p className="mt-4 text-lg text-textMuted max-w-2xl mx-auto">
            Únete a una comunidad que transforma el desperdicio en oportunidad. 
            ResQFood conecta donaciones solidarias para compartir alimentos 
            donde más se necesitan.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 sm:gap-10">
          {benefitsData.map((benefit, index) => (
            <div 
              key={index} 
              className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 ease-in-out flex flex-col items-center text-center"
            >
              {/* 3. USA UNA ETIQUETA <img> PARA MOSTRAR EL ÍCONO */}
              <div className="mb-5 p-3 bg-primary/10 rounded-full inline-flex items-center justify-center"> {/* Contenedor del ícono */}
                <img 
                  src={benefit.iconSrc} 
                  alt={`${benefit.title} icon`} // Texto alternativo descriptivo
                  className="h-10 w-10" // Ajusta el tamaño del ícono PNG según necesites (ej. h-10 w-10, h-12 w-12)
                                      // Si tus PNGs no son cuadrados, w-auto podría ser mejor o definir ambos.
                />
              </div>
              <h3 className="text-xl font-semibold text-textMain mb-2">
                {benefit.title}
              </h3>
              <p className="text-sm text-textMuted leading-relaxed">
                {benefit.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default BenefitsSection;