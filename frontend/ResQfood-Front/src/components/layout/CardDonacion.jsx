// frontend/src/components/layout/CardDonacion.jsx (CÓDIGO COMPLETO Y FINAL)

import React, { useState, useContext } from 'react'; // 1. Importamos useContext
import { Link } from 'react-router-dom';
import { useAuth } from '@clerk/clerk-react';
import API_BASE_URL from '../../api/config'; 
import DetallesCardDonacion from './DetallesCardDonacion';
import ConfirmModal from '../modals/ConfirmModal'; 
import ReportModal from '../modals/ReportModal'; // 2. Importamos el nuevo modal de reporte
import { ProfileStatusContext } from '../../context/ProfileStatusContext'; // 3. Importamos el contexto de perfil
import { MoreVertical, Flag } from 'lucide-react'; // 4. Importamos los íconos necesarios
import toast from 'react-hot-toast';

const FALLBACK_IMAGE_URL = 'https://via.placeholder.com/300x200.png?text=Sin+Imagen';

const CardDonacion = ({ donacion }) => { 
  // Estados que ya tenías
  const [mostrarModal, setMostrarModal] = useState(false);
  const { getToken } = useAuth(); 
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  
  // --- NUEVOS ESTADOS para el menú y el modal de reporte ---
  const [menuOpen, setMenuOpen] = useState(false);
  const [reportModalOpen, setReportModalOpen] = useState(false);
  
  // --- OBTENEMOS EL USUARIO ACTUAL DEL CONTEXTO ---
  const { currentUserDataFromDB } = useContext(ProfileStatusContext);

  if (!donacion) return null;

  const { _id, titulo, imagenesUrl, categoria, ubicacionRetiro, donanteId } = donacion;

  const isDonantePopulated = donanteId && typeof donanteId === 'object';
  const imageUrl = imagenesUrl && imagenesUrl.length > 0 ? imagenesUrl[0] : FALLBACK_IMAGE_URL;
  const ubicacionSimple = ubicacionRetiro ? `${ubicacionRetiro.ciudad || ''}${ubicacionRetiro.provincia ? ', ' + ubicacionRetiro.provincia : ''}`.trim() : 'Ubicación no especificada';
  const nombreDonante = isDonantePopulated ? donanteId.nombre : 'Donante Anónimo';
  const inicialesDonante = nombreDonante.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();

  // --- LÓGICA CLAVE: Comparamos para saber si es nuestra donación ---
  const isMyDonation = currentUserDataFromDB?._id === donanteId?._id;

  const handleSolicitarClick = async () => {
    const toastId = toast.loading('Enviando tu solicitud...');
    try {
      const token = await getToken();
      const response = await fetch(`${API_BASE_URL}/api/solicitud/${_id}/solicitar`, {
        method: 'POST',
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json' 
        },
        body: JSON.stringify({})
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || 'No se pudo enviar la solicitud.');
      }
      
        toast.success('¡Solicitud enviada con éxito! El donante ha sido notificado.', {
        id: toastId,
      });

    } catch (err) {
      console.error("Error al solicitar donación:", err);
      toast.error(err.message, { id: toastId });
    }
  };

  const abrirModal = () => setMostrarModal(true);
  const cerrarModal = () => setMostrarModal(false);

  return (
    <>
      <div className="rounded-lg border border-gray-200 bg-white shadow-sm overflow-hidden flex flex-col h-full transition-shadow hover:shadow-lg">
        {isDonantePopulated ? (
          <div className="block px-4 py-3 border-b border-gray-100">
            <div className="flex items-center justify-between">
              <Link to={`/perfil/${donanteId._id}`} className="flex items-center space-x-3 group">
                {donanteId.fotoDePerfilUrl ? (
                  <img className="w-8 h-8 rounded-full object-cover" src={donanteId.fotoDePerfilUrl} alt={nombreDonante} />
                ) : (
                  <div className="w-8 h-8 bg-primary/20 text-primary font-semibold rounded-full flex items-center justify-center text-sm flex-shrink-0">
                    {inicialesDonante}
                  </div>
                )}
                <span className="font-medium text-sm text-gray-700 truncate group-hover:text-primary" title={nombreDonante}>
                  {nombreDonante}
                </span>
              </Link>

              {/* --- RENDERIZADO CONDICIONAL DEL MENÚ DE 3 PUNTOS --- */}
              {!isMyDonation && currentUserDataFromDB && (
                <div className="relative">
                  <button 
                      onClick={() => setMenuOpen(prev => !prev)} 
                      onBlur={() => setTimeout(() => setMenuOpen(false), 200)} // Cierra el menú si se pierde el foco
                      className="p-2 -mr-2 rounded-full text-gray-400 hover:bg-gray-100 hover:text-gray-700"
                  >
                      <MoreVertical size={18} />
                  </button>
                  {menuOpen && (
                      <div className="absolute right-0 mt-1 w-48 bg-white rounded-md shadow-lg border z-20 animate-fade-in-up">
                          <button 
                              onClick={() => { setReportModalOpen(true); setMenuOpen(false); }}
                              className="w-full text-left px-3 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center gap-3"
                          >
                              <Flag size={14} /> Reportar publicación
                          </button>
                      </div>
                  )}
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="px-4 py-3 border-b border-gray-100">
             <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-gray-200 text-gray-500 rounded-full flex items-center justify-center text-sm flex-shrink-0">?</div>
                <span className="font-medium text-sm text-gray-500 italic">Donante Anónimo</span>
             </div>
          </div>
        )}

        <div className="w-full h-48 bg-gray-100">
          <img
            className="w-full h-full object-cover"
            src={imageUrl}
            alt={titulo || 'Imagen de la donación'}
            onError={(e) => { e.target.onerror = null; e.target.src = FALLBACK_IMAGE_URL; }}
          />
        </div>

        <div className="p-4 flex flex-col flex-grow">
          {categoria && (
            <span className="text-xs font-semibold uppercase tracking-wider text-primary mb-1">
              {categoria}
            </span>
          )}
          <h3 className="text-lg font-semibold text-gray-800 mb-2 truncate" title={titulo}>
            {titulo || 'Donación sin título'}
          </h3>

          {ubicacionSimple && ubicacionSimple !== ',' && (
            <p className="text-xs text-gray-500 mt-auto pt-2">
              📍 {ubicacionSimple}
            </p>
          )}
        </div>

        <div className="px-4 pb-4 pt-3 border-t border-gray-100">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-2">
            <button
              onClick={abrirModal}
              className="w-full sm:w-auto flex-1 text-center px-3 py-2 border border-primary text-primary rounded-md text-sm font-medium hover:bg-primary/10 transition-colors whitespace-nowrap"
            >
              Ver Detalles
            </button>
            {/* Solo mostramos el botón "Solicitar" si NO es nuestra donación */}
            {!isMyDonation && (
              <button
                className="w-full sm:w-auto flex-1 px-3 py-2 bg-primary text-white rounded-md text-sm font-medium hover:bg-brandPrimaryDarker transition-colors whitespace-nowrap"
                onClick={() => setIsConfirmOpen(true)}
              >
                Solicitar
              </button>
            )}
          </div>
        </div>
      </div>

      {mostrarModal && (
        <DetallesCardDonacion donacionId={_id} onClose={cerrarModal} />
      )}

      <ConfirmModal
        isOpen={isConfirmOpen}
        onClose={() => setIsConfirmOpen(false)}
        onConfirm={() => {
            setIsConfirmOpen(false);
            handleSolicitarClick();
        }}
        title="Confirmar Solicitud"
        message={`¿Estás seguro de que quieres solicitar la donación "${titulo}"?`}
        confirmText="Sí, Solicitar"
        cancelText="Cancelar"
      />

      {/* Renderizado del modal de reporte */}
      {reportModalOpen && (
          <ReportModal donacion={donacion} onClose={() => setReportModalOpen(false)} />
      )}
    </>
  );
};

export default CardDonacion;