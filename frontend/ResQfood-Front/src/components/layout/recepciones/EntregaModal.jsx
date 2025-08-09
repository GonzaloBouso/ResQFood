import React from 'react';

const Badge = ({ children, tone = "gray" }) => {
  const tones = {
    gray: "bg-gray-100 text-gray-800",
    green: "bg-green-100 text-green-800",
    red: "bg-red-100 text-red-800",
    yellow: "bg-yellow-100 text-yellow-800",
  };
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${tones[tone] || tones.gray}`}>
      {children}
    </span>
  );
};

const estadoToTone = (estado) => {
  if (estado === "COMPLETADA") return "green";
  if (estado?.startsWith("CANCELADA")) return "yellow";
  if (estado?.startsWith("FALLIDA")) return "red";
  return "gray";
};

export default function EntregaModal({ open, onClose, entrega, titulo = "Información de la entrega" }) {
  if (!open) return null;

  const d = entrega?.donacionId || {};
  const estado = entrega?.estadoEntrega || "—";
  const tone = estadoToTone(estado);

  const fechaResultado =
    entrega?.fechaCompletada || entrega?.fechaCancelada || entrega?.fechaFallida || entrega?.updatedAt || null;

  const fechaPropuestoIni = entrega?.fechaPropuesto?.fechaInicio ? new Date(entrega.fechaPropuesto.fechaInicio) : null;
  const fechaPropuestoFin = entrega?.fechaPropuesto?.fechaFin ? new Date(entrega.fechaPropuesto.fechaFin) : null;
  const fechaConfirmado = entrega?.fechaHorarioConfirmado ? new Date(entrega.fechaHorarioConfirmado) : null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />

      {/* Dialog */}
      <div className="relative w-full max-w-2xl bg-white rounded-xl shadow-xl p-5">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <h3 className="text-lg font-semibold">{titulo}</h3>
            <div className="flex items-center gap-2">
              <Badge tone={tone}>{estado}</Badge>
              {fechaResultado && (
                <span className="text-xs text-gray-500">
                  {estado === "COMPLETADA" ? "Completada" :
                   estado?.startsWith("CANCELADA") ? "Cancelada" :
                   estado?.startsWith("FALLIDA") ? "Fallida" : "Actualizado"}{" "}
                  el {new Date(fechaResultado).toLocaleString()}
                </span>
              )}
            </div>
          </div>
          <button className="text-gray-500 hover:text-gray-700" onClick={onClose}>✕</button>
        </div>

        {/* Body */}
        <div className="mt-4 space-y-4 text-sm text-gray-700">
          {/* Mini card donación */}
          <div className="flex gap-3">
            <img
              src={d.imagenesUrl?.[0] || "https://via.placeholder.com/140x100?text=Sin+imagen"}
              alt={d.titulo || "donación"}
              className="w-32 h-24 object-cover rounded-md border"
            />
            <div className="min-w-0">
              <p className="font-medium truncate">{d.titulo || "—"}</p>
              {d.descripcion && <p className="text-gray-600 line-clamp-2">{d.descripcion}</p>}
            </div>
          </div>

          {/* Timeline */}
          <div className="bg-gray-50 rounded-lg p-3">
            <p className="text-xs font-medium text-gray-600 mb-1">Timeline</p>
            <ul className="text-sm space-y-1">
              <li>Propuesto: {fechaPropuestoIni ? fechaPropuestoIni.toLocaleString() : "—"} {fechaPropuestoFin ? `→ ${fechaPropuestoFin.toLocaleString()}` : ""}</li>
              <li>Confirmado por solicitante: {fechaConfirmado ? fechaConfirmado.toLocaleString() : "—"}</li>
              <li>Resultado: {fechaResultado ? new Date(fechaResultado).toLocaleString() : "—"}</li>
            </ul>
          </div>

          {/* Ubicación (si aporta) */}
          {d?.ubicacionRetiro?.direccion && (
            <div>
              <p className="font-medium">Lugar de retiro</p>
              <p className="text-gray-600">
                {d.ubicacionRetiro.direccion}
                {d.ubicacionRetiro.referencia ? ` — ${d.ubicacionRetiro.referencia}` : ""}
              </p>
            </div>
          )}

          {/* Participantes */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            <p><span className="font-medium">Donante:</span> {entrega?.donanteId?.nombre || "—"}</p>
            <p><span className="font-medium">Receptor:</span> {entrega?.receptorId?.nombre || "—"}</p>
          </div>

          {/* Notas (si hay) */}
          {entrega?.notasEntrega && (
            <div>
              <p className="font-medium">Notas</p>
              <p className="text-gray-600">{entrega.notasEntrega}</p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="mt-5 flex justify-end">
          <button className="px-3 py-2 text-sm border rounded-md hover:bg-gray-50" onClick={onClose}>Cerrar</button>
        </div>
      </div>
    </div>
  );
}
