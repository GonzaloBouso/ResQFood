import { useLocation } from './LocationContext';

// dentro del componente App, luego del <LocationMap />
export default function ConfirmButton() {
  const { location } = useLocation();

  const handleConfirm = () => {
    console.log('Ubicación confirmada:', location);
    // Aquí podrías guardar en backend o redirigir
    // Por ejemplo:
    // axios.post('/api/guardar-ubicacion', location);
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
