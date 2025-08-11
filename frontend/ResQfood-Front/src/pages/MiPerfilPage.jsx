import React, { useContext, useState } from 'react';
import { ProfileStatusContext } from '../context/ProfileStatusContext';
import PerfilUsuarioGeneral from './PerfilUsuarioGeneral';
import PerfilUsuarioEmpresa from './PerfilUsuarioEmpresa';
import { Camera } from 'lucide-react';
import ChangePhotoProfileModal from '../components/layout/ChangePhotoProfileModal';
const MiPerfilPage = () => {
  // 1. Obtenemos los datos y la función de actualización del contexto
  //    Esta línea ya es correcta porque usa 'isLoadingUserProfile'.
  const { currentUserDataFromDB, isLoadingUserProfile, updateProfileState } = useContext(ProfileStatusContext);
  
  // 2. Estado para controlar la visibilidad del modal (sin cambios).
  const [isModalOpen, setIsModalOpen] = useState(false);

  // 3. Muestra un mensaje de carga mientras el hook principal en App.jsx busca los datos.
  if (isLoadingUserProfile) {
    return <div className="text-center py-20">Cargando tu perfil...</div>;
  }

  // 4. Muestra un mensaje si, después de cargar, no se encontraron datos.
  if (!currentUserDataFromDB) {
    return <div className="text-center py-20">No se pudo cargar la información de tu perfil.</div>;
  }

  // 5. Función que se pasará al modal. Se ejecuta cuando la foto se sube con éxito.
  const handleUploadSuccess = (updatedUser) => {
    updateProfileState(updatedUser); // Actualiza el estado global de la app.
    setIsModalOpen(false); // Cierra el modal.
  };

  // 6. Decide qué componente de visualización usar según el rol del usuario (sin cambios).
  const ProfileComponent = currentUserDataFromDB.rol === 'LOCAL' 
    ? PerfilUsuarioEmpresa 
    : PerfilUsuarioGeneral;

  return (
    <div className="relative">
      {/* Muestra el componente de perfil correspondiente (General o Empresa) */}
      <ProfileComponent userData={currentUserDataFromDB} />

      {/* Botón flotante para editar la foto que aparece al hacer hover */}
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
        <ChangePhotoProfileModal 
          onClose={() => setIsModalOpen(false)} 
          onUploadSuccess={handleUploadSuccess}
        />
      )}
    </div>
  );
};

export default MiPerfilPage;