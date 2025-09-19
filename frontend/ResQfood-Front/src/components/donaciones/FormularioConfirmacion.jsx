import { useState } from 'react';
//confirmacion del solicitante a lo propuesto por el donante
const FormularioConfirmacion= ({ onSubmit }) => {
  const [fechaDesde, setFechaDesde] = useState(new Date().toISOString().split('T')[0]);
  const [fechaHasta, setFechaHasta] = useState('');
  const [horaDesde, setHoraDesde] = useState('');
  const [horaHasta, setHoraHasta] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({ fechaDesde, fechaHasta, horaDesde, horaHasta });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 text-sm text-gray-700">
      <div>
        <label className="block font-medium">Fecha de retiro: desde</label>
        <input type="date" value={fechaDesde} onChange={(e) => setFechaDesde(e.target.value)} className="w-full border rounded p-2" required />
      </div>
      <div>
        <label className="block font-medium">Fecha de retiro: hasta</label>
        <input type="date" value={fechaHasta} onChange={(e) => setFechaHasta(e.target.value)} className="w-full border rounded p-2" />
        <p className="text-xs text-gray-500">Podés dejarlo vacío si es indefinida.</p>
      </div>
      <div>
        <label className="block font-medium">Hora de retiro: desde</label>
        <input type="time" value={horaDesde} onChange={(e) => setHoraDesde(e.target.value)} className="w-full border rounded p-2" required />
      </div>
      <div>
        <label className="block font-medium">Hora de retiro: hasta</label>
        <input type="time" value={horaHasta} onChange={(e) => setHoraHasta(e.target.value)} className="w-full border rounded p-2" required />
      </div>
      <button type="submit" className="w-full bg-black text-white py-2 rounded hover:bg-gray-800 transition">
        Confirmar
      </button>
    </form>
  );
};

export default FormularioConfirmacion;
