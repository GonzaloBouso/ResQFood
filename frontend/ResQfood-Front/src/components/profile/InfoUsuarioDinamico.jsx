import React from 'react';

export const InfoUsuarioGeneralDinamico = ({ userData }) => {
  if (!userData) return <p className="text-center text-gray-600 py-4">Cargando información del usuario...</p>;

  return (
    <div className="space-y-6">
      <section className="border rounded-lg p-6 bg-white shadow">
        <h2 className="text-xl font-semibold text-gray-800 mb-3">Información Básica</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-2 text-sm text-gray-700">
          <p><strong>Nombre:</strong> {userData.nombre || 'No disponible'}</p>
        </div>
      </section>

      <section className="border rounded-lg p-6 bg-white shadow">
        <h2 className="text-xl font-semibold text-gray-800 mb-3">Información de Contacto</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-2 text-sm text-gray-700">
          <p><strong>Correo Electrónico:</strong> {userData.email || 'No disponible'}</p>
          <p><strong>Teléfono:</strong> {userData.telefono || 'No especificado'}</p>
        </div>
      </section>

      {userData.ubicacion && (
        <section className="border rounded-lg p-6 bg-white shadow">
          <h2 className="text-xl font-semibold text-gray-800 mb-3">Ubicación</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-2 text-sm text-gray-700">
            <p><strong>Dirección:</strong> {userData.ubicacion.direccion || 'No disponible'}</p>
            <p><strong>Ciudad:</strong> {userData.ubicacion.ciudad || 'No disponible'}</p>
            <p><strong>Provincia:</strong> {userData.ubicacion.provincia || 'No disponible'}</p>
            <p><strong>País:</strong> {userData.ubicacion.pais || 'No disponible'}</p>
          </div>
        </section>
      )}

      {userData.estadisticasGenerales && (
        <section className="border rounded-lg p-6 bg-white shadow">
          <h2 className="text-xl font-semibold text-gray-800 mb-3">Actividad en ResQFood</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-2 text-sm text-gray-700">
            <p><strong>Donaciones Realizadas:</strong> {userData.estadisticasGenerales.totalDonacionesHechas ?? 0}</p>
            <p><strong>Donaciones Recibidas:</strong> {userData.estadisticasGenerales.totalDonacionesRecibidas ?? 0}</p>
            <p><strong>Calificación como Donante:</strong> {userData.calificaciones?.promedio ? `${userData.calificaciones.promedio.toFixed(1)} ★` : 'Sin calificaciones'}</p>
            
          </div>
        </section>
      )}
    </div>
  );
};

export const InfoUsuarioEmpresaDinamico = ({ userData }) => {
  if (!userData || !userData.localData) return <p className="text-center text-gray-600 py-4">La información de este local no está disponible.</p>;
  
  return (
    <div className="space-y-6">
      <section className="border rounded-lg p-6 bg-white shadow">
        <h2 className="text-xl font-semibold text-gray-800 mb-3">Información del Local</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-2 text-sm text-gray-700">
          <p><strong>Nombre del Local:</strong> {userData.nombre || 'No disponible'}</p>
          <p><strong>Tipo de Negocio:</strong> {userData.localData.tipoNegocio || 'No especificado'}</p>
          <p><strong>Horario de Atención:</strong> {userData.localData.horarioAtencion || 'No especificado'}</p>
          <p className="md:col-span-2"><strong>Descripción:</strong> {userData.localData.descripcionEmpresa || 'Sin descripción.'}</p>
        </div>
      </section>
      <section className="border rounded-lg p-6 bg-white shadow">
        <h2 className="text-xl font-semibold text-gray-800 mb-3">Información de Contacto</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-2 text-sm text-gray-700">
          <p><strong>Correo Electrónico:</strong> {userData.email || 'No disponible'}</p>
          <p><strong>Teléfono:</strong> {userData.telefono || 'No especificado'}</p>
        </div>
      </section>
      {userData.ubicacion && (
        <section className="border rounded-lg p-6 bg-white shadow">
          <h2 className="text-xl font-semibold text-gray-800 mb-3">Ubicación</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-2 text-sm text-gray-700">
            <p><strong>Dirección:</strong> {userData.ubicacion.direccion || 'No disponible'}</p>
            <p><strong>Ciudad:</strong> {userData.ubicacion.ciudad || 'No disponible'}</p>
            <p><strong>Provincia:</strong> {userData.ubicacion.provincia || 'No disponible'}</p>
            <p><strong>País:</strong> {userData.ubicacion.pais || 'No disponible'}</p>
          </div>
        </section>
      )}
      {userData.estadisticasGenerales && (
        <section className="border rounded-lg p-6 bg-white shadow">
          <h2 className="text-xl font-semibold text-gray-800 mb-3">Actividad en ResQFood</h2>
           <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-2 text-sm text-gray-700">
            <p><strong>Total Donaciones Realizadas:</strong> {userData.estadisticasGenerales.totalDonacionesHechas ?? 0}</p>
            <p><strong>Calificación Promedio:</strong> {userData.calificaciones?.promedio ? `${userData.calificaciones.promedio.toFixed(1)} ★` : 'Sin calificaciones'}</p>
          </div>
        </section>
      )}
    </div>
  );
};