import { useLocation } from './LocationContext';

export default function ConfirmButton(props) {
  const { location } = useLocation();

  const handleConfirm = () => {
    console.log('Ubicación confirmada:', location);

    console.log('calle', location.address.street)

    if (props?.onConfirm && typeof props.onConfirm === 'function') {
      props.onConfirm();
    }
  };

  return (
    <button
      onClick={handleConfirm}
      className="px-4 py-2 bg-green-600 text-white rounded"
    >
      Confirmar ubicación
    </button>
  );
}
