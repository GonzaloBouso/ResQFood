import React, { useState } from 'react';
import { useAuth } from '@clerk/clerk-react';
import toast from 'react-hot-toast';
import API_BASE_URL from '../../api/config';
import Estrellas from '../layout/Estrellas';

const CalificacionModal = ({ entregaData, onClose }) => {
    const { getToken } = useAuth();
    const [puntuacion, setPuntuacion] = useState(0);
    const [comentario, setComentario] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    if (!entregaData) return null;

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (puntuacion === 0) {
            toast.error('Por favor, selecciona una puntuación.');
            return;
        }
        setIsSubmitting(true);
        const toastId = toast.loading('Enviando calificación...');

        try {
            const token = await getToken();
            const body = {
                entregaId: entregaData._id,
                donacionId: entregaData.donacionId,
                calificadoId: entregaData.donanteId,
                rolCalificado: 'DONANTE',
                puntuacion,
                comentario,
            };

            const response = await fetch(`${API_BASE_URL}/api/calificacion`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(body),
            });

            if (!response.ok) {
                throw new Error((await response.json()).message || 'Error al enviar calificación.');
            }

            toast.success('¡Gracias por tu calificación!', { id: toastId });
            onClose(true); 

        } catch (error) {
            toast.error(error.message, { id: toastId });
        } finally {
            setIsSubmitting(false);
        }
    };
    
    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md mx-4">
                <h2 className="text-2xl font-bold text-center mb-4">¡Califica tu experiencia!</h2>
                <form onSubmit={handleSubmit}>
                    <div className="mb-6"><Estrellas onRatingChange={setPuntuacion} /></div>
                    <div className="mb-6">
                        <label htmlFor="comentario" className="block text-sm font-medium text-gray-700">Comentario (opcional)</label>
                        <textarea id="comentario" rows="3" value={comentario} onChange={(e) => setComentario(e.target.value)}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
                            placeholder="Ej: El donante fue muy amable."
                        ></textarea>
                    </div>
                    <div className="flex flex-col gap-2">
                        <button type="submit" disabled={isSubmitting || puntuacion === 0}
                            className="w-full bg-primary text-white font-bold py-2 px-4 rounded-md hover:bg-brandPrimaryDarker disabled:bg-gray-400"
                        >
                            {isSubmitting ? 'Enviando...' : 'Enviar Calificación'}
                        </button>
                        <button type="button" onClick={() => onClose(false)}
                            className="w-full text-gray-600 font-medium py-2 px-4 rounded-md hover:bg-gray-100"
                        >
                            Omitir
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CalificacionModal;