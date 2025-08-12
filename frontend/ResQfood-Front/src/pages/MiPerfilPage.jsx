import React, { useContext, useState } from 'react';
import { ProfileStatusContext } from '../context/ProfileStatusContext';
import { Camera, Edit2 } from 'lucide-react';

// Importamos los componentes de visualización
import PerfilEmpresaView from '../components/profile/PerfilEmpresaView';
import PerfilGeneralViewS from '../components/profile/PerfilGeneralView';

// Importamos los modales
import ChangePhotoProfileModal from '../components/layout/ChangePhotoProfileModal';
import EditarPerfilModal from '../components/profile/EditarPerfilModal';

const MiPerfilPage = () => {
  const { currentUserDataFromDB, isLoadingUserProfile, updateProfileState } = useContext(ProfileStatusContext);
  
  const [isPhotoModalOpen, setIsPhotoModalOpen] = useState(false);
  const [isInfoModalOpen, setIsInfoModalOpen] = useState(false);

  if (isLoadingUserProfile) {
    return <div className="text-center py-20">Cargando tu perfil...</div>;
  }
  if (!currentUserDataFromDB) {
    return <div className="text-center py-20">No se pudo cargar la información de tu perfil.</div>;
  }

  const handleUploadSuccess = (updatedUser) => {
    updateProfileState(updatedUser);
    setIsPhotoModalOpen(false); 
  };
  
  const handleProfileUpdate = (updatedUser) => {
    updateProfileState(updatedUser);
    setIsInfoModalOpen(false);
  };

  // Decidimos qué componente de visualización usar
  const ProfileComponentToRender = currentUserDataFromDB.rol === 'LOCAL' 
    ? PerfilEmpresaView 
    : PerfilGeneralViewS;

  return (
    // LA SOLUCIÓN:
    // 1. El contenedor principal necesita ser 'relative' para que los botones
    //    posicionados de forma 'absolute' se posicionen en relación a él.
    <div className="relative">
      
      {/* Renderizamos el componente de perfil normal, que no tiene botones */}
      <ProfileComponentToRender userData={currentUserDataFromDB} />

      {/* 
        2. Añadimos los botones de edición superpuestos.
           Usamos un z-index alto (ej. z-10) para asegurar que estén por encima de todo.
      */}
      
      {/* Botón para Editar Información */}
      <div className="absolute top-10 right-4 z-10">
          <button 
            onClick={() => setIsInfoModalOpen(true)}
            className="flex items-center gap-2 px-3 py-2 text-xs font-medium text-gray-700 bg-white border rounded-lg shadow-sm hover:bg-gray-50 transition-colors"
          >
            <Edit2 size={14} />
            Editar Perfil
          </button>
      </div>

      {/* Botón para Cambiar Foto, posicionado sobre el área de la foto */}
      {/* La clave es usar los mismos valores de posicionamiento que usa el perfil, más un z-index */}
      <div className="absolute top-10 left-1/2 -translate-x-1/2 sm:left-auto sm:right-auto sm:translate-x-0 sm:ml-[1.5rem] z-10">
         <div className="relative w-32 h-32 sm:w-40 sm:h-40">
            <button
              onClick={() => setIsPhotoModalOpen(true)}
              className="absolute inset-0 bg-black/50 text-white flex items-center justify-center rounded-full opacity-0 hover:opacity-100 transition-opacity duration-300"
              title="Cambiar foto de perfil"
            >
              <Camera size={32} />
            </button>
         </div>
      </div>
      
      {/* Renderizado de los modales */}
      {isPhotoModalOpen && (
        <ChangePhotoProfileModal 
          onClose={() => setIsPhotoModalOpen(false)} 
          onUploadSuccess={handleUploadSuccess}
        />
      )}

      {isInfoModalOpen && (
        <EditarPerfilModal 
          userData={currentUserDataFromDB}
          onClose={() => setIsInfoModalOpen(false)} 
          onProfileUpdate={handleProfileUpdate}
        />
      )}
    </div>
  );
};

export default MiPerfilPage;