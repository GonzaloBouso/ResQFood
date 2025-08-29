import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import toast from 'react-hot-toast';

// Helper para obtener la fecha de hoy en formato YYYY-MM-DD
const getTodayString = () => new Date().toISOString().split('T')[0];

const ProposeScheduleModal = ({ solicitud, onClose, onSubmit, isSubmitting }) => {
  // Estado inicializado con valores por defecto para mejor UX
  const [fecha, setFecha] = useState(getTodayString());
  const [horaInicio, setHoraInicio] = useState('09:00');
  const [horaFin, setHoraFin] = useState('10:00');

  // Efecto para asegurar que la hora de fin nunca sea anterior a la de inicio
  useEffect(() => {
    if (horaFin < horaInicio) {
      setHoraFin(horaInicio);
    }
  }, [horaInicio, horaFin]);


  const handleSubmit = (e) => {
    e.preventDefault();

    // Validación extra en el frontend para una mejor experiencia de usuario
    if (horaInicio >= horaFin) {
      toast.error('La hora de fin debe ser posterior a la hora de inicio.');
      return;
    }

    // --- CORRECCIÓN CLAVE ---
    // Creamos el objeto 'propuesta' de forma simple y plana,
    // exactamente como el backend (SolicitudController) lo espera.
    const propuesta = {
      fecha: fecha,
      horaInicio: horaInicio,
      horaFin: horaFin
    };

    // Llamamos a la función del componente padre con los datos correctos
    onSubmit(solicitud._id, propuesta);
  };

  if (!solicitud) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50 backdrop-blur-sm">
      <div className="bg-white rounded-xl shadow-2xl p-0 w-full max-w-md animate-fade-in-up">
        <div className="flex justify-between items-center p-4 border-b">
          <h2 className="text-xl font-bold">Proponer Horario de Entrega</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-800 p-1 rounded-full hover:bg-gray-100">
            <X size={24} />
          </button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="p-6 space-y-4">
            <p className="text-sm text-gray-600">
              Proponle un día y un rango horario a <strong className="text-primary">{solicitud.solicitanteId?.nombre}</strong> para retirar la donación.
            </p>
            <div>
              <label htmlFor="fecha" className="block text-sm font-medium text-gray-700">Fecha de la entrega</label>
              <input 
                type="date" 
                id="fecha" 
                value={fecha} 
                onChange={e => setFecha(e.target.value)} 
                required 
                className="mt-1 block w-full input-style" // Usando un estilo consistente
                min={getTodayString()} // No permitir fechas pasadas
              />
            </div>
            <div className="flex gap-4">
              <div className="w-1/2">
                <label htmlFor="horaInicio" className="block text-sm font-medium text-gray-700">Desde las</label>
                <input 
                  type="time" 
                  id="horaInicio" 
                  value={horaInicio} 
                  onChange={e => setHoraInicio(e.target.value)} 
                  required 
                  className="mt-1 block w-full input-style"
                />
              </div>
              <div className="w-1/2">
                <label htmlFor="horaFin" className="block text-sm font-medium text-gray-700">Hasta las</label>
                <input 
                  type="time" 
                  id="horaFin" 
                  value={horaFin} 
                  onChange={e => setHoraFin(e.target.value)} 
                  required 
                  className="mt-1 block w-full input-style"
                  min={horaInicio} // La hora de fin no puede ser anterior a la de inicio
                />
              </div>
            </div>
          </div>
          <div className="flex justify-end gap-3 p-4 bg-gray-50 border-t rounded-b-xl">
            <button type="button" onClick={onClose} className="px-4 py-2 rounded-md text-sm font-medium text-gray-700 bg-white border hover:bg-gray-50">
              Cancelar
            </button>
            <button type="submit" disabled={isSubmitting} className="px-4 py-2 rounded-md text-sm font-medium text-white bg-primary hover:bg-brandPrimaryDarker disabled:opacity-50">
              {isSubmitting ? 'Enviando...' : 'Enviar Propuesta'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProposeScheduleModal;