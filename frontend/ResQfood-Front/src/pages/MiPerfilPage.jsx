import React, { useContext, useState } from 'react';
import { ProfileStatusContext } from '../context/ProfileStatusContext';
import { Camera, Edit2 } from 'lucide-react';

// Importamos los componentes de visualización
import PerfilGeneralView from '../components/profile/PerfilGeneralView';
import PerfilEmpresaView from '../components/profile/PerfilEmpresaView';

// Importamos AMBOS modales
import CambiarFotoPerfilModal from '../components/modals/CambiarFotoPerfilModal';
import EditarPerfilModal from '../components/profile/EditarPerfilModal';

const MiPerfilPage = () => {
  // Obtenemos los datos y la función de actualización del contexto
  const { currentUserDataFromDB, isLoadingUserProfile, updateProfileState } = useContext(ProfileStatusContext);
  
  // Creamos un estado para controlar cada modal por separado
  const [isPhotoModalOpen, setIsPhotoModalOpen] = useState(false);
  const [isInfoModalOpen, setIsInfoModalOpen] = useState(false);

  // Muestra un mensaje mientras se carga el perfil
  if (isLoadingUserProfile) {
    return <div className="text-center py-20">Cargando tu perfil...</div>;
  }

  // Muestra un mensaje si no se pudieron cargar los datos
  if (!currentUserDataFromDB) {
    return <div className="text-center py-20">No se pudo cargar la información de tu perfil.</div>;
  }

  // Función de callback para cuando la foto se sube con éxito
  const handleUploadSuccess = (updatedUser) => {
    updateProfileState(updatedUser); // Actualiza el estado global
    setIsPhotoModalOpen(false); // Cierra el modal de la foto
  };
  
  // Función de callback para cuando la información se actualiza con éxito
  const handleProfileUpdate = (updatedUser) => {
    updateProfileState(updatedUser); // Actualiza el estado global
    setIsInfoModalOpen(false); // Cierra el modal de información
  };

  // Decide qué componente de visualización usar según el rol
  const ProfileComponentToRender = currentUserDataFromDB.rol === 'LOCAL' 
    ? PerfilEmpresaView 
    : PerfilGeneralView;

  return (
    // Contenedor relativo para posicionar los botones de edición
    <div className="relative">
      
      {/* 1. Renderizamos el componente de perfil normal, pasándole los datos */}
      <ProfileComponentToRender userData={currentUserDataFromDB} />

      {/* 2. Añadimos los botones de edición de forma superpuesta */}
      
      {/* Botón para Editar Información */}
      <div className="absolute top-10 right-0 sm:right-auto sm:left-1/2 sm:translate-x-[14rem] lg:translate-x-[16rem]">
          <button 
            onClick={() => setIsInfoModalOpen(true)} // Abre el modal de información
            className="flex items-center gap-2 px-3 py-2 text-xs font-medium text-gray-700 bg-white border rounded-md shadow-sm hover:bg-gray-50 transition-colors"
          >
            <Edit2 size={14} />
            Editar Perfil
          </button>
      </div>

      {/* Botón para Cambiar Foto */}
      <div className="absolute top-10 left-1/2 -translate-x-1/2 sm:left-auto sm:right-auto sm:top-10 sm:translate-x-0">
         <div className="relative w-32 h-32 sm:w-40 sm:h-40">
            <button
              onClick={() => setIsPhotoModalOpen(true)} // Abre el modal de la foto
              className="absolute inset-0 bg-black/50 text-white flex items-center justify-center rounded-full sm:rounded-lg opacity-0 hover:opacity-100 transition-opacity duration-300"
              title="Cambiar foto de perfil"
            >
              <Camera size={32} />
            </button>
         </div>
      </div>
      
      {/* 3. Renderizado condicional de los modales */}
      
      {isPhotoModalOpen && (
        <CambiarFotoPerfilModal 
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