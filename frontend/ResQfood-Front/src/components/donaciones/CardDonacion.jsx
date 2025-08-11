import DropdownSolicitudes from './DropdownSolicitudes';
import SolicitudAceptada from './SolicitudAceptada';

const CardDonacion = ({ donacion }) => {
  const {
    _id,
    titulo,
    descripcion,
    imagenesUrl = [],
    categoria,
    estadoPublicacion,
    ubicacionRetiro,
    fechaVencimientoProducto,
    fechaElaboracion,
  } = donacion || {};

  const img = imagenesUrl[0] || '/placeholder.png';
  const dir = ubicacionRetiro?.direccion;
  const ciudadProv = [ubicacionRetiro?.ciudad, ubicacionRetiro?.provincia].filter(Boolean).join(', ');
  const fmt = (d) => (d ? new Date(d).toLocaleDateString() : '—');

  const onEliminar = async () => {
    // opcional: integrar con tu endpoint DELETE/update estado a CANCELADA_DONANTE
    // await fetch(`${API_BASE_URL}/api/donacion/${_id}`, { method:'DELETE', headers:{ Authorization:`Bearer ${token}` }});
  };

  return (
    <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-4 text-gray-800">
      <div className="flex items-start gap-4">
        <img src={img} alt={titulo} className="w-24 h-24 object-cover rounded-md" />
        <div className="flex-1 space-y-1">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold">{titulo}</h3>
            <span className="text-xs px-2 py-0.5 rounded-full bg-gray-100">{estadoPublicacion}</span>
          </div>

          {categoria && <p className="text-xs text-gray-500">Categoría: {categoria}</p>}
          {descripcion && <p className="text-sm text-gray-700 line-clamp-2">{descripcion}</p>}

          {(dir || ciudadProv) && (
            <p className="text-xs text-gray-500">
              Retiro: {dir ? `${dir}` : ''}{dir && ciudadProv ? ' · ' : ''}{ciudadProv}
            </p>
          )}

          <div className="flex gap-4 text-xs text-gray-500 pt-1">
            <span>Elaboración: {fmt(fechaElaboracion)}</span>
            <span>Vence: {fmt(fechaVencimientoProducto)}</span>
          </div>
        </div>
      </div>

      <div className="mt-3 flex gap-2">
        {/* Si ya tenés modal de detalles, conectá aquí */}
        <button className="bg-gray-100 hover:bg-gray-200 text-sm px-3 py-1 rounded">
          Ver detalles
        </button>
        <button
          onClick={onEliminar}
          className="bg-red-500 hover:bg-red-600 text-white text-sm px-3 py-1 rounded"
        >
          Eliminar
        </button>
      </div>
    </div>
  );
};

export default CardDonacion;
