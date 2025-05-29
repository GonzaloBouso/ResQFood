import React from 'react';

import mision from '../assets/mision.png'
import vision from '../assets/vision.png'
import nuestrosValores from '../assets/nuestrosValores.png'
import nuestroEquipo from '../assets/nuestroEquipo.png'
import impacctoEsperado from '../assets/impacctoEsperado.png'


const SobreNosotros = ()=>{
  return(
    <div className='bg-white min-h-screen py-8 sm:py-12 font-sans'>
      <div className='container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl'>


    {/*Sección Misión */}

        <section className='flex flex-col md:flex-row items-center gap-6 md:gap-10 mb-12 md:mb-16'>
          <div className='md:w-2/5 flex justify-center md:justify-start'>
          <img src={mision} alt="Misión de ResQFood" className='max-w-xs sm:max-w-sm w-full h-auto rounded-lg object-contain' />
          </div>
          <div className='md:w-3/5 text-center md:text-left'>
          <h2 className='text-2xl sm:text-3xl font-bold text-gray-800 mb-3 sm:mb-4'>
            Misión
          </h2>
          <p className='text-gray-700 leading-relaxed text-sm sm:text-base'>"En ResQfood trabajamos para construir un mundo donde los
              alimentos sean valorados y aprovechados al máximo. Nuestra
              misión es conectar a personas que desean donar con aquellas
              que desean ayudar, creando una red solidaria que reduzca el
              desperdicio, fomente la empatía y transforme vidas. Creemos
              que cada acción cuenta y que juntos podemos marcar una
              diferencia para las personas y el planeta"</p>
          </div>
        </section>
    
    {/*Sección Visión */}
          <section className='flex flex-col md:flex-row items-center gap-6 md:gap-10 mb-12 md:mb-16'>
            <div className='md:w-3/5 text-center md:text-left order-2 md:order-1'>
            <h2 className='text-2xl sm:text-3xl font-bold text-gray-800 mb-3 sm:mb-4'>
              Visión
            </h2>
            <p className='text-gray-700 leading-relaxed text-sm sm:text-base'>
               "ResQfood nació para combatir el desperdicio de alimentos y
              ayudar a quienes más lo necesitan. Imaginamos un futuro en el
              que ninguna comida apta para el consumo se desperdicie,
              sino que llegue a manos de organizaciones y receptores,
              promoviendo solidaridad y cuidado por el planeta."
            </p>
            </div>
            <div className='md:w-2/5 flex justify-center md:justify-end order-1 md:order-2'>
              <img src={vision} alt="Visión de ResQfood" className="max-w-xs sm:max-w-sm w-full h-auto rounded-lg object-contain" />
            </div>
          </section>

          {/*Sección Nuestros Valores */}
          <section className='mb-12 md:mb-16 text-center'>
            <img 
            src={nuestrosValores} 
            alt="Nuestros Valores: Solidaridad, Sustentabilidad, Innovación, Comunidad" 
            className="w-full max-w-2xl mx-auto h-auto rounded-lg" 
          />
          </section>

          {/*Sección Nuestro Equipo */}
          <section className='mb-12 md:mb-16 text-center'>
            <img src={nuestroEquipo} 
            alt="Nuestro Equipo: Scrum Master, Líder Frontend, Líder Backend, Encargado de Testing" 
            className="w-full max-w-3xl mx-auto h-auto rounded-lg" />
          </section>

          {/*Sección Impacto Esperado */}
          <section className='text-center mb-8 sm:mb-12'>
            <img src={impacctoEsperado} 
            alt="Impacto Esperado: Reducir desperdicio, Ayudar familias, Crear conciencia" 
            className="w-full max-w-2xl mx-auto h-auto rounded-lg" />
          </section>


      </div>
    </div>
  );
};

export default SobreNosotros;
