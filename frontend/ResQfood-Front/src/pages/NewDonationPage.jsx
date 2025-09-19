import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@clerk/clerk-react';
import { X } from 'lucide-react'; 
import { GoogleMap, Marker, Autocomplete } from '@react-google-maps/api'; 
import API_BASE_URL from '../api/config.js';


const mapContainerStyle = {
  width: '100%',
  height: '300px',
  borderRadius: '8px',
  marginBottom: '1rem',
};
const mapOptions = {
  disableDefaultUI: false,
  zoomControl: true,
  streetViewControl: false,
  mapTypeControl: false,
};
const initialMapCenter = {
  lat: -34.603722,
  lng: -58.381592,
};

const NewDonationPage = ({ onDonationCreated }) => {
  const navigate = useNavigate();
  const { getToken } = useAuth();

 
  const [formData, setFormData] = useState({
    titulo: '',
    descripcion: '',
    categoria: '',
    fechaVencimientoProducto: '',
    fechaElaboracion: '',
    ubicacionRetiro: {
      direccion: '', ciudad: '', provincia: '', pais: '', referenciasAdicionales: '',
      coordenadas: null, 
    },
    estadoAlimento: '',
    fechaExpiracionPublicacion: '',
    informacionContactoAlternativa: { telefono: '', email: '' },
    condicionesEspeciales: '',
  });

  const [selectedFiles, setSelectedFiles] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');
  const [validationErrors, setValidationErrors] = useState({}); 
  const [map, setMap] = useState(null);
  const [markerPosition, setMarkerPosition] = useState(null);
  const autocompleteInputRef = useRef(null);
  const [autocomplete, setAutocomplete] = useState(null);


  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (validationErrors[name]) {
      setValidationErrors(prev => ({...prev, [name]: null}));
    }
  };

  const handleUbicacionTextoChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, ubicacionRetiro: { ...prev.ubicacionRetiro, [name]: value } }));
  };

  const handleContactoAltChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, informacionContactoAlternativa: { ...prev.informacionContactoAlternativa, [name]: value } }));
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    const MAX_FILES = 5;
    const MAX_SIZE_MB = 5;
    if (files.length === 0) return;
    const filesToAdd = files.slice(0, MAX_FILES - selectedFiles.length);
    if (selectedFiles.length + filesToAdd.length > MAX_FILES) {
      alert(`Puedes subir un máximo de ${MAX_FILES} imágenes en total.`);
      e.target.value = null; return;
    }
    const newValidFiles = []; const newValidPreviews = [];
    for (const file of filesToAdd) {
      if (file.size > MAX_SIZE_MB * 1024 * 1024) {
        alert(`El archivo "${file.name}" es demasiado grande (Máx ${MAX_SIZE_MB}MB).`); continue;
      }
      newValidFiles.push(file); newValidPreviews.push(URL.createObjectURL(file));
    }
    setSelectedFiles(prev => [...prev, ...newValidFiles]);
    setImagePreviews(prev => [...prev, ...newValidPreviews]);
    e.target.value = null;
  };
  
  const removeImage = (indexToRemove) => {
    URL.revokeObjectURL(imagePreviews[indexToRemove]);
    setSelectedFiles(prev => prev.filter((_, index) => index !== indexToRemove));
    setImagePreviews(prev => prev.filter((_, index) => index !== indexToRemove));
  };


  useEffect(() => {
    return () => imagePreviews.forEach(url => URL.revokeObjectURL(url));
  }, [imagePreviews]);

  const onLoadMap = useCallback((mapInstance) => setMap(mapInstance), []);
  const onUnmountMap = useCallback(() => setMap(null), []);

  const onMapClick = useCallback((event) => {
    const lat = event.latLng.lat(); const lng = event.latLng.lng();
    setMarkerPosition({ lat, lng });
    setFormData(prev => ({ ...prev, ubicacionRetiro: { ...prev.ubicacionRetiro, coordenadas: { type: 'Point', coordinates: [lng, lat] } } }));
    reverseGeocode({ lat, lng });
  }, []); 

  const onMarkerDragEnd = useCallback((event) => {
    const lat = event.latLng.lat(); const lng = event.latLng.lng();
    setMarkerPosition({ lat, lng });
    setFormData(prev => ({ ...prev, ubicacionRetiro: { ...prev.ubicacionRetiro, coordenadas: { type: 'Point', coordinates: [lng, lat] } } }));
    reverseGeocode({ lat, lng });
  }, []);

  const reverseGeocode = useCallback(({ lat, lng }) => {
    if (window.google && window.google.maps && window.google.maps.Geocoder) {
      const geocoder = new window.google.maps.Geocoder();
      geocoder.geocode({ location: { lat, lng } }, (results, status) => {
        if (status === 'OK' && results[0]) {
          const ac = results[0].address_components;
          const getPart = (type) => ac.find(c => c.types.includes(type))?.long_name || '';
          setFormData(prev => ({ ...prev, ubicacionRetiro: {
              ...prev.ubicacionRetiro,
              direccion: `${getPart('route')} ${getPart('street_number')}`.trim() || results[0].formatted_address.split(',')[0] || '',
              ciudad: getPart('locality') || prev.ubicacionRetiro.ciudad,
              provincia: getPart('administrative_area_level_1') || prev.ubicacionRetiro.provincia,
              pais: getPart('country') || prev.ubicacionRetiro.pais,
              coordenadas: { type: 'Point', coordinates: [lng, lat] }
          }}));
        } else { console.warn('Reverse geocode failed: ' + status); }
      });
    } else { console.warn("Google Maps Geocoder no está disponible."); }
  }, []); 

  const onLoadAutocomplete = (acInstance) => setAutocomplete(acInstance);
  const onPlaceChanged = () => {
    if (autocomplete) {
      const place = autocomplete.getPlace();
      if (place.geometry?.location) {
        const lat = place.geometry.location.lat(); const lng = place.geometry.location.lng();
        setMarkerPosition({ lat, lng }); map?.panTo({ lat, lng }); map?.setZoom(15);
        const ac = place.address_components;
        const getPart = (type) => ac?.find(c => c.types.includes(type))?.long_name || '';
        setFormData(prev => ({ ...prev, ubicacionRetiro: {
            ...prev.ubicacionRetiro,
            direccion: `${getPart('route')} ${getPart('street_number')}`.trim() || place.name || '',
            ciudad: getPart('locality'), provincia: getPart('administrative_area_level_1'), pais: getPart('country'),
            coordenadas: { type: 'Point', coordinates: [lng, lat] }
        }}));
      } else { console.log('Autocomplete no devolvió geometría.'); }
    }
  };

  // --- Lógica de Envío del Formulario ---
  const handleSubmit = async (e) => {
    e.preventDefault(); 
    setLoading(true); 
    setError(null); 
    setValidationErrors({});
    setSuccessMessage('');

    if (selectedFiles.length === 0) { 
        setError("Sube al menos una imagen."); 
        setLoading(false); 
        return; 
    }
    if (!formData.fechaExpiracionPublicacion) { 
        setError("La fecha en que la publicación expira es obligatoria."); 
        setLoading(false); 
        return; 
    }
    if (!formData.ubicacionRetiro.coordenadas?.coordinates || formData.ubicacionRetiro.coordenadas.coordinates.length !== 2) { 
        setError("Selecciona una ubicación válida en el mapa o busca una dirección."); 
        setLoading(false); 
        return; 
    }
    if (formData.fechaVencimientoProducto) {
      const fechaExpiracionPub = new Date(formData.fechaExpiracionPublicacion);
      const fechaVencimientoProd = new Date(formData.fechaVencimientoProducto);
      fechaVencimientoProd.setHours(23, 59, 59, 999);
      if (fechaVencimientoProd < fechaExpiracionPub) {
        setError("Error de lógica: La fecha de vencimiento del producto no puede ser anterior a la fecha en que expira la publicación.");
        setLoading(false);
        return;
      }
    }

    const formDataPayload = new FormData();
    Object.keys(formData).forEach(key => {
      if (key === 'ubicacionRetiro' || key === 'informacionContactoAlternativa') {
        formDataPayload.append(key, JSON.stringify(formData[key]));
      } else if (formData[key] !== '' && formData[key] !== null) {
        const dateFields = ['fechaVencimientoProducto', 'fechaElaboracion', 'fechaExpiracionPublicacion'];
        if (dateFields.includes(key) && formData[key]) {
          formDataPayload.append(key, new Date(formData[key]).toISOString());
        } else {
          formDataPayload.append(key, formData[key]);
        }
      }
    });
    selectedFiles.forEach((file) => formDataPayload.append('imagenesDonacion', file));
    
    try {
      const token = await getToken();
      const response = await fetch(`${API_BASE_URL}/api/donacion`, { method: 'POST', headers: { 'Authorization': `Bearer ${token}`}, body: formDataPayload });
      const responseData = await response.json();
      
      if (!response.ok) {
        if (response.status === 400 && responseData.errors) {
          const errors = {};
          responseData.errors.forEach(err => {
            const field = err.path[0]; 
            errors[field] = err.message;
          });
          setValidationErrors(errors);
          setError("Por favor, corrige los errores en el formulario.");
        } else {
          setError(responseData.message || `Error del servidor: ${response.status}`);
        }
        setLoading(false); 
        return;
      }
      
      setSuccessMessage("¡Donación publicada exitosamente! Redirigiendo...");
      if (onDonationCreated) {
          onDonationCreated();
      }
      setTimeout(() => navigate('/dashboard'), 1500);
    } catch (err) {
      console.error("NewDonationPage: Error en handleSubmit:", err);
      setError("Error de red o servidor.");
      setLoading(false);
    }
  };


  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-textMain mb-6 text-center">Publicar Nueva Donación</h1>
      <form onSubmit={handleSubmit} className="max-w-2xl mx-auto space-y-6 bg-white p-6 sm:p-8 rounded-lg shadow-xl">
        
       
        <div>
          <label htmlFor="titulo" className="block text-sm font-medium text-gray-700">Título <span className="text-red-500">*</span></label>
          <input type="text" name="titulo" id="titulo" value={formData.titulo} onChange={handleInputChange} required className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm"/>
          {validationErrors.titulo && <p className="text-red-500 text-xs mt-1">{validationErrors.titulo}</p>}
        </div>
        
        <div>
          <label htmlFor="descripcion" className="block text-sm font-medium text-gray-700">Descripción <span className="text-red-500">*</span></label>
          <textarea name="descripcion" id="descripcion" rows="3" value={formData.descripcion} onChange={handleInputChange} required className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm"></textarea>
          {validationErrors.descripcion && <p className="text-red-500 text-xs mt-1">{validationErrors.descripcion}</p>}
        </div>
        
        
        <div>
          <label htmlFor="categoria" className="block text-sm font-medium text-gray-700">Categoría <span className="text-red-500">*</span></label>
          <select name="categoria" id="categoria" value={formData.categoria} onChange={handleInputChange} required className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm">
            <option value="" disabled>Selecciona una categoría...</option>
            <option value="Frutas y Verduras">Frutas y Verduras</option>
            <option value="Panificados">Panificados</option>
            <option value="Lácteos">Lácteos</option>
            <option value="Comida Preparada">Comida Preparada</option>
            <option value="Enlatados y Conservas">Enlatados y Conservas</option>
            <option value="Bebidas">Bebidas</option>
            <option value="Otros">Otros</option>
          </select>
        </div>
        <div>
          <label htmlFor="estadoAlimento" className="block text-sm font-medium text-gray-700">Estado del Alimento <span className="text-red-500">*</span></label>
          <select name="estadoAlimento" id="estadoAlimento" value={formData.estadoAlimento} onChange={handleInputChange} required className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm">
            <option value="" disabled>Selecciona el estado...</option>
            <option value="FRESCO">Fresco</option>
            <option value="CONGELADO">Congelado</option>
            <option value="NO_PERECEDERO">No Perecedero</option>
          </select>
        </div>
        <div>
          <label htmlFor="fechaExpiracionPublicacion" className="block text-sm font-medium text-gray-700">Publicación Válida Hasta <span className="text-red-500">*</span></label>
          <input type="datetime-local" name="fechaExpiracionPublicacion" id="fechaExpiracionPublicacion" value={formData.fechaExpiracionPublicacion} onChange={handleInputChange} required className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm"/>
        </div>
        <fieldset className="border p-4 rounded-md">
          <legend className="text-sm font-medium text-gray-700 px-1">Ubicación de Retiro <span className="text-red-500">*</span></legend>
          <div className="space-y-4 mt-2">
            <div>
              <label htmlFor="autocomplete_address" className="block text-xs font-medium text-gray-600">Buscar Dirección o haz clic en el mapa</label>
              <Autocomplete onLoad={onLoadAutocomplete} onPlaceChanged={onPlaceChanged} options={{ componentRestrictions: { country: "ar" } }}>
                <input type="text" id="autocomplete_address" placeholder="Ingresa una dirección para buscar..." ref={autocompleteInputRef} className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm"/>
              </Autocomplete>
            </div>
            <div style={mapContainerStyle}>
              <GoogleMap mapContainerStyle={mapContainerStyle} center={markerPosition || initialMapCenter} zoom={markerPosition ? 15 : 6} onLoad={onLoadMap} onUnmount={onUnmountMap} onClick={onMapClick} options={mapOptions}>
                {markerPosition && (<Marker position={markerPosition} draggable={true} onDragEnd={onMarkerDragEnd} />)}
              </GoogleMap>
            </div>
            <div>
              <label htmlFor="ubicacion_direccion_form" className="block text-xs font-medium text-gray-600">Dirección (Calle y Número)</label>
              <input type="text" name="direccion" id="ubicacion_direccion_form" value={formData.ubicacionRetiro.direccion} onChange={handleUbicacionTextoChange} required className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm" />
            </div>
            <div>
              <label htmlFor="ubicacion_ciudad_form" className="block text-xs font-medium text-gray-600">Ciudad</label>
              <input type="text" name="ciudad" id="ubicacion_ciudad_form" value={formData.ubicacionRetiro.ciudad} onChange={handleUbicacionTextoChange} required className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm" />
            </div>
            <div>
              <label htmlFor="ubicacion_provincia_form" className="block text-xs font-medium text-gray-600">Provincia</label>
              <input type="text" name="provincia" id="ubicacion_provincia_form" value={formData.ubicacionRetiro.provincia} onChange={handleUbicacionTextoChange} required className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm" />
            </div>
            <div>
              <label htmlFor="ubicacion_pais_form" className="block text-xs font-medium text-gray-600">País</label>
              <input type="text" name="pais" id="ubicacion_pais_form" value={formData.ubicacionRetiro.pais} onChange={handleUbicacionTextoChange} required className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm" />
            </div>
            <div>
              <label htmlFor="ubicacion_referencias_form" className="block text-xs font-medium text-gray-600">Referencias Adicionales</label>
              <input type="text" name="referenciasAdicionales" id="ubicacion_referencias_form" value={formData.ubicacionRetiro.referenciasAdicionales || ''} onChange={handleUbicacionTextoChange} className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm" />
            </div>
          </div>
        </fieldset>
        <div>
          <label htmlFor="fechaVencimientoProducto" className="block text-sm font-medium text-gray-700">Fecha de Vencimiento del Producto (Opcional)</label>
          <input type="date" name="fechaVencimientoProducto" id="fechaVencimientoProducto" value={formData.fechaVencimientoProducto} onChange={handleInputChange} className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm"/>
        </div>
        <div>
          <label htmlFor="fechaElaboracion" className="block text-sm font-medium text-gray-700">Fecha de Elaboración (Opcional)</label>
          <input type="date" name="fechaElaboracion" id="fechaElaboracion" value={formData.fechaElaboracion} onChange={handleInputChange} className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm"/>
        </div>
        <fieldset className="border p-4 rounded-md">
            <legend className="text-sm font-medium text-gray-700 px-1">Contacto Alternativo (Opcional)</legend>
            <div className="space-y-4 mt-2">
                <div>
                    <label htmlFor="contacto_telefono_alt_form" className="block text-xs font-medium text-gray-600">Teléfono</label>
                    <input type="tel" name="telefono" id="contacto_telefono_alt_form" value={formData.informacionContactoAlternativa.telefono} onChange={handleContactoAltChange} className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm" />
                </div>
                <div>
                    <label htmlFor="contacto_email_alt_form" className="block text-xs font-medium text-gray-600">Email</label>
                    <input type="email" name="email" id="contacto_email_alt_form" value={formData.informacionContactoAlternativa.email} onChange={handleContactoAltChange} className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm" />
                </div>
            </div>
        </fieldset>
        <div>
          <label htmlFor="condicionesEspeciales" className="block text-sm font-medium text-gray-700">Condiciones Especiales</label>
          <textarea name="condicionesEspeciales" id="condicionesEspeciales" rows="2" value={formData.condicionesEspeciales} onChange={handleInputChange} className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm"></textarea>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Imágenes (hasta 5, máx 5MB c/u) <span className="text-red-500">*</span></label>
          <input type="file" accept="image/png, image/jpeg, image/jpg, image/webp" multiple onChange={handleFileChange} className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary/10 file:text-primary hover:file:bg-primary/20"/>
          {imagePreviews.length > 0 && (
            <div className="mt-4 grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-2">
              {imagePreviews.map((previewUrl, index) => (
                <div key={index} className="relative group">
                  <img src={previewUrl} alt={`Previsualización ${index + 1}`} className="h-24 w-24 object-cover rounded-md shadow" />
                  <button type="button" onClick={() => removeImage(index)} className="absolute top-0.5 right-0.5 bg-red-500 text-white rounded-full p-0.5 opacity-0 group-hover:opacity-100 transition-opacity" aria-label="Eliminar imagen">
                    <X size={14} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
        
        {/* Mensaje de error general */}
        {error && <p className="text-red-600 text-sm text-center py-2">{error}</p>}
        {successMessage && <p className="text-green-600 text-sm text-center py-2">{successMessage}</p>}
        
        <button type="submit" disabled={loading || selectedFiles.length === 0} className="w-full flex justify-center py-2.5 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-brandPrimaryDarker focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:opacity-50">
          {loading ? 'Publicando...' : 'Publicar Donación'}
        </button>
      </form>
    </div>
  );
};
export default NewDonationPage;