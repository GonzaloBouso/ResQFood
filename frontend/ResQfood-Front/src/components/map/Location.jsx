// src/components/map/Location.jsx
import React, { useState, useCallback, useRef } from 'react';
import { GoogleMap, Marker, Autocomplete } from '@react-google-maps/api';
import Modal from './Modal';
import { MapPin, ChevronDown, LocateFixed } from 'lucide-react';

// --- ESTILOS Y CONFIGURACIÓN DEL MAPA ---
const mapContainerStyle = { width: '100%', height: '250px' };
const mapOptions = { disableDefaultUI: true, zoomControl: true };
const initialCenter = { lat: -34.6037, lng: -58.3816 }; // Buenos Aires

// --- COMPONENTE PRINCIPAL ---
export function LocationModalWorkflow({ onLocationSelected, currentDisplayAddress }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState(initialCenter);
  const [selectedAddress, setSelectedAddress] = useState("Buenos Aires, Argentina");
  
  const mapRef = useRef(null);
  const autocompleteRef = useRef(null);
  const searchInputRef = useRef(null);

  const onLoadMap = useCallback(map => (mapRef.current = map), []);
  const onLoadAutocomplete = useCallback(ac => (autocompleteRef.current = ac), []);

  const handleMapClick = useCallback((e) => {
    const lat = e.latLng.lat();
    const lng = e.latLng.lng();
    const newPos = { lat, lng };
    setSelectedLocation(newPos);
    
    // Reverse Geocode para obtener la dirección
    const geocoder = new window.google.maps.Geocoder();
    geocoder.geocode({ location: newPos }, (results, status) => {
        if (status === 'OK' && results[0]) {
            setSelectedAddress(results[0].formatted_address);
        } else {
            setSelectedAddress(`Lat: ${lat.toFixed(4)}, Lng: ${lng.toFixed(4)}`);
        }
    });
  }, []);

 
  const handlePlaceChanged = useCallback(() => {
    if (autocompleteRef.current) {
        const place = autocompleteRef.current.getPlace();
        if (place.geometry?.location) {
            const lat = place.geometry.location.lat();
            const lng = place.geometry.location.lng();
            const newPos = { lat, lng };
            
            setSelectedLocation(newPos);
            setSelectedAddress(place.formatted_address || "Ubicación seleccionada");

            
            if (mapRef.current) {
                mapRef.current.panTo(newPos);
                mapRef.current.setZoom(15);
            }
        }
    }
  }, []);
  
  const handleUseMyCurrentLocation = () => {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            (position) => {
                const { latitude, longitude } = position.coords;
                const newPos = { lat: latitude, lng: longitude };
                
                
                if (mapRef.current) {
                    mapRef.current.panTo(newPos);
                    mapRef.current.setZoom(15);
                }
                handleMapClick({ latLng: { lat: () => latitude, lng: () => longitude } });
            },
            () => alert("No se pudo obtener la ubicación.")
        );
    }
  };

  const handleConfirm = () => {
    if (onLocationSelected) {
    
        onLocationSelected({ 
            lat: selectedLocation.lat, 
            lng: selectedLocation.lng, 
            address: selectedAddress 
        });
    }
    setIsModalOpen(false);
  };

  return (
    <>
      {/* El botón en el Header que abre el modal */}
      <div
        onClick={() => setIsModalOpen(true)}
        className="flex items-center space-x-1 cursor-pointer group truncate max-w-[200px] sm:max-w-[250px]"
        title={currentDisplayAddress}
      >
        <MapPin size={16} className="text-gray-500 group-hover:text-primary flex-shrink-0" />
        <span className="text-xs sm:text-sm text-gray-700 group-hover:text-primary truncate">
          {currentDisplayAddress}
        </span>
        <ChevronDown size={16} className="text-gray-500 group-hover:text-primary flex-shrink-0" />
      </div>

      {/* El Modal */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <div className="space-y-4 p-1">
            <h3 className="text-lg font-medium text-gray-800 mb-4">Seleccionar Ubicación</h3>

            {/* El input de búsqueda */}
            <Autocomplete onLoad={onLoadAutocomplete} onPlaceChanged={handlePlaceChanged}>
                <input
                    type="text"
                    placeholder="Escribe tu dirección"
                    ref={searchInputRef}
                    className="w-full p-2 border border-gray-300 rounded-md shadow-sm"
                />
            </Autocomplete>
            
            {/* El mapa */}
            <div className="w-full h-64 sm:h-80 bg-gray-200 rounded">
                <GoogleMap
                    mapContainerStyle={mapContainerStyle}
                    center={selectedLocation}
                    zoom={15}
                    onLoad={onLoadMap}
                    onClick={handleMapClick}
                    options={mapOptions}
                >
                    <Marker position={selectedLocation} />
                </GoogleMap>
            </div>

            {/* Botón de ubicación actual */}
            <button
                onClick={handleUseMyCurrentLocation}
                className="w-full flex items-center justify-center px-4 py-2 border border-gray-300 text-gray-700 rounded-md text-sm font-medium hover:bg-gray-50"
            >
                <LocateFixed size={16} className="mr-2" />
                Usar mi ubicación actual
            </button>
            
            {/* Botón de confirmar */}
            <button
                onClick={handleConfirm}
                className="w-full mt-2 px-4 py-2 bg-primary text-white rounded-md font-medium hover:bg-brandPrimaryDarker"
            >
                Confirmar Ubicación
            </button>
        </div>
      </Modal>
    </>
  );
}