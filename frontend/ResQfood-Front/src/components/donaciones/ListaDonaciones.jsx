import CardDonacion from './CardDonacion';

const ListaDonaciones = ({donaciones}) => {
  return (
    <div className="flex flex-col gap-4">
      {donaciones.map((donacion) => (
        <CardDonacion key={donacion._id} donacion={donacion} />
      ))}
    </div>
  );
};

export default ListaDonaciones;
