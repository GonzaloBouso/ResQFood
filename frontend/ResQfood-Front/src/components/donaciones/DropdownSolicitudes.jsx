import { useState } from 'react';
import { ChevronDown, ChevronRight } from 'lucide-react';
import Modal from './Modal';
import FormularioConfirmacionSolicitud from './FormularioConfirmacion';

const DropdownSolicitudes = ({ solicitudes, solicitudAceptada }) => {
  const [open, setOpen] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [solicitudSeleccionada, setSolicitudSeleccionada] = useState(null);

  const handleAceptar = (solicitud) => {
    setSolicitudSeleccionada(solicitud);
    setModalVisible(true);
  };

  const handleFormularioSubmit = (data) => {
    console.log("Datos enviados:", { ...data, solicitud: solicitudSeleccionada });
    setModalVisible(false);
    // TODO: enviar a backend cuando esté implementado
  };

  return (
    <div className="bg-white text-black rounded-lg shadow-md overflow-hidden w-full">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-4 py-3 text-left font-medium text-sm hover:bg-gray-100 transition"
      >
        <span>Lista de solicitudes ({solicitudes.length})</span>
        {open ? <ChevronDown className="w-5 h-5 rotate-180" /> : <ChevronRight className="w-5 h-5" />}
      </button>

      {open && (
        <div className="divide-y border-t px-4 pb-3">
          {solicitudes.length === 0 ? (
            <p className="text-sm py-3 text-gray-500">No hay solicitudes aún.</p>
          ) : (
            solicitudes.map((s, idx) => (
              <div key={idx} className="py-3 flex flex-col sm:flex-row justify-between sm:items-center">
                <div className="text-sm">
                  <p><strong>Usuario:</strong> {s.usuario}</p>
                  <p><strong>Cantidad:</strong> {s.cantidad}</p>
                </div>
                <div className="flex gap-2 mt-2 sm:mt-0">
                    <div
                    title={solicitudAceptada ? "Ya hay una solicitud aceptada para esta donación" : ""}
                    className="inline-block"
                    >
                        <button
                            onClick={() => handleAceptar(s)}
                            className={`text-xs px-3 py-1 rounded transition ${
                            solicitudAceptada
                                ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                                : 'bg-green-500 hover:bg-green-600 text-white'
                            }`}
                            disabled={!!solicitudAceptada}
                        >
                            Aceptar
                        </button>
                    </div>


                  <button
                    className="bg-red-500 hover:bg-red-600 text-white text-xs px-3 py-1 rounded transition"
                  >
                    Rechazar
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      <Modal isOpen={modalVisible} onClose={() => setModalVisible(false)}>
        <h2 className="text-lg font-semibold mb-4">Confirmar solicitud</h2>
        <FormularioConfirmacionSolicitud onSubmit={handleFormularioSubmit} />
      </Modal>
    </div>
  );
};

export default DropdownSolicitudes;
