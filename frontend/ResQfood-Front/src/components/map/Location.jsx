// src/components/map/Location.jsx
import { useState } from 'react';
// import { LoadScript } from '@react-google-maps/api'; // <<<--- ELIMINA ESTA LÍNEA
import { LocationProvider, useLocation } from './LocationContext'; // Asegúrate que la ruta a LocationContext sea correcta
import LocationSearch from './LocationSearch';
import LocationMap from './LocationMap';
import LocationButton from './LocationButton';
import ConfirmButton from './ConfirmButton';
import Modal from './Modal'; // Asegúrate que la ruta a Modal sea correcta
import { MapPin, ChevronDown } from 'lucide-react';

// const GOOGLE_MAPS_API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY; // <<<--- ELIMINA ESTA LÍNEA
// const libraries = ['places']; // <<<--- ELIMINA ESTA LÍNEA

// Este es el componente que realmente muestra la UI para seleccionar la ubicación
// y que probablemente se usa en el Header
export function LocationSelectorUI({ onOpen }) { // Cambiado el nombre y exportado para claridad
  const { location } = useLocation(); // Asumo que este hook viene de tu LocationContext

  return (
    <div
      onClick={onOpen}
      className="flex items-center space-x-1 cursor-pointer group truncate"
    >
      <MapPin size={16} className="text-textMuted group-hover:text-primary flex-shrink-0" />
      <span className="text-xs sm:text-sm text-textMain group-hover:text-primary truncate">
        {location?.address || 'Ingrese su ubicación'} {/* Añadido optional chaining por si location es null/undefined */}
      </span>
      <ChevronDown size={16} className="text-textMuted group-hover:text-primary flex-shrink-0" />
    </div>
  );
}

// Este componente maneja el Modal y la lógica de abrir/cerrar
// y SÍ necesita el LocationProvider, pero NO LoadScript
export function LocationModalWorkflow() { // Cambiado el nombre y exportado
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <LocationProvider> {/* LocationProvider es necesario para los componentes de mapa hijos */}
      <LocationSelectorUI onOpen={() => setIsModalOpen(true)} />

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <div className="space-y-4 p-1"> {/* Añadido un poco de padding al contenido del modal */}
          <h3 className="text-lg font-medium text-textMain mb-4">Seleccionar Ubicación</h3> {/* Título para el modal */}
          <LocationSearch />
          <LocationButton /> {/* Botón para usar geolocalización actual */}
          <div className="w-full h-64 sm:h-80 bg-gray-200 rounded"> {/* Contenedor con tamaño para el mapa */}
            <LocationMap />
          </div>
          <ConfirmButton onConfirm={() => setIsModalOpen(false)} />
        </div>
      </Modal>
    </LocationProvider>
  );
}

// Si tenías una PÁGINA llamada Location.jsx que solo envolvía esto,
// y ahora la lógica de LoadScript está en App.jsx, esa página podría ya no ser necesaria
// o simplemente renderizaría LocationModalWorkflow.
// Por ahora, exportaremos LocationModalWorkflow para usarlo donde se necesite.
// El export default original 'Location' ya no tiene sentido si solo envolvía LoadScript.

// Si necesitas un componente exportado por defecto que use esto:
// const LocationFeature = () => {
//   return <LocationModalWorkflow />;
// }
// export default LocationFeature;