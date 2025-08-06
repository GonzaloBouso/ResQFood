import { useState } from "react";
import AdminTabs from "../components/admin/AdminTabs";
import ListaReportesPorTipo from "../components/admin/ListaReportesPorTipo";
import BitacoraCard from "../components/admin/BitacoraCard";
import { reportes } from "../data/reportes";
import { bitacora } from "../data/bitacora";

export default function AdminPage() {
  const [tab, setTab] = useState("Reportes");

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h1 className="text-2xl font-bold">Panel del Administrador</h1>
      <AdminTabs selected={tab} setSelected={setTab} />
      <div className="mt-4">
        {tab === "Reportes" && <ListaReportesPorTipo reportes={reportes} />}
        {tab === "Bitácora" &&
          bitacora.map((entrada) => <BitacoraCard key={entrada._id} entrada={entrada} />)}
      </div>
    </div>
  );
}
