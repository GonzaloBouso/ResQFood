import CardSolicitud from './CardSolicitud';

const ListaSolicitudes = ({solicitudes}) => {

  return (
    <div className="flex flex-col gap-4">
      {solicitudes.map((s) => (
        <CardSolicitud key={s._id} solicitud={s} />
      ))}
    </div>
  );
};

export default ListaSolicitudes;
