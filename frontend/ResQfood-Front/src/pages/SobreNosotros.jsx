import React from "react";
import { motion } from "framer-motion";

import mision from "../assets/mision.png";
import vision from "../assets/vision.png";
import nuestrosValores from "../assets/nuestrosValores.png";
import nuestroEquipo from "../assets/nuestroEquipo.png";
import impactoEsperado from "../assets/impactoEsperado.png";

const SobreNosotros = () => {
  return (
    <div className="bg-gradient-to-b from-white via-gray-50 to-white min-h-screen py-12 font-sans">
      <div className="container mx-auto px-6 lg:px-12 max-w-6xl space-y-20">
        
        {/* Sección Misión */}
        <motion.section
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="flex flex-col md:flex-row items-center gap-10"
        >
          <div className="md:w-2/5 flex justify-center">
            <img
              src={mision}
              alt="Misión de ResQFood"
              className="max-w-sm w-full h-auto rounded-2xl shadow-lg hover:scale-105 transition-transform"
            />
          </div>
          <div className="md:w-3/5 text-center md:text-left">
            <h2 className="text-4xl font-extrabold text-gray-900 mb-4">
              🌍 Misión
            </h2>
            <p className="text-gray-700 leading-relaxed text-lg">
              “En ResQfood trabajamos para construir un mundo donde los
              alimentos sean valorados y aprovechados al máximo. Nuestra misión
              es conectar a personas que desean donar con aquellas que desean
              ayudar, creando una red solidaria que reduzca el desperdicio,
              fomente la empatía y transforme vidas.”
            </p>
          </div>
        </motion.section>

        {/* Sección Visión */}
        <motion.section
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          viewport={{ once: true }}
          className="flex flex-col md:flex-row items-center gap-10"
        >
          <div className="md:w-3/5 text-center md:text-left order-2 md:order-1">
            <h2 className="text-4xl font-extrabold text-gray-900 mb-4">
              ✨ Visión
            </h2>
            <p className="text-gray-700 leading-relaxed text-lg">
              “ResQfood nació para combatir el desperdicio de alimentos y ayudar
              a quienes más lo necesitan. Imaginamos un futuro en el que ninguna
              comida apta para el consumo se desperdicie, sino que llegue a
              manos de organizaciones y receptores.”
            </p>
          </div>
          <div className="md:w-2/5 flex justify-center order-1 md:order-2">
            <img
              src={vision}
              alt="Visión de ResQFood"
              className="max-w-sm w-full h-auto rounded-2xl shadow-lg hover:scale-105 transition-transform"
            />
          </div>
        </motion.section>

        {/* Nuestros Valores */}
        <motion.section
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <h2 className="text-4xl font-extrabold text-gray-900 mb-6">
            🤝 Nuestros Valores
          </h2>
          <img
            src={nuestrosValores}
            alt="Nuestros Valores"
            className="w-full max-w-3xl mx-auto rounded-2xl shadow-lg hover:scale-105 transition-transform"
          />
        </motion.section>

        {/* Nuestro Equipo */}
        <motion.section
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <h2 className="text-4xl font-extrabold text-gray-900 mb-6">
            👥 Nuestro Equipo
          </h2>
          <img
            src={nuestroEquipo}
            alt="Nuestro Equipo"
            className="w-full max-w-4xl mx-auto rounded-2xl shadow-lg hover:scale-105 transition-transform"
          />
        </motion.section>

        {/* Impacto Esperado */}
        <motion.section
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <h2 className="text-4xl font-extrabold text-gray-900 mb-6">
            🌱 Impacto Esperado
          </h2>
          <img
            src={impactoEsperado}
            alt="Impacto Esperado"
            className="w-full max-w-3xl mx-auto rounded-2xl shadow-lg hover:scale-105 transition-transform"
          />
        </motion.section>
      </div>
    </div>
  );
};

export default SobreNosotros;
