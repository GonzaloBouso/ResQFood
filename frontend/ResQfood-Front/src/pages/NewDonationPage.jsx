// src/pages/NewDonationPage.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@clerk/clerk-react';
import { X } from 'lucide-react'; // Asegúrate de que esta importación esté

// Asumiendo que tienes tu clase input-style definida en index.css o similar
// Si no, reemplaza 'input-style' con las clases de Tailwind directamente.
// ej: "mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"

const NewDonationPage = () => {
  const navigate = useNavigate();
  const { getToken } = useAuth();

  const [formData, setFormData] = useState({
    titulo: '',
    descripcion: '',
    categoria: '', // <<< Campo para el estado
    fechaVencimientoProducto: '',
    fechaElaboracion: '',
    ubicacionRetiro: {
      direccion: '',
      ciudad: '',
      provincia: '',
      pais: '',
      // coordenadas: { type: 'Point', coordinates: [0,0] } // Si decides enviarlas, inicialízalas
    },
    estadoAlimento: '', // <<< Campo para el estado
    fechaExpiracionPublicacion: '', // <<< Campo para el estado
    informacionContactoAlternativa: {
      telefono: '',
      email: ''
    },
    condicionesEspeciales: '',
  });

  const [selectedFiles, setSelectedFiles] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  // const [validationErrors, setValidationErrors] = useState({}); // Para mostrar errores de Zod en campos específicos

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleUbicacionChange = (e) => {
    const { name, value } = e.target;
    // Corregido para actualizar sub-campos de ubicacionRetiro
    setFormData(prev => ({ 
      ...prev, 
      ubicacionRetiro: {
        ...prev.ubicacionRetiro,
        [name]: value
      }
    }));
  };

  const handleContactoAltChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ 
      ...prev, 
      informacionContactoAlternativa: {
        ...prev.informacionContactoAlternativa,
        [name]: value
      }
    }));
  };

  const handleFileChange = (e) => { /* ... (sin cambios, el que te di antes está bien) ... */
    const files = Array.from(e.target.files);
    const MAX_FILES = 5;
    const MAX_SIZE_MB = 5;
    if (files.length === 0) return;
    if (selectedFiles.length + files.length > MAX_FILES) {
      alert(`Puedes subir un máximo de ${MAX_FILES} imágenes.`);
      e.target.value = null;
      return;
    }
    const newFiles = [];
    const newPreviews = [];
    for (const file of files) {
      if (file.size > MAX_SIZE_MB * 1024 * 1024) {
        alert(`El archivo "${file.name}" es demasiado grande. El máximo es ${MAX_SIZE_MB}MB.`);
        continue;
      }
      newFiles.push(file);
      newPreviews.push(URL.createObjectURL(file));
    }
    setSelectedFiles(prev => [...prev, ...newFiles]);
    setImagePreviews(prev => [...prev, ...newPreviews]);
    e.target.value = null;
  };
  
  useEffect(() => {
    return () => {
      imagePreviews.forEach(url => URL.revokeObjectURL(url));
    };
  }, [imagePreviews]);

  const removeImage = (indexToRemove) => { /* ... (sin cambios) ... */
    URL.revokeObjectURL(imagePreviews[indexToRemove]);
    setSelectedFiles(prev => prev.filter((_, index) => index !== indexToRemove));
    setImagePreviews(prev => prev.filter((_, index) => index !== indexToRemove));
  };

  const handleSubmit = async (e) => { /* ... (como estaba, asegurándote de que todos los campos se añadan a formDataPayload) ... */
    e.preventDefault();
    setLoading(true);
    setError(null);

    if (selectedFiles.length === 0) {
      setError("Por favor, sube al menos una imagen de la donación.");
      setLoading(false);
      return;
    }

    const formDataPayload = new FormData();
    formDataPayload.append('titulo', formData.titulo);
    formDataPayload.append('descripcion', formData.descripcion);
    formDataPayload.append('categoria', formData.categoria); // Añadido
    if (formData.fechaVencimientoProducto) formDataPayload.append('fechaVencimientoProducto', new Date(formData.fechaVencimientoProducto).toISOString());
    if (formData.fechaElaboracion) formDataPayload.append('fechaElaboracion', new Date(formData.fechaElaboracion).toISOString());
    
    // Asegúrate de que el objeto ubicacionRetiro se stringify con todos sus campos, incluyendo coordenadas si las pides
    // Si coordenadas es opcional en backend y no las pides en frontend, no las incluyas aquí o envía un objeto vacío.
    const ubicacionParaEnviar = { ...formData.ubicacionRetiro };
    // Ejemplo: si coordenadas no se piden en el form, pero el backend las espera (aunque sea opcional)
    // if (!ubicacionParaEnviar.coordenadas) {
    //   ubicacionParaEnviar.coordenadas = { type: 'Point', coordinates: [] }; // O null, o no enviar
    // }
    formDataPayload.append('ubicacionRetiro', JSON.stringify(ubicacionParaEnviar));
    
    formDataPayload.append('estadoAlimento', formData.estadoAlimento); // Añadido
    if (formData.fechaExpiracionPublicacion) formDataPayload.append('fechaExpiracionPublicacion', new Date(formData.fechaExpiracionPublicacion).toISOString()); // Añadido
    else {
      // Si es obligatorio en backend y no se envía, causará error de validación.
      // Podrías setear un default aquí o manejarlo en Zod/Mongoose.
      // Por ahora, si es requerido por Zod, el usuario debe llenarlo.
      setError("La fecha de expiración de la publicación es obligatoria.");
      setLoading(false);
      return;
    }

    if (formData.informacionContactoAlternativa.telefono || formData.informacionContactoAlternativa.email) {
        formDataPayload.append('informacionContactoAlternativa', JSON.stringify(formData.informacionContactoAlternativa));
    }
    if (formData.condicionesEspeciales) formDataPayload.append('condicionesEspeciales', formData.condicionesEspeciales);

    selectedFiles.forEach((file) => {
      formDataPayload.append('imagenesDonacion', file);
    });

    console.log("Enviando FormData al backend...");
    for (let [key, value] of formDataPayload.entries()) {
      console.log(`FormData ${key}:`, value instanceof File ? value.name : value);
    }

    try {
      const token = await getToken();
      const response = await fetch('/donacion', { // Verifica el prefijo de API
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}`},
        body: formDataPayload,
      });
      const responseData = await response.json();
            if (!response.ok) {
        if (responseData.errors) { // responseData es el await response.json()
          const formattedErrors = {};
          responseData.errors.forEach(err => {
            formattedErrors[err.path.join('.')] = err.message;
          });
          setValidationErrors(formattedErrors);
          setError("Por favor, corrige los errores en el formulario.");
          console.error("Detalles de Errores de Zod del Backend:", responseData.errors); // <<< ESTE LOG ES VITAL
        } else {
          setError(responseData.message || `Error del servidor: ${response.status}`);
        }
        setLoading(false);
        return;
      }
      console.log("Donación creada:", responseData.donacion);
      alert("¡Donación publicada exitosamente!");
      navigate('/');
    } catch (err) {
      console.error("Error al enviar formulario de donación:", err);
      setError("Ocurrió un error de red o del servidor al publicar la donación.");
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-textMain mb-6">Publicar Nueva Donación</h1>
      <form onSubmit={handleSubmit} className="space-y-6 bg-white p-6 rounded-lg shadow-md">
        {/* Título */}
        <div>
          <label htmlFor="titulo" className="block text-sm font-medium text-gray-700">Título <span className="text-red-500">*</span></label>
          <input type="text" name="titulo" id="titulo" value={formData.titulo} onChange={handleInputChange} required className="mt-1 block w-full input-style" />
        </div>

        {/* Descripción */}
        <div>
          <label htmlFor="descripcion" className="block text-sm font-medium text-gray-700">Descripción <span className="text-red-500">*</span></label>
          <textarea name="descripcion" id="descripcion" rows="3" value={formData.descripcion} onChange={handleInputChange} required className="mt-1 block w-full input-style"></textarea>
        </div>

        {/* Categoría */}
        <div>
          <label htmlFor="categoria" className="block text-sm font-medium text-gray-700">Categoría <span className="text-red-500">*</span></label>
          <select name="categoria" id="categoria" value={formData.categoria} onChange={handleInputChange} required className="mt-1 block w-full input-style">
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

        {/* Estado del Alimento */}
        <div>
          <label htmlFor="estadoAlimento" className="block text-sm font-medium text-gray-700">Estado del Alimento <span className="text-red-500">*</span></label>
          <select name="estadoAlimento" id="estadoAlimento" value={formData.estadoAlimento} onChange={handleInputChange} required className="mt-1 block w-full input-style">
            <option value="" disabled>Selecciona el estado...</option>
            <option value="FRESCO">Fresco</option>
            <option value="CONGELADO">Congelado</option>
            <option value="NO_PERECEDERO">No Perecedero</option>
          </select>
        </div>
        
        {/* Fecha de Expiración de la Publicación */}
        <div>
          <label htmlFor="fechaExpiracionPublicacion" className="block text-sm font-medium text-gray-700">Publicación Válida Hasta <span className="text-red-500">*</span></label>
          <input type="datetime-local" name="fechaExpiracionPublicacion" id="fechaExpiracionPublicacion" value={formData.fechaExpiracionPublicacion} onChange={handleInputChange} required className="mt-1 block w-full input-style"/>
        </div>

        {/* Ubicación de Retiro */}
        <fieldset className="border p-4 rounded-md">
            <legend className="text-sm font-medium text-gray-700 px-1">Ubicación de Retiro <span className="text-red-500">*</span></legend>
            <div className="space-y-4 mt-2">
                <div>
                    <label htmlFor="ubicacion_direccion" className="block text-xs font-medium text-gray-600">Dirección</label>
                    <input type="text" name="direccion" id="ubicacion_direccion" value={formData.ubicacionRetiro.direccion} onChange={handleUbicacionChange} required className="mt-1 block w-full input-style" />
                </div>
                <div>
                    <label htmlFor="ubicacion_ciudad" className="block text-xs font-medium text-gray-600">Ciudad</label>
                    <input type="text" name="ciudad" id="ubicacion_ciudad" value={formData.ubicacionRetiro.ciudad} onChange={handleUbicacionChange} required className="mt-1 block w-full input-style" />
                </div>
                <div>
                    <label htmlFor="ubicacion_provincia" className="block text-xs font-medium text-gray-600">Provincia</label>
                    <input type="text" name="provincia" id="ubicacion_provincia" value={formData.ubicacionRetiro.provincia} onChange={handleUbicacionChange} required className="mt-1 block w-full input-style" />
                </div>
                <div>
                    <label htmlFor="ubicacion_pais" className="block text-xs font-medium text-gray-600">País</label>
                    <input type="text" name="pais" id="ubicacion_pais" value={formData.ubicacionRetiro.pais} onChange={handleUbicacionChange} required className="mt-1 block w-full input-style" />
                </div>
                {/* Si decides no enviar coordenadas desde el frontend, comenta/elimina esta sección */}
                {/* O si las haces opcionales, asegúrate de que el backend las maneje como tal */}
                {/* <div>
                    <label htmlFor="ubicacion_coordenadas_lng" className="block text-xs font-medium text-gray-600">Longitud (Opcional)</label>
                    <input type="number" step="any" name="lng" id="ubicacion_coordenadas_lng" value={formData.ubicacionRetiro.coordenadas?.coordinates[0] || ''} onChange={handleCoordenadasChange} className="mt-1 block w-full input-style" />
                </div>
                <div>
                    <label htmlFor="ubicacion_coordenadas_lat" className="block text-xs font-medium text-gray-600">Latitud (Opcional)</label>
                    <input type="number" step="any" name="lat" id="ubicacion_coordenadas_lat" value={formData.ubicacionRetiro.coordenadas?.coordinates[1] || ''} onChange={handleCoordenadasChange} className="mt-1 block w-full input-style" />
                </div> */}
                <div>
                    <label htmlFor="ubicacion_referencias" className="block text-xs font-medium text-gray-600">Referencias Adicionales</label>
                    <input type="text" name="referenciasAdicionales" id="ubicacion_referencias" value={formData.ubicacionRetiro.referenciasAdicionales || ''} onChange={handleUbicacionChange} className="mt-1 block w-full input-style" />
                </div>
            </div>
        </fieldset>

        {/* Fecha de Vencimiento del Producto (Opcional) */}
        <div>
          <label htmlFor="fechaVencimientoProducto" className="block text-sm font-medium text-gray-700">Fecha de Vencimiento del Producto (Si aplica)</label>
          <input type="date" name="fechaVencimientoProducto" id="fechaVencimientoProducto" value={formData.fechaVencimientoProducto} onChange={handleInputChange} className="mt-1 block w-full input-style"/>
        </div>

        {/* Fecha de Elaboración (Opcional) */}
        <div>
          <label htmlFor="fechaElaboracion" className="block text-sm font-medium text-gray-700">Fecha de Elaboración (Si aplica)</label>
          <input type="date" name="fechaElaboracion" id="fechaElaboracion" value={formData.fechaElaboracion} onChange={handleInputChange} className="mt-1 block w-full input-style"/>
        </div>
        
        {/* Información de Contacto Alternativa (Opcional) */}
        <fieldset className="border p-4 rounded-md">
            <legend className="text-sm font-medium text-gray-700 px-1">Contacto Alternativo (Opcional)</legend>
            <div className="space-y-4 mt-2">
                <div>
                    <label htmlFor="contacto_telefono" className="block text-xs font-medium text-gray-600">Teléfono</label>
                    <input type="tel" name="telefono" id="contacto_telefono" value={formData.informacionContactoAlternativa.telefono} onChange={handleContactoAltChange} className="mt-1 block w-full input-style" />
                </div>
                <div>
                    <label htmlFor="contacto_email" className="block text-xs font-medium text-gray-600">Email</label>
                    <input type="email" name="email" id="contacto_email" value={formData.informacionContactoAlternativa.email} onChange={handleContactoAltChange} className="mt-1 block w-full input-style" />
                </div>
            </div>
        </fieldset>

        {/* Condiciones Especiales (Opcional) */}
        <div>
          <label htmlFor="condicionesEspeciales" className="block text-sm font-medium text-gray-700">Condiciones Especiales (Ej: necesita refrigeración, alergias)</label>
          <textarea name="condicionesEspeciales" id="condicionesEspeciales" rows="2" value={formData.condicionesEspeciales} onChange={handleInputChange} className="mt-1 block w-full input-style"></textarea>
        </div>

        {/* Selector de Imágenes (ya lo tenías) */}
       
        {/* ===== SECCIÓN DE IMÁGENES (ASEGÚRATE DE QUE ESTÉ ASÍ) ===== */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Imágenes (hasta 5, máx 5MB c/u) <span className="text-red-500">*</span>
          </label>
          <input 
            type="file" 
            accept="image/png, image/jpeg, image/jpg, image/webp" 
            multiple 
            onChange={handleFileChange} // Tu función handleFileChange
            className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary/10 file:text-primary hover:file:bg-primary/20"
          />
          {/* Previsualización de Imágenes */}
          {imagePreviews.length > 0 && (
            <div className="mt-4 grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-2">
              {imagePreviews.map((previewUrl, index) => (
                <div key={previewUrl} className="relative group">
                  <img 
                    src={previewUrl} 
                    alt={`Previsualización ${index + 1}`} 
                    className="h-24 w-24 object-cover rounded-md shadow" 
                  />
                  <button 
                    type="button" 
                    onClick={() => removeImage(index)} // Tu función removeImage
                    className="absolute top-0.5 right-0.5 bg-red-500 text-white rounded-full p-0.5 leading-none opacity-0 group-hover:opacity-100 transition-opacity"
                    aria-label="Eliminar imagen"
                  >
                    <X size={14} /> {/* Asegúrate de importar X de lucide-react */}
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
        {/* ===== FIN DE LA SECCIÓN DE IMÁGENES ===== */}

        {error && <p className="text-red-600 text-sm text-center py-2">{error}</p>}
        <button 
          type="submit" 
          disabled={loading || selectedFiles.length === 0}
          className="w-full flex justify-center py-2.5 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-brandPrimaryDarker focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:opacity-50"
        >
          {loading ? 'Publicando...' : 'Publicar Donación'}
        </button>
      </form>
    </div>
  );
};

export default NewDonationPage;