export default function BitacoraCard({ entrada }) {
  return (
    <div className="border rounded-md p-4 shadow-sm mb-4">
      <p className="text-sm text-gray-500">Fecha: {new Date(entrada.createdAt).toLocaleString()}</p>
      <p className="font-semibold">{entrada.accion}</p>
      <p className="text-sm">Motivo: {entrada.justificacionOMotivo}</p>
      <p className="text-sm text-gray-600">{JSON.stringify(entrada.detallesAdicionales)}</p>
    </div>
  );
}
