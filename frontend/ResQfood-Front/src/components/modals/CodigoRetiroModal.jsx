import React from 'react';
import { X, Copy } from 'lucide-react'; 
import toast from 'react-hot-toast';

const CodigoRetiroModal = ({ codigo, onClose }) => {

    const copyToClipboard = (text) => {
        navigator.clipboard.writeText(text);
        toast.success('¡Código copiado!');
    };

    if (!codigo) return null;

    return (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
            <div className="bg-white rounded-xl w-full max-w-sm shadow-2xl animate-fade-in-up">
                <div className="p-4 border-b flex justify-between items-center">
                    <h3 className="text-lg font-semibold text-green-800">¡Horario Confirmado!</h3>
                    <button onClick={onClose} className="p-1 rounded-full text-gray-500 hover:bg-gray-100">
                        <X size={20} />
                    </button>
                </div>

                <div className="p-6 text-center">
                    <p className="text-sm text-gray-600 mb-4">
                        Presenta este código al donante para retirar tu donación.
                    </p>
                    <div className="flex items-center justify-center gap-2 my-2 p-3 bg-green-100 rounded-lg border-2 border-dashed border-green-200">
                        <span className="font-bold text-3xl text-green-900 tracking-widest">{codigo}</span>
                        <button onClick={() => copyToClipboard(codigo)} title="Copiar código" className="p-2 text-green-700 hover:bg-green-200 rounded-full">
                            <Copy size={18} />
                        </button>
                    </div>
                </div>

                <div className="p-4 bg-gray-50 border-t flex justify-end">
                    <button 
                        onClick={onClose} 
                        className="px-4 py-2 text-sm font-medium text-white bg-primary rounded-md hover:bg-brandPrimaryDarker"
                    >
                        Entendido
                    </button>
                </div>
            </div>
        </div>
    );
};

export default CodigoRetiroModal;