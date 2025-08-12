import React, { useState } from 'react';
import { useAuth } from '@clerk/clerk-react';
import { X } from 'lucide-react';
import API_BASE_URL from '../../api/config';

const EditarPerfilModal = ({ userData, onClose, onProfileUpdate }) => {
  const { getToken } = useAuth();
  // Inicializamos el estado del formulario con los datos actuales del usuario
  const [formData, setFormData] = useState({
    nombre: userData.nombre || '',
    telefono: userData.telefono || '',
    // Puedes añadir más campos editables aquí
  });
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    setIsSaving(true);
    setError(null);
    try {
      const token = await getToken();
      const response = await fetch(`${API_BASE_URL}/api/usuario/me`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify(formData),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || 'Error al actualizar el perfil.');
      }

      onProfileUpdate(data.user); // Actualiza el estado global
      onClose(); // Cierra el modal

    } catch (err) {
      console.error("Error al actualizar el perfil:", err);
      setError(err.message);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
      <div className="bg-white rounded-xl w-full max-w-lg shadow-2xl">
        <div className="p-4 border-b flex justify-between items-center">
          <h3 className="text-lg font-semibold">Editar Información del Perfil</h3>
          <button onClick={onClose} className="p-1 rounded-full hover:bg-gray-100"><X size={20} /></button>
        </div>

        <div className="p-6 space-y-4">
          <div>
            <label htmlFor="nombre" className="block text-sm font-medium text-gray-700">Nombre</label>
            <input 
              type="text" 
              name="nombre" 
              id="nombre"
              value={formData.nombre}
              onChange={handleInputChange}
              className="mt-1 block w-full input-style"
            />
          </div>
          <div>
            <label htmlFor="telefono" className="block text-sm font-medium text-gray-700">Teléfono</label>
            <input 
              type="tel" 
              name="telefono" 
              id="telefono"
              value={formData.telefono}
              onChange={handleInputChange}
              className="mt-1 block w-full input-style"
            />
          </div>
          {/* Aquí podrías añadir más campos para editar, como la ubicación */}
        </div>
        
        {error && <p className="text-red-500 text-sm text-center px-6 pb-4">{error}</p>}

        <div className="p-4 bg-gray-50 border-t flex justify-end gap-3">
          <button onClick={onClose} className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border rounded-md hover:bg-gray-50">Cancelar</button>
          <button 
            onClick={handleSubmit} 
            disabled={isSaving}
            className="px-4 py-2 text-sm font-medium text-white bg-primary rounded-md hover:bg-brandPrimaryDarker disabled:opacity-50"
          >
            {isSaving ? "Guardando..." : "Guardar Cambios"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditarPerfilModal;