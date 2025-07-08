import ListaSolicitudes from '../components/solicitudes/ListaSolicitudes';

const Solicitudes = () => {
  const solicitudes = [
    {
      _id: "1",
      producto: "Pan casero",
      cantidadSolicitada: 2,
      imagenUrl: "https://i.imgur.com/5xkYw2K.png",
      tipo: "Panificación",
      descripcion: "Hecho con harina integral",
      estado: "pendiente_confirmacion_donador",
    },
    {
      _id: "2",
      producto: "Leche",
      cantidadSolicitada: 1,
      imagenUrl: "https://i.imgur.com/HtGJGQf.png",
      tipo: "Lácteo",
      descripcion: "2 litros, larga vida",
      estado: "pendiente_confirmacion_solicitante",
      infoRetiro: {
        direccion: "Av. Belgrano 123",
        fecha: "2025-07-10",
        horaDesde: "10:00",
        horaHasta: "12:00"
      }
    },
    {
      _id: "3",
      producto: "Ensalada fresca",
      cantidadSolicitada: 1,
      imagenUrl: "https://i.imgur.com/3pHcZaS.png",
      tipo: "Verduras",
      descripcion: "Lechuga, tomate y zanahoria",
      estado: "COMPLETADA",
      infoRetiro: {
        direccion: "Calle 9 de Julio 321",
        fecha: "2025-07-05",
        horaDesde: "09:00",
        horaHasta: "10:00"
      }
    }
  ];

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Tus Solicitudes</h2>
      <ListaSolicitudes solicitudes={solicitudes} />
    </div>
  );
};

export default Solicitudes;
