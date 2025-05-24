import { useEffect, useRef } from 'react';
import { useLocation } from './LocationContext';

export default function LocationMap() {
  const { location, setLocation } = useLocation();
  const mapRef = useRef(null);
  const markerRef = useRef(null);

  useEffect(() => {
    const map = new window.google.maps.Map(mapRef.current, {
      center: { lat: location.lat || -26.8241, lng: location.lng || -65.2226 },
      zoom: 15,
    });

    const marker = new window.google.maps.Marker({
      map,
      position: map.getCenter(),
      draggable: true,
    });

    marker.addListener('dragend', async (e) => {
      const lat = e.latLng.lat();
      const lng = e.latLng.lng();
      const geocoder = new window.google.maps.Geocoder();

      const result = await geocoder.geocode({ location: { lat, lng } });
      setLocation({
        lat,
        lng,
        address: result?.results?.[0]?.formatted_address || '',
      });
    });

    map.addListener('click', async (e) => {
      const lat = e.latLng.lat();
      const lng = e.latLng.lng();
      marker.setPosition(e.latLng);
      const geocoder = new window.google.maps.Geocoder();
      const result = await geocoder.geocode({ location: { lat, lng } });
      setLocation({
        lat,
        lng,
        address: result?.results?.[0]?.formatted_address || '',
      });
    });

    markerRef.current = marker;
  }, [location.lat, location.lng]);

  return <div ref={mapRef} style={{ width: '100%', height: '400px' }} />;
}
