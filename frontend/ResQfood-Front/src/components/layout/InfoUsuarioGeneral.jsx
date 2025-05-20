import React from 'react';

const InfoUsuarioGeneral = () => {
  return (
    <div className="space-y-4">
      <section className="border rounded-lg p-4 bg-white shadow-sm">
        <h2 className="font-semibold text-gray-800 mb-2">Información básica</h2>
        <p><strong>Nombre:</strong> Agustin Iturbe</p>
        <p><strong>Fecha de nacimiento:</strong> 01/01/1990</p>
        <p><strong>Género:</strong> Masculino</p>
      </section>

      <section className="border rounded-lg p-4 bg-white shadow-sm">
        <h2 className="font-semibold text-gray-800 mb-2">Información de contacto</h2>
        <p><strong>Correo electrónico:</strong> agustin@email.com</p>
        <p><strong>Teléfono:</strong> 123456789</p>
      </section>

      <section className="border rounded-lg p-4 bg-white shadow-sm">
        <h2 className="font-semibold text-gray-800 mb-2">Dirección</h2>
        <p><strong>Provincia:</strong> Buenos Aires</p>
        <p><strong>Localidad:</strong> Quilmes</p>
        <p><strong>Ciudad:</strong> Quilmes Oeste</p>
      </section>
    </div>
  );
};

export default InfoUsuarioGeneral;
