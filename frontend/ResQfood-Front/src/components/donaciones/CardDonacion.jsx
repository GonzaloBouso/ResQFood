// frontend/src/components/layout/CardDonacion.jsx (CÓDIGO COMPLETO Y CORREGIDO)
import React, { useState } from 'react';
import { MoreVertical, Flag } from 'lucide-react';
import ReportModal from '../modals/ReportModal'; // Importamos el nuevo modal

const CardDonacion = ({ donacion }) => {
    const [menuOpen, setMenuOpen] = useState(false);
    const [reportModalOpen, setReportModalOpen] = useState(false);

    if (!donacion) return null;

    const { titulo, imagenesUrl = [], categoria, donanteId } = donacion;
    const img = imagenesUrl[0] || 'https://via.placeholder.com/150';

    return (
        <>
            <article className="bg-white rounded-lg border shadow-sm w-full">
                <div className="p-4 flex gap-4">
                    <img src={img} alt={titulo} className="w-24 h-24 rounded-md object-cover" />
                    <div className="flex-1 flex flex-col justify-between">
                        <div>
                            <div className="flex justify-between items-start">
                                <span className="text-xs font-medium text-gray-600 bg-gray-100 px-2 py-1 rounded-full">{categoria}</span>
                                <div className="relative">
                                    <button onClick={() => setMenuOpen(prev => !prev)} onBlur={() => setTimeout(() => setMenuOpen(false), 150)} className="p-1 rounded-full hover:bg-gray-100 text-gray-500">
                                        <MoreVertical size={18} />
                                    </button>
                                    {menuOpen && (
                                        <div className="absolute right-0 mt-1 w-40 bg-white rounded-md shadow-lg border z-10">
                                            <button 
                                                onClick={() => { setReportModalOpen(true); setMenuOpen(false); }}
                                                className="w-full text-left px-3 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center gap-2"
                                            >
                                                <Flag size={14} /> Reportar
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </div>
                            <h3 className="font-semibold text-lg mt-1">{titulo}</h3>
                            <p className="text-sm text-gray-500">Donado por: {donanteId?.nombre || 'Anónimo'}</p>
                        </div>
                        <button className="mt-2 text-sm font-semibold text-primary self-start hover:underline">
                            Ver detalles
                        </button>
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