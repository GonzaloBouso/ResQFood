import React, { useContext, useState } from 'react';
import { ProfileStatusContext } from '../context/ProfileStatusContext';
import ProfileLayout from '../components/profile/ProfileLayout';
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

    return (
        <>
            <ProfileLayout 
                userData={currentUserDataFromDB}
                isEditable={true}
                onEditPhotoClick={() => setIsPhotoModalOpen(true)}
                onEditInfoClick={() => setIsInfoModalOpen(true)}
            />

            {isPhotoModalOpen && <ChangePhotoProfileModal onClose={() => setIsPhotoModalOpen(false)} onUploadSuccess={handleUploadSuccess} />}
            {isInfoModalOpen && <EditarPerfilModal userData={currentUserDataFromDB} onClose={() => setIsInfoModalOpen(false)} onProfileUpdate={handleProfileUpdate} />}
        </>
    );
};

export default MiPerfilPage;