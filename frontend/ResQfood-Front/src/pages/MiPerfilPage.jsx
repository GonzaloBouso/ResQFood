import React, { useContext, useState } from 'react';
import { ProfileStatusContext } from '../context/ProfileStatusContext';
import PerfilGeneralView from '../components/profile/PerfilGeneralView';
import PerfilEmpresaView from '../components/profile/PerfilEmpresaView';
import ChangePhotoProfileModal from '../components/layout/ChangePhotoProfileModal';
import EditarPerfilModal from '../components/profile/EditarPerfilModal';
import HistorialDonacion from '../components/layout/HistorialDonacion';
import HistorialRecepcion from '../components/layout/HistorialRecepcion';
import { InfoUsuarioGeneralDinamico, InfoUsuarioEmpresaDinamico } from '../components/profile/InfoUsuarioDinamico'; // Asumimos que moveremos los componentes de Info aquí

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

    const isGeneralUser = currentUserDataFromDB.rol === 'GENERAL';
    const ProfileHeaderComponent = isGeneralUser ? PerfilGeneralView : PerfilEmpresaView;
    const InfoComponent = isGeneralUser ? InfoUsuarioGeneralDinamico : InfoUsuarioEmpresaDinamico;

    const renderTabContent = () => {
        switch (activeTab) {
            case 'info':
                return <InfoComponent userData={currentUserDataFromDB} />;
            case 'hechas':
                return <HistorialDonacion userId={currentUserDataFromDB._id} />;
            case 'recibidas':
                return isGeneralUser ? <HistorialRecepcion userId={currentUserDataFromDB._id} /> : null;
            default:
                return <InfoComponent userData={currentUserDataFromDB} />;
        }
    };

    return (
        <div className="max-w-4xl mx-auto py-10 px-4 sm:px-6 lg:px-8">
            {/* 1. Cabecera del Perfil (Ahora solo muestra la parte superior) */}
            <ProfileHeaderComponent 
                userData={currentUserDataFromDB}
                isEditable={true}
                onEditPhotoClick={() => setIsPhotoModalOpen(true)}
                onEditInfoClick={() => setIsInfoModalOpen(true)}
            />
            
            {/* 2. Navegación de Pestañas (Única y controlada por esta página) */}
            <div className="mt-8">
              <div className="flex justify-center border-b border-gray-200">
                  <button
                      onClick={() => setActiveTab('info')}
                      className={`px-4 py-3 text-sm font-medium ${
                          activeTab === 'info' ? 'border-b-2 border-primary text-primary' : 'text-gray-500 hover:text-gray-700'
                      }`}
                  >
                      Información
                  </button>
                  <button
                      onClick={() => setActiveTab('hechas')}
                      className={`px-4 py-3 text-sm font-medium ${
                          activeTab === 'hechas' ? 'border-b-2 border-primary text-primary' : 'text-gray-500 hover:text-gray-700'
                      }`}
                  >
                      Donaciones Hechas
                  </button>
                  
                  {isGeneralUser && (
                      <button
                          onClick={() => setActiveTab('recibidas')}
                          className={`px-4 py-3 text-sm font-medium ${
                              activeTab === 'recibidas' ? 'border-b-2 border-primary text-primary' : 'text-gray-500 hover:text-gray-700'
                          }`}
                      >
                          Donaciones Recibidas
                      </button>
                  )}
              </div>
            </div>

            {/* 3. Contenido de las Pestañas */}
            <div className="mt-6">
                {renderTabContent()}
            </div>

            {/* Modales */}
            {isPhotoModalOpen && <ChangePhotoProfileModal onClose={() => setIsPhotoModalOpen(false)} onUploadSuccess={handleUploadSuccess} />}
            {isInfoModalOpen && <EditarPerfilModal userData={currentUserDataFromDB} onClose={() => setIsInfoModalOpen(false)} onProfileUpdate={handleProfileUpdate} />}
        </div>
    );
};

export default MiPerfilPage;