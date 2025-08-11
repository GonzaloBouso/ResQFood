import CardDonacion from './CardDonacion';

const ListaDonaciones = ({ donaciones }) => {
  return (
    <>
      {donaciones.map((d, i) => (
        <CardDonacion key={d._id || i} donacion={d} />
      ))}
    </>
  );
};

export default ListaDonaciones;

