import React, { useContext, useState } from 'react';
import { ProfileStatusContext } from '../context/ProfileStatusContext';
import PerfilUsuarioGeneral from './PerfilUsuarioGeneral';
import PerfilUsuarioEmpresa from './PerfilUsuarioEmpresa';
import { Camera } from 'lucide-react';
import ChangePhotoProfileModal from '../components/layout/ChangePhotoProfileModal';

const MiPerfilPage = () => {
  // Obtenemos los datos y la función de actualización del contexto.
  const { currentUserDataFromDB, isLoadingUserProfile, updateProfileState } = useContext(ProfileStatusContext);
  
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Muestra un mensaje mientras se carga el perfil.
  if (isLoadingUserProfile) {
    return <div className="text-center py-20">Cargando tu perfil...</div>;
  }

  // Muestra un mensaje si no se pudieron cargar los datos.
  if (!currentUserDataFromDB) {
    return <div className="text-center py-20">No se pudo cargar la información de tu perfil.</div>;
  }


  const handleUploadSuccess = (updatedUser) => {
    updateProfileState(updatedUser);
    // Opcional: cierra el modal automáticamente
    setIsModalOpen(false); 
  };

  // Decide qué componente de visualización usar (ya lo tenías).
  const ProfileComponent = currentUserDataFromDB.rol === 'LOCAL' 
    ? PerfilUsuarioEmpresa 
    : PerfilUsuarioGeneral;

  return (
    <div className="relative">
      {/* Muestra el componente de perfil correspondiente (General o Empresa) */}
      <ProfileComponent userData={currentUserDataFromDB} />

      {/* Botón flotante para editar la foto (ya lo tenías) */}
      <div className="absolute top-10 left-1/2 -translate-x-1/2 sm:left-auto sm:right-auto sm:top-10 sm:translate-x-0">
         <div className="relative w-32 h-32 sm:w-40 sm:h-40">
            <button
              onClick={() => setIsModalOpen(true)}
              className="absolute inset-0 bg-black/50 text-white flex items-center justify-center rounded-full sm:rounded-lg opacity-0 hover:opacity-100 transition-opacity duration-300"
              title="Cambiar foto de perfil"
            >
              <Camera size={32} />
            </button>
         </div>
      </div>
      
      {/*
        LA SOLUCIÓN:
        3. Renderizamos el modal condicionalmente y le pasamos las props necesarias:
           - onClose: para que el modal pueda cerrarse a sí mismo.
           - onUploadSuccess: para que el modal pueda notificar a esta página cuando la subida fue exitosa.
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