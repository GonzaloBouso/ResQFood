import { useLocation } from './LocationContext';

export default function LocationButton() {
  const { setLocation } = useLocation();

  const handleGeolocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(async (pos) => {
        const lat = pos.coords.latitude;
        const lng = pos.coords.longitude;
        const geocoder = new window.google.maps.Geocoder();

        const result = await geocoder.geocode({ location: { lat, lng } });
        setLocation({
          lat,
          lng,
          address: result?.results?.[0]?.formatted_address || '',
        });
      });
    } else {
      alert('Geolocalización no soportada');
    }
  };

  return (
    <button onClick={handleGeolocation} className="px-4 py-2 bg-blue-500 text-white rounded">
      Usar mi ubicación actual
    </button>
  );
}
