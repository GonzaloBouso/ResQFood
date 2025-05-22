import React from 'react';

const InfoUsuarioEmpresa = () => {
  return (
    <div className="space-y-4">
      <section className="border rounded-lg p-4 bg-white shadow-sm">
        <h2 className="font-semibold text-gray-800 mb-2">Información básica</h2>
        <p><strong>Nombre empresa:</strong> La estrella</p>
        <p><strong>Horarios:</strong> </p>
      </section>

      <section className="border rounded-lg p-4 bg-white shadow-sm">
        <h2 className="font-semibold text-gray-800 mb-2">Información de contacto</h2>
        <p><strong>Correo electrónico:</strong> estrella@email.com</p>
        <p><strong>Teléfono:</strong> 123456789</p>
      </section>

      <section className="border rounded-lg p-4 bg-white shadow-sm">
        <h2 className="font-semibold text-gray-800 mb-2">Dirección</h2>
        <p><strong>Provincia:</strong> Buenos Aires</p>
        <p><strong>Localidad:</strong> Quilmes</p>
        <p><strong>Ciudad:</strong> Quilmes Oeste</p>
        <p><strong>Direccion:</strong> Quilmes Oeste</p>
      </section>
    </div>
  );
};

export default InfoUsuarioEmpresa;
