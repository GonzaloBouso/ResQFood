import React, { useContext, useState } from 'react';
import { ProfileStatusContext } from '../context/ProfileStatusContext';
import PerfilGeneralView from '../components/profile/PerfilGeneralView';
import PerfilEmpresaView from '../components/profile/PerfilEmpresaView';
import ChangePhotoProfileModal from '../components/layout/ChangePhotoProfileModal';
import EditarPerfilModal from '../components/profile/EditarPerfilModal';
import HistorialDonacion from '../components/layout/HistorialDonacion';
import HistorialRecepcion from '../components/layout/HistorialRecepcion';

const MiPerfilPage = () => {
    const { currentUserDataFromDB, isLoadingUserProfile, updateProfileState } = useContext(ProfileStatusContext);
    
 
    const [activeTab, setActiveTab] = useState('info'); 

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

    
    const ProfileHeaderComponent = currentUserDataFromDB.rol === 'LOCAL' 
        ? PerfilEmpresaView 
        : PerfilGeneralView;

    return (
        <div className="max-w-4xl mx-auto">
            {/* Cabecera del Perfil */}
            <ProfileHeaderComponent 
                userData={currentUserDataFromDB}
                isEditable={true}
                onEditPhotoClick={() => setIsPhotoModalOpen(true)}
                onEditInfoClick={() => setIsInfoModalOpen(true)}
            />
            
            {/* Navegación de Pestañas */}
            <div className="mt-6 border-b border-gray-200">
                <nav className="-mb-px flex space-x-8" aria-label="Tabs">
                    <button
                        onClick={() => setActiveTab('info')}
                        className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${
                            activeTab === 'info' ? 'border-primary text-primary' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                        }`}
                    >
                        Información
                    </button>
                    <button
                        onClick={() => setActiveTab('hechas')}
                        className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${
                            activeTab === 'hechas' ? 'border-primary text-primary' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                        }`}
                    >
                        Donaciones Hechas
                    </button>
                    
                    {currentUserDataFromDB.rol === 'GENERAL' && (
                        <button
                            onClick={() => setActiveTab('recibidas')}
                            className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${
                                activeTab === 'recibidas' ? 'border-primary text-primary' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                            }`}
                        >
                            Donaciones Recibidas
                        </button>
                    )}
                </nav>
            </div>

            {/* Contenido de las Pestañas */}
            <div className="mt-6">
                {activeTab === 'info' && (
                    <div className="text-center p-4 bg-white rounded-lg shadow-sm border">
                        
                    </div>
                )}
                {activeTab === 'hechas' && <HistorialDonacion />}
                {activeTab === 'recibidas' && currentUserDataFromDB.rol === 'GENERAL' && <HistorialRecepcion />}
            </div>

            {/* Modales */}
            {isPhotoModalOpen && <ChangePhotoProfileModal onClose={() => setIsPhotoModalOpen(false)} onUploadSuccess={handleUploadSuccess} />}
            {isInfoModalOpen && <EditarPerfilModal userData={currentUserDataFromDB} onClose={() => setIsInfoModalOpen(false)} onProfileUpdate={handleProfileUpdate} />}
        </div>
    );
};

export default MiPerfilPage;