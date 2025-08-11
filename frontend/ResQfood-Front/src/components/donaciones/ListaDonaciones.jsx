import React from 'react';
import CardDonacion from './CardDonacion';

const ListaDonaciones = ({ donaciones, onEliminar }) => {
  return (
    <>
      {donaciones.map((d, i) => (
        <CardDonacion key={d._id || i} donacion={d} onEliminar={onEliminar} />
      ))}
    </>
  );
};

export default ListaDonaciones;



