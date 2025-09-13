import React, { useState } from 'react';
import PerfilGeneralView from './PerfilGeneralView';
import PerfilEmpresaView from './PerfilEmpresaView';
import HistorialDonacion from '../layout/HistorialDonacion';
import HistorialRecepcion from '../layout/HistorialRecepcion';
import CalificacionesRecibidas from './CalificacionesRecibidas';
import { InfoUsuarioGeneralDinamico, InfoUsuarioEmpresaDinamico } from './InfoUsuarioDinamico';

const ProfileLayout = ({ userData, isEditable, onEditPhotoClick, onEditInfoClick }) => {
    const [activeTab, setActiveTab] = useState('info'); 

    const isGeneralUser = userData.rol === 'GENERAL';
    const ProfileHeaderComponent = isGeneralUser ? PerfilGeneralView : PerfilEmpresaView;
    const InfoComponent = isGeneralUser ? InfoUsuarioGeneralDinamico : InfoUsuarioEmpresaDinamico;

    const renderTabContent = () => {
        switch (activeTab) {
            case 'info':
                return <InfoComponent userData={userData} />;
            case 'hechas':
                return <HistorialDonacion userId={userData._id} />;
            case 'recibidas':
                return isGeneralUser ? <HistorialRecepcion userId={userData._id} /> : null;
            case 'calificaciones': 
                return <CalificacionesRecibidas userId={userData._id} />;
            default:
                return <InfoComponent userData={userData} />;
        }
    };

    return (
        <div className="max-w-4xl mx-auto">
            <ProfileHeaderComponent 
                userData={userData}
                isEditable={isEditable}
                onEditPhotoClick={onEditPhotoClick}
                onEditInfoClick={onEditInfoClick}
            />
            
            <div className="mt-8 sticky top-[80px] lg:top-[96px] bg-gray-50 z-10">
                <div className="overflow-x-auto">
                    <nav className="flex justify-start sm:justify-center border-b border-gray-200 whitespace-nowrap">
                        <button
                            onClick={() => setActiveTab('info')}
                            className={`px-4 py-3 text-sm font-medium shrink-0 ${
                                activeTab === 'info' ? 'border-b-2 border-primary text-primary' : 'text-gray-500 hover:text-gray-700'
                            }`}
                        >
                            Información
                        </button>
                        <button
                            onClick={() => setActiveTab('hechas')}
                            className={`px-4 py-3 text-sm font-medium shrink-0 ${
                                activeTab === 'hechas' ? 'border-b-2 border-primary text-primary' : 'text-gray-500 hover:text-gray-700'
                            }`}
                        >
                            Donaciones Hechas
                        </button>
                        {isGeneralUser && (
                            <button
                                onClick={() => setActiveTab('recibidas')}
                                className={`px-4 py-3 text-sm font-medium shrink-0 ${
                                    activeTab === 'recibidas' ? 'border-b-2 border-primary text-primary' : 'text-gray-500 hover:text-gray-700'
                                }`}
                            >
                                Donaciones Recibidas
                            </button>
                        )}
                        <button
                            onClick={() => setActiveTab('calificaciones')}
                            className={`px-4 py-3 text-sm font-medium shrink-0 ${
                                activeTab === 'calificaciones' ? 'border-b-2 border-primary text-primary' : 'text-gray-500 hover:text-gray-700'
                            }`}
                        >
                            Calificaciones Recibidas
                        </button>
                    </nav>
                </div>
            </div>

            <div className="mt-6">
                {renderTabContent()}
            </div>
        </div>
    );
};

export default ProfileLayout;