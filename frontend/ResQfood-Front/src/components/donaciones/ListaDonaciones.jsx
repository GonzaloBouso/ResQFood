import CardDonacion from './CardDonacion';

const ListaDonaciones = ({donaciones}) => {
  return (
    <div className="flex flex-col gap-4">
      {donaciones.map((donacion, i) => (
        <CardDonacion key={donacion._id || i} donacion={donacion} />
      ))}
    </div>
  );
};

export default ListaDonaciones;
