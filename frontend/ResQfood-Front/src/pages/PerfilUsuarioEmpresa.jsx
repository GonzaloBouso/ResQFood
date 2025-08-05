import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import HistorialDonacion from '../components/layout/HistorialDonacion';

// Componente interno para mostrar la información del local.
const InfoUsuarioEmpresaDinamico = ({ userData }) => {
  // Verificación robusta de que los datos necesarios existen.
  if (!userData || !userData.localData) {
    return <p className="text-center text-gray-600 py-4">La información de este local no está disponible.</p>;
  }

  // Combinamos las estadísticas de ambas posibles ubicaciones para ser más robustos.
  const estadisticas = userData.localData || userData.estadisticasGenerales;

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
      
      {estadisticas && (
        <section className="border rounded-lg p-6 bg-white shadow">
          <h2 className="text-xl font-semibold text-gray-800 mb-3">Actividad en ResQFood</h2>
           <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-2 text-sm text-gray-700">
            <p><strong>Total Donaciones Realizadas:</strong> {estadisticas.totalDonacionesHechas ?? 0}</p>
            <p><strong>Calificación Promedio:</strong> {estadisticas.calificacionPromedioComoDonante ? `${estadisticas.calificacionPromedioComoDonante.toFixed(1)} ★` : 'Sin calificaciones'}</p>
          </div>
        </section>
      )}
    </div>
  );
};

// Componente principal que maneja los tabs.
const PerfilUsuarioEmpresa = ({ userData }) => {
  const [activeTab, setActiveTab] = useState('info');

  const renderTabContent = () => {
    switch (activeTab) {
      case 'info':
        return <InfoUsuarioEmpresaDinamico userData={userData} />;
      case 'donations':
        // Pasamos el _id del usuario (de MongoDB) al componente de historial.
        return <HistorialDonacion userId={userData?._id} />;
      default:
        return <InfoUsuarioEmpresaDinamico userData={userData} />;
    }
  };

  // El estado de carga principal ya lo maneja el componente padre (UserProfilePage).
  // Esta comprobación es una segunda capa de seguridad.
  if (!userData) {
    return <div className="text-center py-10">Cargando perfil de la empresa...</div>;
  }

  return (
    <div className="max-w-4xl mx-auto py-10 px-4 sm:px-6 lg:px-8">
      <div className="flex flex-col items-center sm:flex-row sm:items-start sm:gap-8 mb-10 p-6 bg-white rounded-xl shadow-lg">
        <div className="w-32 h-32 sm:w-40 sm:h-40 rounded-lg bg-gray-200 overflow-hidden flex-shrink-0 border-4 border-white shadow-md">
          {userData.fotoDePerfilUrl ? (
            <img src={userData.fotoDePerfilUrl} alt={`Logo de ${userData.nombre}`} className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-5xl text-gray-400 bg-gray-100">
              {userData.nombre ? userData.nombre.charAt(0).toUpperCase() : '🏢'}
            </div>
          )}
        </div>
        <div className="text-center sm:text-left mt-6 sm:mt-0">
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-800">{userData.nombre}</h1>
          <p className="text-md text-primary mt-1">{userData.localData?.tipoNegocio || 'Local/Negocio'}</p>
        </div>
      </div>

      <div className="mb-8">
        <div className="flex justify-center border-b border-gray-200">
          <button
            className={`px-4 py-3 text-sm font-medium transition-colors duration-150
                        ${activeTab === 'info' ? 'border-b-2 border-primary text-primary' : 'text-gray-500 hover:text-gray-700'}`}
            onClick={() => setActiveTab('info')}
          >
            Información del Local
          </button>
          <button
            className={`px-4 py-3 text-sm font-medium transition-colors duration-150
                        ${activeTab === 'donations' ? 'border-b-2 border-primary text-primary' : 'text-gray-500 hover:text-gray-700'}`}
            onClick={() => setActiveTab('donations')}
          >
            Historial de Donaciones
          </button>
        </div>
      </div>
      
      <div>
        {renderTabContent()}
      </div>
    </div>
  );
};

export default PerfilUsuarioEmpresa;