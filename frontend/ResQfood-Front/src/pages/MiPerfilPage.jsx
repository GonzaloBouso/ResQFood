import React, { useContext, useState } from 'react';
import { ProfileStatusContext } from '../context/ProfileStatusContext';
import { Camera, Edit2 } from 'lucide-react'; // <-- Importa el icono de editar

// Importamos los componentes de visualización que vamos a reutilizar
import PerfilEmpresaView from '../components/profile/PerfilEmpresaView';
import PerfilGeneralView from '../components/profile/PerfilGeneralView';
import CambiarFotoPerfilModal from '../components/modals/CambiarFotoPerfilModal';
// import EditarInfoModal from '../components/modals/EditarInfoModal'; // <-- Futuro modal

const MiPerfilPage = () => {
  const { currentUserDataFromDB, isLoadingUserProfile, updateProfileState } = useContext(ProfileStatusContext);
  
  const [isPhotoModalOpen, setIsPhotoModalOpen] = useState(false);
  // const [isInfoModalOpen, setIsInfoModalOpen] = useState(false); // <-- Futuro estado

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

  // Decidimos qué componente de visualización usar
  const ProfileComponentToRender = currentUserDataFromDB.rol === 'LOCAL' 
    ? PerfilEmpresaView 
    : PerfilGeneralView;

  return (
    // Usamos un contenedor relativo para posicionar los botones de edición
    <div className="relative">
      
      {/* 1. Renderizamos el componente de perfil normal, tal cual */}
      <ProfileComponentToRender userData={currentUserDataFromDB} />

      {/* 
        2. AÑADIMOS los botones de edición de forma superpuesta.
           Estos botones solo existen en ESTA página, no en las vistas reutilizables.
      */}
      <div className="absolute top-10 right-0 sm:right-auto sm:left-1/2 sm:translate-x-[14rem] lg:translate-x-[16rem]">
          <button 
            // onClick={() => setIsInfoModalOpen(true)} // <-- Futura funcionalidad
            className="flex items-center gap-2 px-3 py-2 text-xs font-medium text-gray-700 bg-white border rounded-md shadow-sm hover:bg-gray-50 transition-colors"
          >
            <Edit2 size={14} />
            Editar Perfil
          </button>
      </div>

      <div className="absolute top-10 left-1/2 -translate-x-1/2 sm:left-auto sm:right-auto sm:top-10 sm:translate-x-0">
         <div className="relative w-32 h-32 sm:w-40 sm:h-40">
            <button
              onClick={() => setIsPhotoModalOpen(true)}
              className="absolute inset-0 bg-black/50 text-white flex items-center justify-center rounded-full sm:rounded-lg opacity-0 hover:opacity-100 transition-opacity duration-300"
              title="Cambiar foto de perfil"
            >
              <Camera size={32} />
            </button>
         </div>
      </div>
      
      {/* Renderizado de los modales */}
      {isPhotoModalOpen && (
        <CambiarFotoPerfilModal 
          onClose={() => setIsPhotoModalOpen(false)} 
          onUploadSuccess={handleUploadSuccess}
        />
      )}
      {/*
      {isInfoModalOpen && (
        <EditarInfoModal 
          userData={currentUserDataFromDB}
          onClose={() => setIsInfoModalOpen(false)}
          onProfileUpdate={updateProfileState}
        />
      )}
      */}
    </div>
  );
};

export default MiPerfilPage;