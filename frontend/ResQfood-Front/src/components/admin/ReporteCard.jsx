import { donaciones } from "../../data/donaciones";
import { entregas } from "../../data/entregas";
import { useState } from "react";
import { ChevronDown, ChevronUp, Info } from "lucide-react";

export default function ReporteCard({ reporte }) {
  const [showInfo, setShowInfo] = useState(false);
  const donacion = donaciones.find((d) => d._id === reporte.elementoReportadoId);
  const entrega = entregas.find((e) => e._id === reporte.elementoReportadoId);
  const donacionAsociada = donaciones.find((d) => d._id === entrega?.donacionId);

  const renderInfo = () => (
    <div className={`overflow-hidden transition-all duration-300 ${showInfo ? "max-h-[1000px]" : "max-h-0"}`}>
      <div className="bg-blue-50 border border-blue-200 rounded-md p-4 mt-3 text-sm space-y-2">
        <div className="flex items-center gap-2 text-blue-700 font-medium mb-2">
          <Info className="w-5 h-5" />
          Información asociada
        </div>

        {reporte.tipoElementoReportado === "Publicacion" && donacion && (
          <>
            <p><span className="font-semibold">Título:</span> {donacion.titulo}</p>
            <p><span className="font-semibold">Descripción:</span> {donacion.descripcion}</p>
            <p><span className="font-semibold">Categoría:</span> {donacion.categoria}</p>
            <p><span className="font-semibold">Estado:</span> {donacion.estadoAlimento}</p>
            <p><span className="font-semibold">Dirección:</span> {donacion.ubicacionRetiro.direccion}</p>
          </>
        )}

        {reporte.tipoElementoReportado === "Entrega" && entrega && donacionAsociada && (
          <>
            <p><span className="font-semibold">Estado entrega:</span> {entrega.estadoEntrega}</p>
            <p><span className="font-semibold">Notas:</span> {entrega.notasEntrega}</p>
            <div className="pt-2 border-t">
              <p className="font-medium">Donación asociada:</p>
              <p><span className="font-semibold">Título:</span> {donacionAsociada.titulo}</p>
              <p><span className="font-semibold">Descripción:</span> {donacionAsociada.descripcion}</p>
            </div>
          </>
        )}
      </div>
    </div>
  );

  const renderBotones = () => {
    switch (reporte.tipoElementoReportado) {
      case "User":
        return (
          <>
            <button className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600">Eliminar Usuario</button>
            <button className="bg-yellow-400 text-black px-3 py-1 rounded hover:bg-yellow-500">Descartar Reporte</button>
            <button className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600">Ver Perfil</button>
          </>
        );
      case "Publicacion":
        return (
          <>
            <button className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600">Eliminar Publicación</button>
            <button className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600">Eliminar Donador</button>
            <button className="bg-yellow-400 text-black px-3 py-1 rounded hover:bg-yellow-500">Descartar Reporte</button>
            <button className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600">Ver Perfil Donador</button>
          </>
        );
      case "Entrega":
        return (
          <>
            <button className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600">Eliminar Publicación</button>
            <button className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600">Eliminar Donador</button>
            <button className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600">Eliminar Receptor</button>
            <button className="bg-yellow-400 text-black px-3 py-1 rounded hover:bg-yellow-500">Descartar Reporte</button>
            <button className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600">Ver Perfil Donador</button>
            <button className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600">Ver Perfil Receptor</button>
          </>
        );
      default:
        return null;
    }
  };

  return (
    <div className="rounded-lg border p-4 shadow-sm mb-6 bg-white">
      <div className="mb-3">
        <p className="text-sm text-gray-500">Tipo: {reporte.tipoElementoReportado}</p>
        <p className="font-semibold text-lg">Motivo: {reporte.motivo}</p>
        <p className="text-gray-700 text-sm">{reporte.descripcionAdicional || "Sin detalles adicionales."}</p>
      </div>

      {["Publicacion", "Entrega"].includes(reporte.tipoElementoReportado) && (
        <button
          onClick={() => setShowInfo(!showInfo)}
          className="flex items-center gap-2 text-sm text-gray-700 hover:text-black px-3 py-1 bg-gray-100 hover:bg-gray-200 rounded-md mb-2 transition"
        >
          {showInfo ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          <span>{showInfo ? "Ocultar información de la donación" : "Ver información de la donación"}</span>
        </button>
      )}

      {renderInfo()}

      <div className="flex flex-wrap gap-3 mt-4">
        {renderBotones()}
      </div>
    </div>
  );
}