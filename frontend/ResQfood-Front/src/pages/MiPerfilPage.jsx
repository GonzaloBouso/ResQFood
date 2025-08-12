import React, { useContext, useState } from 'react';
import { ProfileStatusContext } from '../context/ProfileStatusContext';
import { Camera } from 'lucide-react';
import CambiarFotoPerfilModal from '../components/modals/CambiarFotoPerfilModal';

// Reutilizamos los componentes internos que ya tenías
import PerfilUsuarioGeneral from './PerfilUsuarioGeneral';
import PerfilUsuarioEmpresa from './PerfilUsuarioEmpresa';

const MiPerfilPage = () => {
  const { currentUserDataFromDB, isLoadingUserProfile, updateProfileState } = useContext(ProfileStatusContext);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Muestra un mensaje de carga mientras se obtienen los datos.
  if (isLoadingUserProfile) {
    return <div className="text-center py-20">Cargando tu perfil...</div>;
  }

  // Muestra un mensaje de error si no se pudieron cargar los datos.
  if (!currentUserDataFromDB) {
    return <div className="text-center py-20">No se pudo cargar la información de tu perfil.</div>;
  }

  const handleUploadSuccess = (updatedUser) => {
    updateProfileState(updatedUser);
    setIsModalOpen(false);
  };

  // ==================================================================
  // LA SOLUCIÓN:
  // Decidimos qué componente de perfil mostrar basándonos en el rol.
  // Esto asegura que se use la vista correcta para el usuario actual.
  // ==================================================================
  const ProfileComponentToRender = currentUserDataFromDB.rol === 'LOCAL'
    ? PerfilUsuarioEmpresa
    : PerfilUsuarioGeneral;

  return (
    <div className="relative">
      {/* 
        Renderizamos el componente de perfil correspondiente,
        pasándole los datos del usuario actual que ya tenemos del contexto.
      */}
      <ProfileComponentToRender userData={currentUserDataFromDB} />

      {/* Botón flotante para editar la foto */}
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
      
      {isModalOpen && (
        <CambiarFotoPerfilModal 
          onClose={() => setIsModalOpen(false)} 
          onUploadSuccess={handleUploadSuccess}
        />
      )}
    </div>
  );
};

export default MiPerfilPage;