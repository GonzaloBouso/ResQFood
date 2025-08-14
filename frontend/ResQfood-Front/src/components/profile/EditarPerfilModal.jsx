import React, { useState, useEffect } from 'react';
import { useAuth } from '@clerk/clerk-react';
import { X } from 'lucide-react';
import API_BASE_URL from '../../api/config';

const EditarPerfilModal = ({ userData, onClose, onProfileUpdate }) => {
  const { getToken } = useAuth();
  
  // 1. El estado del formulario ahora incluye todos los campos, incluyendo los de 'localData'
  const [formData, setFormData] = useState({
    nombre: userData.nombre || '',
    telefono: userData.telefono || '',
    localData: {
      tipoNegocio: userData.localData?.tipoNegocio || '',
      horarioAtencion: userData.localData?.horarioAtencion || '', // Simplificamos, el usuario puede escribirlo
      descripcionEmpresa: userData.localData?.descripcionEmpresa || '',
    },
    // Podríamos añadir la ubicación aquí también si quisiéramos que fuera editable
  });

  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleLocalDataChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      localData: { ...prev.localData, [name]: value }
    }));
  };

  const handleSubmit = async () => {
    setIsSaving(true);
    setError(null);
    try {
      const token = await getToken();
      
      // 2. Construimos el payload. Solo incluimos 'localData' si el rol es LOCAL.
      const payload = {
        nombre: formData.nombre,
        telefono: formData.telefono,
      };
      
      if (userData.rol === 'LOCAL') {
        payload.localData = formData.localData;
      }

      const response = await fetch(`${API_BASE_URL}/api/usuario/me`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify(payload),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || 'Error al actualizar el perfil.');
      }

      onProfileUpdate(data.user); // Actualiza el estado global
      onClose(); // Cierra el modal

    } catch (err) {
      setError(err.message);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl w-full max-w-lg shadow-2xl flex flex-col max-h-[90vh]">
        <div className="p-4 border-b flex justify-between items-center flex-shrink-0">
          <h3 className="text-lg font-semibold">Editar Información del Perfil</h3>
          <button onClick={onClose} className="p-1 rounded-full hover:bg-gray-100"><X size={20} /></button>
        </div>

        {/* 3. El contenido del modal ahora es scrollable */}
        <div className="p-6 space-y-4 overflow-y-auto">
          <div>
            <label htmlFor="nombre" className="block text-sm font-medium text-gray-700">Nombre</label>
            <input type="text" name="nombre" id="nombre" value={formData.nombre} onChange={handleInputChange} className="mt-1 block w-full input-style"/>
          </div>
          <div>
            <label htmlFor="telefono" className="block text-sm font-medium text-gray-700">Teléfono</label>
            <input type="tel" name="telefono" id="telefono" value={formData.telefono} onChange={handleInputChange} className="mt-1 block w-full input-style"/>
          </div>

          {/* 4. Mostramos los campos adicionales SOLO si el rol del usuario es LOCAL */}
          {userData.rol === 'LOCAL' && (
            <fieldset className="border p-4 rounded-md mt-4">
              <legend className="text-sm font-medium text-textMain px-1">Información del Local</legend>
              <div className="space-y-4 mt-2">
                <div>
                  <label htmlFor="tipoNegocio" className="block text-xs font-medium text-textMuted">Tipo de Negocio</label>
                  <input type="text" name="tipoNegocio" id="tipoNegocio" value={formData.localData.tipoNegocio} onChange={handleLocalDataChange} className="mt-1 block w-full input-style" />
                </div>
                <div>
                  <label htmlFor="horarioAtencion" className="block text-xs font-medium text-textMuted">Horario de Atención</label>
                  <input type="text" name="horarioAtencion" id="horarioAtencion" value={formData.localData.horarioAtencion} onChange={handleLocalDataChange} className="mt-1 block w-full input-style" placeholder="Ej: Lunes a Viernes de 9:00 a 18:00"/>
                </div>
                <div>
                  <label htmlFor="descripcionEmpresa" className="block text-xs font-medium text-textMuted">Descripción</label>
                  <textarea name="descripcionEmpresa" id="descripcionEmpresa" rows="3" value={formData.localData.descripcionEmpresa} onChange={handleLocalDataChange} className="mt-1 block w-full input-style"></textarea>
                </div>
              </div>
            </fieldset>
          )}
        </div>
        
        {error && <p className="text-red-500 text-sm text-center px-6 pb-4">{error}</p>}

        <div className="p-4 bg-gray-50 border-t flex justify-end gap-3 flex-shrink-0">
          <button onClick={onClose} className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border rounded-md hover:bg-gray-50">Cancelar</button>
          <button onClick={handleSubmit} disabled={isSaving} className="px-4 py-2 text-sm font-medium text-white bg-primary rounded-md hover:bg-brandPrimaryDarker disabled:opacity-50">
            {isSaving ? "Guardando..." : "Guardar Cambios"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditarPerfilModal;