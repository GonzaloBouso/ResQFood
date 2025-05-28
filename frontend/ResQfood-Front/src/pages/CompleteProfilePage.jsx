import React from 'react';

const CompleteProfilePage = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl sm:text-3xl font-bold text-textMain mb-6 text-center">
        Completa tu Perfil
      </h1>
      <p className="text-center text-textMuted mb-8">
        Necesitamos un poco más de información para configurar tu cuenta ResQFood.
      </p>
      {/* Aquí irá el formulario */}
      <div className="max-w-lg mx-auto bg-white p-6 sm:p-8 rounded-lg shadow-md">
        <p className="text-center">Formulario para seleccionar rol y completar datos irá aquí.</p>
      </div>
    </div>
  );
};

export default CompleteProfilePage;