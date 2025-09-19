
import React, { useState, useContext } from 'react';
import { MoreVertical, Flag } from 'lucide-react';
import { ProfileStatusContext } from '../../context/ProfileStatusContext'; 
import ReportModal from '../modals/ReportModal';

const CardDonacion = ({ donacion }) => {
    // Estados para controlar los menús y modales
    const [menuOpen, setMenuOpen] = useState(false);
    const [reportModalOpen, setReportModalOpen] = useState(false);
    
    // Obtenemos los datos del usuario logueado desde el contexto
    const { currentUserDataFromDB } = useContext(ProfileStatusContext);

    if (!donacion) return null;

    const { _id, titulo, imagenesUrl = [], categoria, donanteId, ubicacionRetiro } = donacion;
    const img = imagenesUrl[0] || 'https://via.placeholder.com/150';

   
    const isMyDonation = currentUserDataFromDB?._id === donanteId?._id;

    return (
        <>
            <article className="bg-white rounded-lg border shadow-sm w-full max-w-sm mx-auto">
                <div className="p-3">
                    <div className="flex items-center gap-3 mb-3">
                        <img src={donanteId?.fotoDePerfilUrl} alt={donanteId?.nombre} className="w-10 h-10 rounded-full object-cover bg-gray-200" />
                        <span className="font-semibold text-gray-800">{donanteId?.nombre || 'Donante'}</span>
                    </div>
                    <img src={img} alt={titulo} className="w-full h-48 rounded-md object-cover" />
                </div>
                <div className="p-4 pt-2">
                    <div className="flex justify-between items-start">
                        <div>
                            <p className="text-xs font-semibold text-primary uppercase tracking-wide">{categoria}</p>
                            <h3 className="font-bold text-xl text-gray-900 mt-1">{titulo}</h3>
                            <p className="text-sm text-gray-500 mt-1">📍 {ubicacionRetiro?.ciudad || 'Ubicación no especificada'}</p>
                        </div>
                        
                        {!isMyDonation && currentUserDataFromDB && (
                            <div className="relative">
                                <button 
                                    onClick={() => setMenuOpen(prev => !prev)}
                                    onBlur={() => setTimeout(() => setMenuOpen(false), 200)} 

                                    className="p-2 rounded-full hover:bg-gray-100 text-gray-500"
                                >
                                    <MoreVertical size={20} />
                                </button>
                                {menuOpen && (
                                    <div className="absolute right-0 mt-1 w-48 bg-white rounded-md shadow-lg border z-10 animate-fade-in-up">
                                        <button 
                                            onClick={() => { setReportModalOpen(true); setMenuOpen(false); }}
                                            className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center gap-3"
                                        >
                                            <Flag size={16} /> Reportar publicación
                                        </button>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                    <div className="flex gap-3 mt-4">
                        <button className="flex-1 px-4 py-2 text-sm font-semibold border border-gray-300 rounded-md hover:bg-gray-50">Ver Detalles</button>
                        <button className="flex-1 px-4 py-2 text-sm font-semibold text-white bg-primary rounded-md hover:bg-brandPrimaryDarker">Solicitar</button>
                    </div>
                </div>
            </article>

          
            {reportModalOpen && (
                <ReportModal donacion={donacion} onClose={() => setReportModalOpen(false)} />
            )}
        </>
    );
};

export default CardDonacion;