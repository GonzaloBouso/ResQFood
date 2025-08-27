import React, { useState } from 'react';
import { X } from 'lucide-react';

const ProposeScheduleModal = ({ solicitud, onClose, onSubmit, isSubmitting }) => {
  const [fecha, setFecha] = useState('');
  const [horaInicio, setHoraInicio] = useState('');
  const [horaFin, setHoraFin] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    const propuesta = {
      fechaPropuesto: { fechaInicio: fecha, fechaFin: fecha },
      horarioEntregaPropuestaPorDonante: { horarioInicio, horarioFin }
    };
    onSubmit(solicitud._id, propuesta);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Proponer Horario de Entrega</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-800"><X size={24} /></button>
        </div>
        <p className="text-sm mb-4">Proponle un día y un rango horario a <strong>{solicitud.solicitanteId?.nombre}</strong> para retirar la donación.</p>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="fecha" className="block text-sm font-medium text-gray-700">Fecha de la entrega</label>
            <input type="date" id="fecha" value={fecha} onChange={e => setFecha(e.target.value)} required className="mt-1 block w-full border-gray-300 rounded-md shadow-sm" min={new Date().toISOString().split('T')[0]}/>
          </div>
          <div className="flex gap-4">
            <div className="w-1/2">
              <label htmlFor="horaInicio" className="block text-sm font-medium text-gray-700">Desde las</label>
              <input type="time" id="horaInicio" value={horaInicio} onChange={e => setHoraInicio(e.target.value)} required className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"/>
            </div>
            <div className="w-1/2">
              <label htmlFor="horaFin" className="block text-sm font-medium text-gray-700">Hasta las</label>
              <input type="time" id="horaFin" value={horaFin} onChange={e => setHoraFin(e.target.value)} required className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"/>
            </div>
          </div>
          <div className="flex justify-end gap-4 pt-4">
            <button type="button" onClick={onClose} className="px-4 py-2 rounded text-gray-700 bg-gray-200 hover:bg-gray-300">Cancelar</button>
            <button type="submit" disabled={isSubmitting} className="px-4 py-2 rounded text-white bg-primary hover:bg-brandPrimaryDarker disabled:opacity-50">
              {isSubmitting ? 'Enviando...' : 'Enviar Propuesta'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
export default ProposeScheduleModal;