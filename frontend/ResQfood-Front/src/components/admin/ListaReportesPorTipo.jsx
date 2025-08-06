import React, { useState } from "react";
import ReporteCard from "./ReporteCard";

export default function ListaReportesPorTipo({ reportes }) {
  const tipos = ["User", "Publicacion", "Entrega"];
  const [abierto, setAbierto] = useState({
    User: true,
    Publicacion: false,
    Entrega: false,
  });

  const toggle = (tipo) => {
    setAbierto((prev) => ({ ...prev, [tipo]: !prev[tipo] }));
  };

  return (
    <div className="space-y-4">
      {tipos.map((tipo) => {
        const filtrados = reportes.filter(
          (r) => r.tipoElementoReportado === tipo
        );
        if (filtrados.length === 0) return null;

        return (
          <div key={tipo} className="border rounded-md">
            {/* Header del acordeón */}
            <button
              onClick={() => toggle(tipo)}
              className="w-full text-left px-4 py-3 bg-gray-100 hover:bg-gray-200 flex justify-between items-center"
            >
              <span className="font-semibold text-lg">
                Reportes de {tipo}
              </span>
              <span className="text-xl">
                {abierto[tipo] ? "−" : "+"}
              </span>
            </button>

            {/* Contenido del acordeón */}
            {abierto[tipo] && (
              <div className="p-4 space-y-4">
                {filtrados.map((reporte) => (
                  <ReporteCard key={reporte._id} reporte={reporte} />
                ))}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
