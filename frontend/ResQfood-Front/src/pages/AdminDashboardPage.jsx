import React from 'react';

const AdminDashboardPage = () => {
  return (
    <div className="container mx-auto py-10">
      <h1 className="text-4xl font-bold mb-4">Panel de Administrador</h1>
      <p className="text-gray-600 mb-8">
        Bienvenido al área de gestión de ResQFood.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Ejemplo de tarjetas de estadísticas que podemos implementar después */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="font-semibold text-lg">Usuarios Registrados</h3>
          <p className="text-3xl font-bold mt-2">123</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="font-semibold text-lg">Donaciones Activas</h3>
          <p className="text-3xl font-bold mt-2">45</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="font-semibold text-lg">Reportes Pendientes</h3>
          <p className="text-3xl font-bold mt-2 text-red-500">8</p>
        </div>
      </div>
      
      {/* Aquí irían las tablas de gestión */}
      <div className="mt-12">
        <h2 className="text-2xl font-semibold mb-4">Próximamente:</h2>
        <ul className="list-disc list-inside bg-white p-6 rounded-lg shadow">
          <li>Tabla de gestión de usuarios (suspender, cambiar rol)</li>
          <li>Tabla de gestión de reportes</li>
          <li>Visor de historial de cambios (Bitácora)</li>
        </ul>
      </div>
    </div>
  );
};

export default AdminDashboardPage;