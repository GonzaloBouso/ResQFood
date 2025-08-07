import React, { useContext, useState } from 'react';
import { ProfileStatusContext } from '../context/ProfileStatusContext';
import PerfilUsuarioGeneral from './PerfilUsuarioGeneral'; // Reutilizamos la vista
import PerfilUsuarioEmpresa from './PerfilUsuarioEmpresa'; // Reutilizamos la vista
import { Camera } from 'lucide-react';

// Nuevo componente para el modal de cambio de foto (lo crearemos después)
// import CambiarFotoPerfilModal from '../components/modals/CambiarFotoPerfilModal';

const MiPerfilPage = () => {
  // Obtenemos los datos del usuario actual desde el contexto
  const { currentUserDataFromDB, isLoadingUserProfile } = useContext(ProfileStatusContext);
  
  // Estado para controlar la visibilidad del modal
  const [isModalOpen, setIsModalOpen] = useState(false);

  if (isLoadingUserProfile) {
    return <div className="text-center py-20">Cargando tu perfil...</div>;
  }

  if (!currentUserDataFromDB) {
    return <div className="text-center py-20">No se pudo cargar la información de tu perfil.</div>;
  }

  // Decidimos qué componente de visualización usar
  const ProfileComponent = currentUserDataFromDB.rol === 'LOCAL' 
    ? PerfilUsuarioEmpresa 
    : PerfilUsuarioGeneral;

  return (
    <div className="relative">
      {/* Pasamos los datos del usuario actual a los componentes de visualización */}
      <ProfileComponent userData={currentUserDataFromDB} />

      {/* 
        LA SOLUCIÓN: Botón flotante de "Editar Foto"
        Lo posicionamos de forma absoluta sobre el área de la foto de perfil.
      */}
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
      
      {/* El modal se mostrará cuando isModalOpen sea true */}
      {/*isModalOpen && (
        <CambiarFotoPerfilModal onClose={() => setIsModalOpen(false)} />
      )*/}
    </div>
  );
};

export default MiPerfilPage;