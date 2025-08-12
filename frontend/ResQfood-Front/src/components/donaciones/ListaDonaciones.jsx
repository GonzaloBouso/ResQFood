import React from 'react';
import CardDonacion from './CardDonacion';

const ListaDonaciones = ({ donaciones, showManagement = false }) => {
  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {donaciones.map((d) => (
        <CardDonacion 
          key={d._id} 
          donacion={d} 
          showManagement={showManagement} 
        />
      ))}
    </div>
  );
};

export default ListaDonaciones;