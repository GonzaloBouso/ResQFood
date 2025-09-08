import React from 'react';
import { Camera, Edit2 } from 'lucide-react';
import BotonPublicar from '../layout/BotonPublicar';

const PerfilGeneralView = ({ userData, isEditable, onEditPhotoClick, onEditInfoClick }) => {
  if (!userData) {
    return <div className="text-center py-10">Cargando...</div>;
  }

  return (
    <div>
    
      <div className="relative flex flex-col items-center sm:flex-row sm:items-start sm:gap-8 p-4 sm:p-6 bg-white rounded-xl shadow-lg">
        <div className="relative w-32 h-32 sm:w-40 sm:h-40 flex-shrink-0">
          <div className="w-full h-full rounded-full bg-gray-200 overflow-hidden border-4 border-white shadow-md">
            {userData.fotoDePerfilUrl ? (
              <img src={userData.fotoDePerfilUrl} alt={`Foto de ${userData.nombre}`} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-5xl text-gray-400 bg-gray-100">
                {userData.nombre ? userData.nombre.charAt(0).toUpperCase() : '?'}
              </div>
            )}
          </div>
          {isEditable && (
            <button
              onClick={onEditPhotoClick}
              className="absolute inset-0 bg-black/50 text-white flex items-center justify-center rounded-full opacity-0 hover:opacity-100 transition-opacity duration-300"
              title="Cambiar foto de perfil"
            >
              <Camera size={32} />
            </button>
          )}
        </div>

        <div className="text-center sm:text-left mt-4 sm:mt-0 flex-grow">
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-800 break-words">{userData.nombre}</h1>
          <p className="text-md text-primary mt-1">Usuario General</p>
        </div>

        {isEditable && (
          <div className="w-full sm:w-auto mt-4 sm:mt-0 sm:absolute sm:top-4 sm:right-4">
            <button 
              onClick={onEditInfoClick}
              className="w-full sm:w-auto flex items-center justify-center gap-2 px-3 py-2 text-xs font-medium text-gray-700 bg-gray-50 border rounded-md shadow-sm hover:bg-gray-100 transition-colors"
            >
              <Edit2 size={14} />
              Editar Perfil
            </button>
          </div>
        )}
      </div>

      
      {isEditable && (
        <div className="flex justify-center mt-6">
          <BotonPublicar />
        </div>
      )}
    </div>
  );
};

export default PerfilGeneralView;