
import { LoadScript } from '@react-google-maps/api';
import { LocationProvider } from '../components/map/LocationContext';
import LocationMap from '../components/map/LocationMap';
import LocationButton from '../components/map/LocationButton';
import LocationSearch from '../components/map/LocationSearch';
import ConfirmButton from '../components/map/ConfirmButton';

const GOOGLE_MAPS_API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

const libraries = ['places'];

function Location() {
  return (
    <LoadScript googleMapsApiKey={GOOGLE_MAPS_API_KEY} libraries={libraries}>
      <LocationProvider>
        <div className="p-4 space-y-4 max-w-2xl mx-auto">
          <LocationSearch />
          <LocationButton />
          <LocationMap />
          <ConfirmButton />
        </div>
      </LocationProvider>
    </LoadScript>
  );
}

export default Location;

