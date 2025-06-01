// components/map/Location.jsx
import { useState } from 'react';
import { LoadScript } from '@react-google-maps/api';
import { LocationProvider, useLocation } from './LocationContext';
import LocationSearch from './LocationSearch';
import LocationMap from './LocationMap';
import LocationButton from './LocationButton';
import ConfirmButton from './ConfirmButton';
import Modal from './Modal';
import { MapPin, ChevronDown } from 'lucide-react';

const GOOGLE_MAPS_API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
const libraries = ['places'];

function LocationUI({ onOpen }) {
  const { location } = useLocation();

  return (
    <div
      onClick={onOpen}
      className="flex items-center space-x-1 cursor-pointer group truncate"
    >
      <MapPin size={16} className="text-textMuted group-hover:text-primary flex-shrink-0" />
      <span className="text-xs sm:text-sm text-textMain group-hover:text-primary truncate">
        {location.address || 'Ingrese su ubicación'}


      </span>
      <ChevronDown size={16} className="text-textMuted group-hover:text-primary flex-shrink-0" />
    </div>
  );
}

function LocationWithModal() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <LocationUI onOpen={() => setIsModalOpen(true)} />

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <div className="space-y-4">
          <LocationSearch />
          <LocationButton />
          <LocationMap />
          <ConfirmButton onConfirm={() => setIsModalOpen(false)} />
        </div>
      </Modal>
    </>
  );
}

export default function Location() {
  return (
    <LoadScript googleMapsApiKey={GOOGLE_MAPS_API_KEY} libraries={libraries}>
      <LocationProvider>
        <LocationWithModal />
      </LocationProvider>
    </LoadScript>
  );
}