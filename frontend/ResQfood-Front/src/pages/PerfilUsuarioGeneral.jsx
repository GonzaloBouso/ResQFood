import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import HistorialDonacion from '../components/layout/HistorialDonacion';
import HistorialRecepcion from '../components/layout/HistorialRecepcion';
import BotonPublicar from '../components/layout/BotonPublicar';

// --- Componente interno para mostrar la información (sin cambios) ---
const InfoUsuarioGeneralDinamico = ({ userData }) => {
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
            <p><strong>Calificación como Donante:</strong> {userData.estadisticasGenerales.calificacionPromedioComoDonante ? `${userData.estadisticasGenerales.calificacionPromedioComoDonante.toFixed(1)} ★` : 'Sin calificaciones'}</p>
            <p><strong>Calificación como Receptor:</strong> {userData.estadisticasGenerales.calificacionPromedioComoReceptor ? `${userData.estadisticasGenerales.calificacionPromedioComoReceptor.toFixed(1)} ★` : 'Sin calificaciones'}</p>
          </div>
        </section>
      )}
    </div>
  );
};


// ==================================================================
// LA SOLUCIÓN: El componente principal ahora es un "componente de visualización".
// Simplemente recibe los datos del usuario a través de `props` y los muestra.
// Ya no tiene lógica propia para buscar datos.
// ==================================================================
const PerfilUsuarioGeneral = ({ userData }) => {
  const [activeTab, setActiveTab] = useState('info');

  const renderTabContent = () => {
    switch (activeTab) {
      case 'info':
        return <InfoUsuarioGeneralDinamico userData={userData} />;
      case 'donations':
        return <HistorialDonacion userId={userData?._id} />;
      case 'receptions':
        return <HistorialRecepcion userId={userData?._id} />;
      default:
        return <InfoUsuarioGeneralDinamico userData={userData} />;
    }
  };

  // La guarda de "cargando" o "error" ya no vive aquí, sino en el componente padre
  // que le pasa las props (MiPerfilPage o UserProfilePage).
  if (!userData) {
    return <div className="text-center py-10">No hay datos de usuario para mostrar.</div>;
  }

  return (
    <div className="max-w-4xl mx-auto py-10 px-4 sm:px-6 lg:px-8">
      <div className="flex flex-col items-center sm:flex-row sm:items-start sm:gap-8 mb-10 p-6 bg-white rounded-xl shadow-lg">
        <div className="w-32 h-32 sm:w-40 sm:h-40 rounded-full bg-gray-200 overflow-hidden flex-shrink-0 border-4 border-white shadow-md">
          {userData.fotoDePerfilUrl ? (
            <img src={userData.fotoDePerfilUrl} alt={`Foto de perfil de ${userData.nombre}`} className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-5xl text-gray-400 bg-gray-100">
              {userData.nombre ? userData.nombre.charAt(0).toUpperCase() : '?'}
            </div>
          )}
        </div>
        <div className="text-center sm:text-left mt-6 sm:mt-0">
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-800">{userData.nombre}</h1>
          <p className="text-md text-primary mt-1">Usuario General</p>
        </div>
      </div>
      <div className="flex justify-center mb-6">
        <BotonPublicar />
      </div>
      <div className="mb-8">
        <div className="flex justify-center border-b border-gray-200">
          <button
            className={`px-4 py-3 text-sm font-medium transition-colors duration-150
                        ${activeTab === 'info' ? 'border-b-2 border-primary text-primary' : 'text-gray-500 hover:text-gray-700'}`}
            onClick={() => setActiveTab('info')}
          >
            Información
          </button>
          <button
            className={`px-4 py-3 text-sm font-medium transition-colors duration-150
                        ${activeTab === 'donations' ? 'border-b-2 border-primary text-primary' : 'text-gray-500 hover:text-gray-700'}`}
            onClick={() => setActiveTab('donations')}
          >
            Donaciones Hechas
          </button>
          <button
            className={`px-4 py-3 text-sm font-medium transition-colors duration-150
                        ${activeTab === 'receptions' ? 'border-b-2 border-primary text-primary' : 'text-gray-500 hover:text-gray-700'}`}
            onClick={() => setActiveTab('receptions')}
          >
            Donaciones Recibidas
          </button>
        </div>
      </div>
      <div>
        {renderTabContent()}
      </div>
    </div>
  );
};

export default PerfilUsuarioGeneral;