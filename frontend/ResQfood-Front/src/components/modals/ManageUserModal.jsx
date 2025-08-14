import React, { useState } from 'react';
import { useAuth } from '@clerk/clerk-react';
import { X } from 'lucide-react';
import API_BASE_URL from '../../api/config';

const ManageUserModal = ({ user, onClose, onUpdate }) => {
  const { getToken } = useAuth();
  
  // Estados para los nuevos valores, inicializados con los datos actuales del usuario
  const [newRole, setNewRole] = useState(user.rol);
  const [isActive, setIsActive] = useState(user.activo);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState(null);

  const handleSave = async () => {
    setIsSaving(true);
    setError(null);
    try {
      const token = await getToken();
      const payload = { rol: newRole, activo: isActive };

      const response = await fetch(`${API_BASE_URL}/api/usuario/${user._id}/manage`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.message || 'Error al actualizar el usuario.');
      }
      
      onUpdate(); // Llama a la función para refrescar la lista de usuarios
      onClose();  // Cierra el modal

    } catch (err) {
      setError(err.message);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl w-full max-w-md shadow-2xl">
        <div className="p-4 border-b flex justify-between items-center">
          <h3 className="text-lg font-semibold">Gestionar Usuario</h3>
          <button onClick={onClose} className="p-1 rounded-full hover:bg-gray-100"><X size={20} /></button>
        </div>

        <div className="p-6 space-y-4">
          <div>
            <p className="text-sm text-gray-500">Nombre</p>
            <p className="font-semibold">{user.nombre || '-'}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Email</p>
            <p className="font-semibold">{user.email}</p>
          </div>
          <div>
            <label htmlFor="rol-select" className="block text-sm font-medium text-gray-700">Rol</label>
            <select 
              id="rol-select" 
              value={newRole} 
              onChange={(e) => setNewRole(e.target.value)}
              className="mt-1 block w-full input-style"
            >
              <option value="GENERAL">General</option>
              <option value="LOCAL">Local</option>
              <option value="ADMIN">Admin</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Estado</label>
            <div className="mt-1 flex gap-4">
              <button onClick={() => setIsActive(true)} className={`px-3 py-1 text-sm rounded-md ${isActive ? 'bg-green-600 text-white' : 'bg-gray-200'}`}>Activo</button>
              <button onClick={() => setIsActive(false)} className={`px-3 py-1 text-sm rounded-md ${!isActive ? 'bg-red-600 text-white' : 'bg-gray-200'}`}>Suspendido</button>
            </div>
          </div>
        </div>

        {error && <p className="text-red-500 text-sm text-center px-6 pb-4">{error}</p>}
        
        <div className="p-4 bg-gray-50 border-t flex justify-end gap-3">
          <button onClick={onClose} className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border rounded-md hover:bg-gray-50">Cancelar</button>
          <button onClick={handleSave} disabled={isSaving} className="px-4 py-2 text-sm font-medium text-white bg-primary rounded-md hover:bg-brandPrimaryDarker disabled:opacity-50">
            {isSaving ? "Guardando..." : "Guardar Cambios"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ManageUserModal;