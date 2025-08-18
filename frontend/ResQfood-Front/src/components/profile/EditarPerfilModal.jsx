import React, { useState, useEffect } from 'react';
import { useAuth } from '@clerk/clerk-react';
import { X } from 'lucide-react';
import API_BASE_URL from '../../api/config';

// --- Helpers para el Horario (copiados de CompleteProfilePage) ---
const diasSemana = ['LUNES', 'MARTES', 'MIERCOLES', 'JUEVES', 'VIERNES', 'SABADO', 'DOMINGO'];
const generarOpcionesHora = () => {
    const opciones = [];
    for (let h = 0; h < 24; h++) {
        for (let m = 0; m < 60; m += 30) {
            opciones.push(`${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`);
        }
    }
    opciones.push("23:59");
    return opciones;
};
const opcionesHora = generarOpcionesHora();

const EditarPerfilModal = ({ userData, onClose, onProfileUpdate }) => {
  const { getToken } = useAuth();
  
  const [formData, setFormData] = useState({
    nombre: userData.nombre || '',
    telefono: userData.telefono || '',
    localData: {
      tipoNegocio: userData.localData?.tipoNegocio || '',
      descripcionEmpresa: userData.localData?.descripcionEmpresa || '',
    },
  });
  
  // --- Estados para el Horario ---
  const [diaInicio, setDiaInicio] = useState('LUNES');
  const [diaFin, setDiaFin] = useState('VIERNES');
  const [horaApertura, setHoraApertura] = useState('09:00');
  const [horaCierre, setHoraCierre] = useState('18:00');

  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState(null);

  // Efecto para parsear y establecer el horario existente al abrir el modal
  useEffect(() => {
      if (userData.rol === 'LOCAL' && userData.localData?.horarioAtencion) {
          // Lógica simple de parsing (se puede mejorar si los formatos son más complejos)
          const parts = userData.localData.horarioAtencion.split(' ');
          if (parts.length >= 5) { // ej: LUNES a VIERNES de 09:00 a 18:00
            setDiaInicio(parts[0]);
            setDiaFin(parts[2]);
            setHoraApertura(parts[4]);
            setHoraCierre(parts[6]);
          }
      }
  }, [userData]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleLocalDataChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, localData: { ...prev.localData, [name]: value } }));
  };

  const handleSubmit = async () => {
    setIsSaving(true);
    setError(null);
    try {
      const token = await getToken();
      const payload = {
        nombre: formData.nombre,
        telefono: formData.telefono,
      };
      
      if (userData.rol === 'LOCAL') {
        const horarioString = (diaInicio === diaFin) 
            ? `${diaInicio} de ${horaApertura} a ${horaCierre}`
            : `${diaInicio} a ${diaFin} de ${horaApertura} a ${horaCierre}`;
        
        payload.localData = { 
            ...formData.localData, 
            horarioAtencion: horarioString 
        };
      }

      const response = await fetch(`${API_BASE_URL}/api/usuario/me`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify(payload),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Error al actualizar el perfil.');
      
      onProfileUpdate(data.user);
      onClose();
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

        <div className="p-6 space-y-4 overflow-y-auto">
          <div>
            <label htmlFor="nombre" className="block text-sm font-medium text-gray-700">Nombre</label>
            <input type="text" name="nombre" id="nombre" value={formData.nombre} onChange={handleInputChange} className="mt-1 block w-full input-style"/>
          </div>
          <div>
            <label htmlFor="telefono" className="block text-sm font-medium text-gray-700">Teléfono</label>
            <input type="tel" name="telefono" id="telefono" value={formData.telefono} onChange={handleInputChange} className="mt-1 block w-full input-style"/>
          </div>

          {userData.rol === 'LOCAL' && (
            <fieldset className="border p-4 rounded-md mt-4">
              <legend className="text-sm font-medium text-textMain px-1">Información del Local</legend>
              <div className="space-y-4 mt-2">
                <div>
                  <label htmlFor="tipoNegocio" className="block text-xs font-medium text-textMuted">Tipo de Negocio</label>
                  <input type="text" name="tipoNegocio" id="tipoNegocio" value={formData.localData.tipoNegocio} onChange={handleLocalDataChange} className="mt-1 block w-full input-style" />
                </div>
                
                <div className="border-t pt-4 mt-4">
                  <h4 className="text-sm font-medium text-textMain mb-2">Horario de Atención</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="diaInicioSelect" className="block text-xs font-medium text-textMuted">Desde</label>
                      <select id="diaInicioSelect" value={diaInicio} onChange={(e) => setDiaInicio(e.target.value)} className="mt-1 block w-full input-style">
                        {diasSemana.map(dia => <option key={`inicio-${dia}`} value={dia}>{dia}</option>)}
                      </select>
                    </div>
                    <div>
                      <label htmlFor="diaFinSelect" className="block text-xs font-medium text-textMuted">Hasta</label>
                      <select id="diaFinSelect" value={diaFin} onChange={(e) => setDiaFin(e.target.value)} className="mt-1 block w-full input-style">
                        {diasSemana.map(dia => <option key={`fin-${dia}`} value={dia}>{dia}</option>)}
                      </select>
                    </div>
                    <div>
                      <label htmlFor="horaAperturaSelect" className="block text-xs font-medium text-textMuted">Abre</label>
                      <select id="horaAperturaSelect" value={horaApertura} onChange={(e) => setHoraApertura(e.target.value)} className="mt-1 block w-full input-style">
                        {opcionesHora.map(hora => <option key={`apertura-${hora}`} value={hora}>{hora}</option>)}
                      </select>
                    </div>
                    <div>
                      <label htmlFor="horaCierreSelect" className="block text-xs font-medium text-textMuted">Cierra</label>
                      <select id="horaCierreSelect" value={horaCierre} onChange={(e) => setHoraCierre(e.target.value)} className="mt-1 block w-full input-style">
                        {opcionesHora.map(hora => <option key={`cierre-${hora}`} value={hora}>{hora}</option>)}
                      </select>
                    </div>
                  </div>
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