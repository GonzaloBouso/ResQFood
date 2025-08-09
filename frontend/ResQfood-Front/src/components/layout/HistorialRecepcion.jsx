import React, { useState } from 'react';
import { useAuth } from '@clerk/clerk-react';
import useRecepcionesFinalizadas from '../../hooks/useRecepcionesFinalizadas';
import RecepcionesList from './recepciones/RecepcionesList';
import EntregaModal from './recepciones/EntregaModal';

const HistorialRecepcion = ({ userId }) => {
  const { getToken } = useAuth();
  const { items, loading, error } = useRecepcionesFinalizadas(userId, getToken);

  const [open, setOpen] = useState(false);
  const [entregaSel, setEntregaSel] = useState(null);

  const abrirModal = (entrega) => { setEntregaSel(entrega); setOpen(true); };
  const cerrarModal = () => { setOpen(false); setEntregaSel(null); };

  if (loading) return <div className="text-center py-4">Cargando recepciones...</div>;
  if (error)   return <div className="text-center py-4 text-red-600">{error}</div>;
  if (!items.length) return <div className="text-center py-4 text-gray-600">No hay recepciones finalizadas.</div>;

  return (
    <>
      <RecepcionesList recepciones={items} onVerMas={abrirModal} />
      <EntregaModal open={open} onClose={cerrarModal} entrega={entregaSel} titulo="Detalle de la entrega" />
    </>
  );
};

export default HistorialRecepcion;

