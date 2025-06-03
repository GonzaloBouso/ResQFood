// src/pages/PerfilUsuarioEmpresa.jsx
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import HistorialDonacion from '../components/layout/HistorialDonacion';
// import EditarPerfilEmpresaModal from '../components/modals/EditarPerfilEmpresaModal'; // Si tienes un modal para editar

// Componente interno para mostrar la información de la empresa de forma dinámica
const InfoUsuarioEmpresaDinamico = ({ userData }) => {
  if (!userData || !userData.localData) return <p className="text-center text-gray-600 py-4">Cargando información de la empresa...</p>;

  return (
    <div className="space-y-6">
      <section className="border rounded-lg p-6 bg-white shadow">
        <h2 className="text-xl font-semibold text-gray-800 mb-3">Información del Local</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-2 text-sm text-gray-700">
          <p><strong>Nombre del Local:</strong> {userData.nombre || 'No disponible'}</p>
          <p><strong>Tipo de Negocio:</strong> {userData.localData.tipoNegocio || 'No especificado'}</p>
          <p><strong>Horario de Atención:</strong> {userData.localData.horarioAtencion || 'No especificado'}</p>
          <p className="md:col-span-2"><strong>Descripción:</strong> {userData.localData.descripcionEmpresa || 'No especificada'}</p>
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
      
      {userData.localData && ( // Asumiendo que las estadísticas de donante están en localData según tu modelo
        <section className="border rounded-lg p-6 bg-white shadow">
          <h2 className="text-xl font-semibold text-gray-800 mb-3">Actividad en ResQFood</h2>
           <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-2 text-sm text-gray-700">
            <p><strong>Total Donaciones Realizadas:</strong> {userData.localData.totalDonacionesHechas ?? 0}</p>
            <p><strong>Calificación Promedio:</strong> {userData.localData.calificacionPromedioComoDonante ? `${userData.localData.calificacionPromedioComoDonante.toFixed(1)} ★` : 'Sin calificaciones'}</p>
          </div>
        </section>
      )}
    </div>
  );
};


const PerfilUsuarioEmpresa = ({ userData }) => {
  const [activeTab, setActiveTab] = useState('info');
  // const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const renderTabContent = () => {
    switch (activeTab) {
      case 'info':
        return <InfoUsuarioEmpresaDinamico userData={userData} />;
      case 'donations':
        return <HistorialDonacion userId={userData?._id || userData?.clerkUserId} />; // Pasa el ID para filtrar
      default:
        return <InfoUsuarioEmpresaDinamico userData={userData} />;
    }
  };

  if (!userData) {
    return <div className="text-center py-10">Cargando perfil de la empresa...</div>;
  }

  return (
    <div className="max-w-4xl mx-auto py-10 px-4 sm:px-6 lg:px-8">
      <div className="flex flex-col items-center sm:flex-row sm:items-start sm:gap-8 mb-10 p-6 bg-white rounded-xl shadow-lg">
        <div className="w-32 h-32 sm:w-40 sm:h-40 rounded-lg bg-gray-200 overflow-hidden flex-shrink-0 border-4 border-white shadow-md"> {/* Cambiado a rounded-lg para empresas */}
          {userData.fotoDePerfilUrl ? (
            <img src={userData.fotoDePerfilUrl} alt={`Logo de ${userData.nombre}`} className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-5xl text-gray-400 bg-gray-100">
              {/* Icono de Tienda o primera letra */}
              {userData.nombre ? userData.nombre.charAt(0).toUpperCase() : '🏢'}
            </div>
          )}
        </div>
        <div className="text-center sm:text-left mt-6 sm:mt-0">
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-800">{userData.nombre}</h1>
          <p className="text-md text-primary mt-1">{userData.localData?.tipoNegocio || 'Local/Negocio'}</p>
          {/* Calificación Promedio del Local */}
          {/* {userData.localData?.calificacionPromedioComoDonante && (
            <div className="flex items-center justify-center sm:justify-start gap-2 mt-3 text-sm">
              <div className="flex text-yellow-400 text-xl">
                 {'★'.repeat(Math.round(userData.localData.calificacionPromedioComoDonante || 0))}
                 {'☆'.repeat(5 - Math.round(userData.localData.calificacionPromedioComoDonante || 0))}
              </div>
              <Link to={`/opiniones/${userData.clerkUserId}`} className="text-gray-600 hover:text-primary transition-colors">
                Ver opiniones ({userData.localData.numeroCalificacionesComoDonante || 0})
              </Link>
            </div>
          )} */}
          {/* Botón para editar perfil (opcional) */}
          {/* <button 
            onClick={() => setIsEditModalOpen(true)}
            className="mt-4 px-4 py-2 text-xs font-medium text-primary border border-primary rounded-md hover:bg-primary hover:text-white transition-colors"
          >
            Editar Perfil
          </button> */}
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

      {/* {isEditModalOpen && (
        <EditarPerfilEmpresaModal 
          userData={userData} 
          onClose={() => setIsEditModalOpen(false)} 
          onProfileUpdate={() => {
            // Aquí podrías llamar a una función para refrescar los datos del perfil si es necesario
            // Por ejemplo, si el contexto ProfileStatusContext tiene una función para forzar el refresh.
            // O si la actualización en el modal ya actualiza el estado global.
          }}
        />
      )} */}
    </div>
  );
};

export default PerfilUsuarioEmpresa;