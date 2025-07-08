const EstadoRetiroSwitch = ({ solicitud }) => {
  const { estado, infoRetiro } = solicitud;

  const baseClass = "bg-white rounded-md shadow border text-sm px-4 py-3";

  switch (estado) {
    case "pendiente_confirmacion_donador":
      return <div className={baseClass}>🕓 El donador aún no aceptó tu solicitud.</div>;

    case "pendiente_confirmacion_solicitante":
      return (
        <div className={baseClass + " space-y-2"}>
          <p><strong>Dirección:</strong> {infoRetiro.direccion}</p>
          <p><strong>Fecha:</strong> {infoRetiro.fecha}</p>
          <p><strong>Hora:</strong> {infoRetiro.horaDesde} - {infoRetiro.horaHasta}</p>
          <div className="flex gap-2">
            <button className="bg-green-500 hover:bg-green-600 text-white text-xs px-3 py-1 rounded">Confirmar retiro</button>
            <button className="bg-red-500 hover:bg-red-600 text-white text-xs px-3 py-1 rounded">Descartar</button>
          </div>
        </div>
      );

    case "Lista_para_retiro":
      return (
        <div className={baseClass + " space-y-1"}>
          <p><strong>Dirección:</strong> {infoRetiro.direccion}</p>
          <p><strong>Fecha:</strong> {infoRetiro.fecha}</p>
          <p><strong>Hora:</strong> {infoRetiro.horaDesde} - {infoRetiro.horaHasta}</p>
        </div>
      );

    case "COMPLETADA":
      return (
        <div className={baseClass + " space-y-1"}>
          <p><strong>Dirección:</strong> {infoRetiro.direccion}</p>
          <p><strong>Fecha:</strong> {infoRetiro.fecha}</p>
          <p><strong>Hora:</strong> {infoRetiro.horaDesde} - {infoRetiro.horaHasta}</p>
          <p className="text-green-600 font-semibold">✔️ Entregada</p>
        </div>
      );

    case "CANCELADA_POR_DONANTE":
      return <div className={baseClass}>❌ El donante ha cancelado la solicitud.</div>;

    case "CANCELADA_POR_SOLICITANTE":
      return <div className={baseClass}>❌ Has cancelado esta solicitud.</div>;

    case "FALLIDA_RECEPTOR_NO_ASISTIO":
      return <div className={baseClass}>⚠️ No asististe al retiro.</div>;

    default:
      return <div className={baseClass}>ℹ️ Estado desconocido.</div>;
  }
};

export default EstadoRetiroSwitch;
