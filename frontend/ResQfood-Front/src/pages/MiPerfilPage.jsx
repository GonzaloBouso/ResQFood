import React, { useContext, useState } from 'react';
import { useUser } from '@clerk/clerk-react'; // <<< 1. Importa el hook useUser
import { ProfileStatusContext } from '../context/ProfileStatusContext';
import { Camera, Edit2 } from 'lucide-react';

import PerfilEmpresaView from '../components/profile/PerfilEmpresaView';
import PerfilGeneralView from '../components/profile/PerfilGeneralView';
import ChangePhotoPerfileModal from '../components/layout/ChangePhotoProfileModal;';
import EditarPerfilModal from '../components/profile/EditarPerfilModal';
const MiPerfilPage = () => {
  const { user: clerkUser } = useUser(); // <<< 2. Obtiene la instancia del usuario de Clerk
  const { currentUserDataFromDB, isLoadingUserProfile, updateProfileState } = useContext(ProfileStatusContext);
  
  const [isPhotoModalOpen, setIsPhotoModalOpen] = useState(false);
  const [isInfoModalOpen, setIsInfoModalOpen] = useState(false);

  if (isLoadingUserProfile) return <div className="text-center py-20">Cargando tu perfil...</div>;
  if (!currentUserDataFromDB) return <div className="text-center py-20">No se pudo cargar la información de tu perfil.</div>;

  const handleUploadSuccess = async (updatedUser) => {
    // 3. Primero, actualizamos el estado de nuestra propia aplicación (lo que ya hacías)
    updateProfileState(updatedUser);
    
    // 4. LUEGO, le decimos al SDK de Clerk que refresque sus datos del caché.
    //    Esto forzará al <UserButton> a obtener la nueva foto de perfil.
    if (clerkUser) {
      try {
        await clerkUser.reload();
        console.log("Datos de usuario de Clerk recargados exitosamente.");
      } catch (error) {
        console.error("Error al recargar los datos de usuario de Clerk:", error);
      }
    }

    // 5. Finalmente, cerramos el modal
    setIsPhotoModalOpen(false); 
  };
  
  const handleProfileUpdate = (updatedUser) => {
    updateProfileState(updatedUser);
    setIsInfoModalOpen(false);
  };

  const ProfileComponentToRender = currentUserDataFromDB.rol === 'LOCAL' 
    ? PerfilEmpresaView 
    : PerfilGeneralView;

  return (
    <div className="relative">
      <ProfileComponentToRender 
          userData={currentUserDataFromDB}
          isEditable={true}
          onEditPhotoClick={() => setIsPhotoModalOpen(true)}
          onEditInfoClick={() => setIsInfoModalOpen(true)}
      />
      {isPhotoModalOpen && (
        <ChangePhotoPerfileModal 
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