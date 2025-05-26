import React from 'react';

const SobreNosotros = () => {
  return (
    <div className="max-w-5xl mx-auto px-4 py-10 space-y-16 text-gray-800">
      
      {/* Misión */}
      <section className="flex flex-col md:flex-row items-center gap-8">
        <div className="md:w-1/2">
          {/* Imagen omitida */}
        </div>
        <div className="md:w-1/2">
          <h2 className="text-2xl font-semibold mb-2">Misión</h2>
          <p className="text-justify">
            "En ResQFood trabajamos para construir un mundo donde los alimentos sean compartidos, no desperdiciados. 
            Nuestra misión es conectar a personas con necesidades con aquellos que desean ayudar, creando una red solidaria que reduzca el desperdicio, 
            fomente la empatía y transforme vidas. Creemos que cada acción cuenta y que juntos podemos marcar una diferencia para las personas y el planeta."
          </p>
        </div>
      </section>

      <hr className="border-t border-gray-300" />

      {/* Visión */}
      <section className="flex flex-col md:flex-row-reverse items-center gap-8">
        <div className="md:w-1/2">
          {/* Imagen omitida */}
        </div>
        <div className="md:w-1/2">
          <h2 className="text-2xl font-semibold mb-2">Visión</h2>
          <p className="text-justify">
            "ResQFood nació para combatir el desperdicio de alimentos y ayudar a quienes más lo necesitan. 
            Inspirados por el impacto de pequeñas acciones, creamos una plataforma que conecta donadores y receptores, 
            promoviendo solidaridad y cuidado por el planeta."
          </p>
        </div>
      </section>

      {/* Nuestros Valores */}
      <section className="text-center space-y-6">
        <h2 className="text-2xl font-semibold">NUESTROS VALORES</h2>
        <div className="flex flex-wrap justify-center gap-6 text-sm font-medium">
          <div>Solidaridad</div>
          <div>Sustentabilidad</div>
          <div>Innovación</div>
          <div>Comunidad</div>
        </div>
      </section>

      {/* Nuestro equipo */}
      <section className="text-center space-y-6">
        <h2 className="text-2xl font-semibold">NUESTRO EQUIPO</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 justify-items-center">
          <div>
            <p className="font-medium">Scrum Master</p>
            <p>Gonzalo Bouso</p>
          </div>
          <div>
            <p className="font-medium">Líder Frontend</p>
            <p>Agustín Iturbe</p>
          </div>
          <div>
            <p className="font-medium">Líder Backend</p>
            <p>Milagros Villafañe</p>
          </div>
          <div>
            <p className="font-medium">Encargado de Testing</p>
            <p>Gonzalo Bouso</p>
          </div>
        </div>
      </section>

      {/* Impacto Esperado */}
      <section className="text-center space-y-6">
        <h2 className="text-2xl font-semibold">Impacto Esperado</h2>
        <div className="flex flex-col md:flex-row justify-center gap-8 text-sm">
          <div className="max-w-xs">
            <p><strong>Reducir el desperdicio de alimentos en un X %</strong></p>
          </div>
          <div className="max-w-xs">
            <p><strong>Ayudar a familias en situación de necesidad</strong></p>
          </div>
          <div className="max-w-xs">
            <p><strong>Crear conciencia sobre el valor de los alimentos</strong></p>
          </div>
        </div>
      </section>

    </div>
  );
};

export default SobreNosotros;
