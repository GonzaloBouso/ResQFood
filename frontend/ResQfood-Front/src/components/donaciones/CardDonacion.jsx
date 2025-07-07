import DropdownSolicitudes from './DropdownSolicitudes';
import SolicitudAceptada from './SolicitudAceptada';

const CardDonacion = ({ donacion }) => {
  const { producto, cantidadDisponible, imagenUrl, solicitudes, solicitudAceptada } = donacion;

  return (
    <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-4 text-gray-800 w-full max-w-screen-md mx-auto">
      <div className="flex flex-col md:flex-row gap-4 items-center">
        <img
          src={imagenUrl}
          alt={producto}
          className="w-24 h-24 object-cover rounded-md"
        />
        <div className="flex-1">
          <p className="font-semibold text-base">Producto: {producto}</p>
          <p className="text-sm text-gray-600">Cantidad disponible: {cantidadDisponible}</p>
        </div>
        <button className="bg-red-500 hover:bg-red-600 text-white text-sm px-4 py-1 rounded transition">
  Eliminar
</button>


      </div>

      <div className="mt-4 space-y-2">
        <DropdownSolicitudes solicitudes={solicitudes} solicitudAceptada={solicitudAceptada} />

        <SolicitudAceptada solicitud={solicitudAceptada} />
      </div>
    </div>
  );
};

export default CardDonacion;
