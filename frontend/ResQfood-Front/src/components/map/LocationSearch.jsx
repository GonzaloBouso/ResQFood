import { useEffect, useRef } from 'react';
import { useLocation } from './LocationContext';

export default function LocationSearch() {
  const { location, setLocation } = useLocation();
  const inputRef = useRef(null);

  useEffect(() => {
    const autocomplete = new window.google.maps.places.Autocomplete(inputRef.current, {
      types: ['geocode'],
    });

    autocomplete.addListener('place_changed', () => {
      const place = autocomplete.getPlace();
      const lat = place.geometry.location.lat();
      const lng = place.geometry.location.lng();
      setLocation({
        lat,
        lng,
        address: place.formatted_address,
      });
    });
  }, []);

  return (
    <input
      ref={inputRef}
      defaultValue={location.address}
      placeholder="Escribe tu dirección"
      className="w-full p-2 border rounded"
    />
  );
}
