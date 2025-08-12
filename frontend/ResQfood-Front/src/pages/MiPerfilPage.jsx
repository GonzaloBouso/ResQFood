import React, { useContext, useState } from 'react';
import { ProfileStatusContext } from '../context/ProfileStatusContext';
import { Camera } from 'lucide-react';
import ChangePhotoProfileModal from '../components/layout/ChangePhotoProfileModal';
import PerfilGeneralView from '../components/profile/PerfilGeneralView';
import PerfilEmpresaView from '../components/profile/PerfilEmpresaView';

const MiPerfilPage = () => {
  const { currentUserDataFromDB, isLoadingUserProfile, updateProfileState } = useContext(ProfileStatusContext);
  const [isModalOpen, setIsModalOpen] = useState(false);

  if (isLoadingUserProfile) {
    return <div className="text-center py-20">Cargando tu perfil...</div>;
  }
  if (!currentUserDataFromDB) {
    return <div className="text-center py-20">No se pudo cargar la información de tu perfil.</div>;
  }

  const handleUploadSuccess = (updatedUser) => {
    updateProfileState(updatedUser);
    setIsModalOpen(false);
  };

  const ProfileComponentToRender = currentUserDataFromDB.rol === 'LOCAL'
    ? PerfilEmpresaView
    : PerfilGeneralView;

  return (
    <div className="relative">
      <ProfileComponentToRender userData={currentUserDataFromDB} />
      
      {/* ================================================================== */}
      {/* LA SOLUCIÓN: Botón para abrir el modal Y renderizado condicional del modal */}
      {/* ================================================================== */}
      {/* Botón flotante para editar la foto */}
      <div className="absolute top-10 left-1/2 -translate-x-1/2 sm:left-auto sm:right-auto sm:top-10 sm:translate-x-0">
         <div className="relative w-32 h-32 sm:w-40 sm:h-40">
            <button
              onClick={() => setIsModalOpen(true)} // Esto pone isModalOpen en true
              className="absolute inset-0 bg-black/50 text-white flex items-center justify-center rounded-full sm:rounded-lg opacity-0 hover:opacity-100 transition-opacity duration-300"
              title="Cambiar foto de perfil"
            >
              <Camera size={32} />
            </button>
         </div>
      </div>
      
      {/* 
        El modal solo se renderiza si isModalOpen es true,
        y le pasamos las funciones necesarias como props.
      */}
      {isModalOpen && (
        <ChangePhotoProfileModal 
          onClose={() => setIsModalOpen(false)} 
          onUploadSuccess={handleUploadSuccess}
        />
      )}
    </div>
  );
};

export default MiPerfilPage;