import React, { useContext, useState } from 'react';
import { ProfileStatusContext } from '../context/ProfileStatusContext';
import { Camera } from 'lucide-react';
import ChangePhotoProfileModal from '../components/layout/ChangePhotoProfileModal';
// LA SOLUCIÓN: Importamos las nuevas "vistas"
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

  // Decidimos qué VISTA renderizar
  const ProfileComponentToRender = currentUserDataFromDB.rol === 'LOCAL'
    ? PerfilEmpresaView
    : PerfilGeneralView;

  return (
    <div className="relative">
      <ProfileComponentToRender userData={currentUserDataFromDB} />
      {/* ... Tu botón de cámara y modal (sin cambios) ... */}
    </div>
  );
};

export default MiPerfilPage;