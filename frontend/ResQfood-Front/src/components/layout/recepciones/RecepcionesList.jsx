import React from 'react';
import RecepcionCard from './RecepcionCard';

export default function RecepcionesList({ recepciones, onVerMas }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {recepciones.map((ent) => (
        <RecepcionCard
          key={ent._id}
          entrega={ent}
          onClick={() => onVerMas(ent)}
        />
      ))}
    </div>
  );
}
