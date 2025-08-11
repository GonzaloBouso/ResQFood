import CardDonacion from './CardDonacion';

const ListaDonaciones = ({donaciones}) => {
  return (
    <div className="flex flex-col gap-4">
      {donaciones.map((donacion) => (
        console.log(donacion)
      ))}
    </div>
  );
};

export default ListaDonaciones;
