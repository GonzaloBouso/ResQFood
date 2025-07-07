import CardDonacion from './CardDonacion';

const ListaDonaciones = () => {
  const donaciones = [
    {
      _id: "1",
      producto: "Hamburguesa clásica",
      cantidadDisponible: 1,
      imagenUrl: "https://i.imgur.com/5xkYw2K.png",
      solicitudes: [
        { usuario: "Milagros", cantidad: 1 },
        { usuario: "Julián", cantidad: 1 },
      ],
      solicitudAceptada: {
        usuario: "Camila",
        direccion: "Av. Siempre Viva 742",
        codigo: "A1B2C3",
      },
    },
    {
      _id: "2",
      producto: "Hamburguesa con cheddar",
      cantidadDisponible: 1,
      imagenUrl: "https://i.imgur.com/HtGJGQf.png",
      solicitudes: [
        { usuario: "Pedro", cantidad: 1 },
      ],
      solicitudAceptada: null,
    },
    {
      _id: "3",
      producto: "Hamburguesa veggie",
      cantidadDisponible: 1,
      imagenUrl: "https://i.imgur.com/3pHcZaS.png",
      solicitudes: [],
      solicitudAceptada: null,
    },
  ];

  return (
    <div className="flex flex-col gap-4">
      {donaciones.map((donacion) => (
        <CardDonacion key={donacion._id} donacion={donacion} />
      ))}
    </div>
  );
};

export default ListaDonaciones;
