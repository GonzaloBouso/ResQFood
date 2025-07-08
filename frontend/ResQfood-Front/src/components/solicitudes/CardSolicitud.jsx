import DropdownInfoAlimento from './DropdownInfoAlimento';
import EstadoRetiroSwitch from './EstadoRetiroSwitch';

const CardSolicitud = ({ solicitud }) => {
  const { producto, cantidadSolicitada, imagenUrl, estado } = solicitud;

  return (
    <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-4 w-full max-w-screen-md mx-auto text-gray-800">
      <div className="flex flex-col md:flex-row gap-4 items-center">
        <img src={imagenUrl} alt={producto} className="w-24 h-24 object-cover rounded-md" />
        <div className="flex-1">
          <p className="font-semibold text-base">Producto: {producto}</p>
          <p className="text-sm text-gray-600">Cantidad solicitada: {cantidadSolicitada}</p>
        </div>
      </div>

      <div className="mt-4 space-y-3">
        <DropdownInfoAlimento solicitud={solicitud} />
        <EstadoRetiroSwitch solicitud={solicitud} />
      </div>
    </div>
  );
};

export default CardSolicitud;
