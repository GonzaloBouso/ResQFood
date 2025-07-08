import ListaDonaciones from '../components/donaciones/ListaDonaciones';

const Donaciones = () => {
  const donaciones = [
    {
      _id: "1",
      producto: "Hamburguesa clásica",
      cantidadDisponible: 5,
      imagenUrl: "https://i.imgur.com/5xkYw2K.png",
      solicitudes: [
        { usuario: "Milagros", cantidad: 1 },
        { usuario: "Julián", cantidad: 2 },
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
      cantidadDisponible: 3,
      imagenUrl: "https://i.imgur.com/HtGJGQf.png",
      solicitudes: [
        { usuario: "Pedro", cantidad: 1 },
      ],
      solicitudAceptada: null,
    },
    {
      _id: "3",
      producto: "Hamburguesa veggie",
      cantidadDisponible: 2,
      imagenUrl: "https://i.imgur.com/3pHcZaS.png",
      solicitudes: [],
      solicitudAceptada: null,
    },
  ];

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Tus Donaciones</h2>
      <ListaDonaciones donaciones={donaciones} />
    </div>
  );
};

export default Donaciones;

