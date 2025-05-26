import React, { useState } from 'react';
import InfoUsuarioGeneral from '../components/layout/InfoUsuarioGeneral';
import HistorialDonacion from '../components/layout/HistorialDonacion';
import HistorialRecepcion from '../components/layout/HistorialRecepcion';

const PerfilUsuarioGeneral = () => {
  const [activeTab, setActiveTab] = useState('info');

  const renderTab = () => {
    switch (activeTab) {
      case 'info':
        return <InfoUsuarioGeneral />;
      case 'donations':
        return <HistorialDonacion />;
      case 'receptions':
        return <HistorialRecepcion />;
      default:
        return <InfoUsuarioGeneral />;
    }
  };

  return (
    <div className="max-w-5xl mx-auto py-10 px-4 sm:px-6 lg:px-8">
      <div className="flex flex-col items-center sm:flex-row sm:items-center sm:gap-6">
        <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-full bg-gray-300" />
        <div className="text-center sm:text-left mt-4 sm:mt-0">
          <h1 className="text-2xl sm:text-3xl font-bold">Agustin Iturbe</h1>
          <div className="flex items-center justify-center sm:justify-start gap-2 mt-2 text-sm">
            <div className="flex text-yellow-500 text-xl">
              {'★★★★★'}
            </div>
            <a href="/opiniones">
            <span className="text-gray-600">ver opiniones</span>
            </a>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex flex-col sm:flex-row justify-center border-b mb-6 mt-8 gap-2 sm:gap-6">
        <button
          className={`pb-2 border-b-2 ${
            activeTab === 'info' ? 'border-purple-500 font-semibold' : 'border-transparent'
          }`}
          onClick={() => setActiveTab('info')}
        >
          Información
        </button>
        <button
          className={`pb-2 border-b-2 ${
            activeTab === 'donations' ? 'border-purple-500 font-semibold' : 'border-transparent'
          }`}
          onClick={() => setActiveTab('donations')}
        >
          Historial de donaciones
        </button>
        <button
          className={`pb-2 border-b-2 ${
            activeTab === 'receptions' ? 'border-purple-500 font-semibold' : 'border-transparent'
          }`}
          onClick={() => setActiveTab('receptions')}
        >
          Historial de recepciones
        </button>
      </div>

      {renderTab()}
    </div>
  );
};

export default PerfilUsuarioGeneral;
