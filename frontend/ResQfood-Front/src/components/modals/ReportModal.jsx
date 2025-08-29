import React, { useState } from 'react';
import { useAuth } from '@clerk/clerk-react';
import { X, Flag } from 'lucide-react';
import API_BASE_URL from '../../api/config';
import toast from 'react-hot-toast';

const ReportModal = ({ donacion, onClose }) => {
    const { getToken } = useAuth();
    const [motivo, setMotivo] = useState('');
    const [detalles, setDetalles] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!motivo) {
            toast.error('Por favor, selecciona un motivo para el reporte.');
            return;
        }
        setIsSubmitting(true);
        const toastId = toast.loading('Enviando reporte...');

        try {
            const token = await getToken();
            const response = await fetch(`${API_BASE_URL}/api/reporte/donacion/${donacion._id}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
                body: JSON.stringify({ motivo, detalles }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'No se pudo enviar el reporte.');
            }
            toast.success('Reporte enviado con éxito. Gracias por tu colaboración.', { id: toastId });
            onClose();
        } catch (error) {
            toast.error(`Error: ${error.message}`, { id: toastId });
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 animate-fade-in-up">
            <div className="bg-white rounded-xl w-full max-w-md shadow-2xl">
                <div className="p-4 border-b flex justify-between items-center">
                    <h2 className="text-lg font-semibold flex items-center gap-2"><Flag size={20}/> Reportar Publicación</h2>
                    <button onClick={onClose} className="p-1 rounded-full hover:bg-gray-100">&times;</button>
                </div>
                <form onSubmit={handleSubmit}>
                    <div className="p-6 space-y-4">
                        <div>
                            <label htmlFor="motivo" className="block text-sm font-medium text-gray-700 mb-1">Motivo del reporte</label>
                            <select id="motivo" value={motivo} onChange={(e) => setMotivo(e.target.value)} required className="w-full border-gray-300 rounded-md shadow-sm">
                                <option value="" disabled>Selecciona una razón...</option>
                                <option value="Contenido inapropiado">Contenido inapropiado</option>
                                <option value="Información falsa o engañosa">Información falsa o engañosa</option>
                                <option value="Spam">Spam</option>
                                <option value="Comportamiento abusivo">Comportamiento abusivo del donante</option>
                                <option value="Otro">Otro (especificar en detalles)</option>
                            </select>
                        </div>
                        <div>
                            <label htmlFor="detalles" className="block text-sm font-medium text-gray-700 mb-1">Detalles adicionales (opcional)</label>
                            <textarea id="detalles" value={detalles} onChange={(e) => setDetalles(e.target.value)} rows="3" placeholder="Proporciona más información si es necesario." className="w-full border-gray-300 rounded-md shadow-sm"></textarea>
                        </div>
                    </div>
                    <div className="px-6 pb-4 flex justify-end gap-3 bg-gray-50 pt-4 rounded-b-xl">
                        <button type="button" onClick={onClose} className="px-4 py-2 text-sm font-medium bg-white border rounded-md hover:bg-gray-50">Cancelar</button>
                        <button type="submit" disabled={isSubmitting} className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700 disabled:opacity-50">
                            {isSubmitting ? 'Enviando...' : 'Enviar Reporte'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ReportModal;