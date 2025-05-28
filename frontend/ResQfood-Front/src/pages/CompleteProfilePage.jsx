// src/pages/CompleteProfilePage.jsx
import React, { useState, useEffect, useContext } from 'react'; // Añadido useContext
import { useNavigate } from 'react-router-dom';
import { useUser, useAuth } from '@clerk/clerk-react';
// No necesitas importar ProfileStatusContext aquí si solo usas la prop onProfileComplete

// <<< No necesitamos el contexto aquí si App.jsx pasa la función onProfileComplete como prop >>>
// const ProfileStatusContext = createContext(null); // Esto ya está en App.jsx

// Recibe onProfileComplete como prop
const CompleteProfilePage = ({ onProfileComplete }) => { 
  const navigate = useNavigate();
  const { user: clerkUser, isLoaded: isClerkLoaded } = useUser();
  const { getToken } = useAuth();
  // const profileContext = useContext(ProfileStatusContext); // Ya no es necesario si usamos la prop

  const [rol, setRol] = useState('');
  const [formData, setFormData] = useState({
    nombre: '',
    telefono: '',
    ubicacion: { direccion: '', ciudad: '', provincia: '', pais: '' },
    localData: { tipoNegocio: '', horarioAtencion: '', descripcionEmpresa: '' },
    fotoDePerfilUrl: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [validationErrors, setValidationErrors] = useState({});

  useEffect(() => {
    if (isClerkLoaded && clerkUser) {
      setFormData(prev => ({
        ...prev,
        nombre: `${clerkUser.firstName || ''} ${clerkUser.lastName || ''}`.trim() || '',
        fotoDePerfilUrl: clerkUser.imageUrl || '',
      }));
    }
  }, [isClerkLoaded, clerkUser]);

  const handleInputChange = (e) => { /* ... (sin cambios) ... */
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  const handleUbicacionChange = (e) => { /* ... (sin cambios) ... */
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, ubicacion: { ...prev.ubicacion, [name]: value }}));
  };
  const handleLocalDataChange = (e) => { /* ... (sin cambios) ... */
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, localData: { ...prev.localData, [name]: value }}));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setValidationErrors({});

    if (!rol) {
      setError("Por favor, selecciona un tipo de cuenta.");
      setLoading(false);
      return;
    }

    const payload = {
      rol: rol,
      nombre: formData.nombre,
      telefono: formData.telefono,
      ubicacion: formData.ubicacion,
      fotoDePerfilUrl: formData.fotoDePerfilUrl,
    };
    if (rol === 'LOCAL') payload.localData = formData.localData;

    try {
      const token = await getToken();
      const response = await fetch(`/usuario/${clerkUser.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}`},
        body: JSON.stringify(payload),
      });
      const data = await response.json();

      if (!response.ok) {
        if (data.errors) {
          const formattedErrors = {};
          data.errors.forEach(err => {
            formattedErrors[err.path.join('.')] = err.message;
          });
          setValidationErrors(formattedErrors);
          setError("Por favor, corrige los errores en el formulario.");
        } else {
          setError(data.message || "Ocurrió un error al actualizar el perfil.");
        }
        setLoading(false);
        return;
      }

      console.log("(CompleteProfilePage) Perfil completado/actualizado:", data.user);
      if (onProfileComplete) { // <<< LLAMA A LA FUNCIÓN DE PROP CUANDO EL PERFIL SE COMPLETA >>>
        onProfileComplete();
      }
      navigate('/dashboard'); // O a donde quieras redirigir

    } catch (err) {
      console.error("(CompleteProfilePage) Error en handleSubmit:", err);
      setError("Ocurrió un error de red o del servidor. Inténtalo de nuevo.");
      setLoading(false);
    }
  };

  if (!isClerkLoaded && !clerkUser) { // Mejor condición para el estado de carga inicial
    return <div className="text-center py-10">Cargando información de usuario...</div>;
  }

  // El JSX del formulario (sin cambios respecto al que te di antes, con los inputs, fieldsets, etc.)
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl sm:text-3xl font-bold text-textMain mb-6 text-center">
        Completa Tu Perfil en ResQFood
      </h1>
      <p className="text-center text-textMuted mb-8 max-w-md mx-auto">
        ¡Casi listo! Solo necesitamos unos detalles más para personalizar tu experiencia.
      </p>
      <form onSubmit={handleSubmit} className="max-w-lg mx-auto bg-white p-6 sm:p-8 rounded-lg shadow-xl space-y-6">
        {/* Selector de Rol */}
        <div>
          <label htmlFor="rol" className="block text-sm font-medium text-textMain mb-1">Tipo de Cuenta <span className="text-red-500">*</span></label>
          <select id="rol" name="rol" value={rol} onChange={(e) => setRol(e.target.value)} required className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm">
            <option value="" disabled>Selecciona un rol...</option>
            <option value="GENERAL">Usuario General</option>
            <option value="LOCAL">Local / Negocio</option>
          </select>
          {validationErrors.rol && <p className="text-red-500 text-xs mt-1">{validationErrors.rol}</p>}
        </div>

        {/* Nombre */}
        <div>
          <label htmlFor="nombre" className="block text-sm font-medium text-textMain">Nombre Completo o del Local <span className="text-red-500">*</span></label>
          <input type="text" name="nombre" id="nombre" value={formData.nombre} onChange={handleInputChange} required className="mt-1 block w-full input-style"/>
          {validationErrors.nombre && <p className="text-red-500 text-xs mt-1">{validationErrors.nombre}</p>}
        </div>

        {/* Teléfono */}
        <div>
          <label htmlFor="telefono" className={`block text-sm font-medium text-textMain ${rol === 'LOCAL' ? '' : 'opacity-70'}`}>Teléfono {rol === 'LOCAL' && <span className="text-red-500">*</span>}</label>
          <input type="tel" name="telefono" id="telefono" value={formData.telefono} onChange={handleInputChange} required={rol === 'LOCAL'} className="mt-1 block w-full input-style" placeholder="Ej: 1122334455"/>
          {validationErrors.telefono && <p className="text-red-500 text-xs mt-1">{validationErrors.telefono}</p>}
        </div>
        
        {/* Ubicación */}
        <fieldset className="border p-4 rounded-md">
            <legend className="text-sm font-medium text-textMain px-1">Ubicación <span className="text-red-500">*</span></legend>
            <div className="space-y-4 mt-2">
                <div>
                    <label htmlFor="direccion" className="block text-xs font-medium text-textMuted">Dirección</label>
                    <input type="text" name="direccion" id="direccion" value={formData.ubicacion.direccion} onChange={handleUbicacionChange} required className="mt-1 block w-full input-style" />
                    {validationErrors['ubicacion.direccion'] && <p className="text-red-500 text-xs mt-1">{validationErrors['ubicacion.direccion']}</p>}
                </div>
                <div>
                    <label htmlFor="ciudad" className="block text-xs font-medium text-textMuted">Ciudad</label>
                    <input type="text" name="ciudad" id="ciudad" value={formData.ubicacion.ciudad} onChange={handleUbicacionChange} required className="mt-1 block w-full input-style" />
                    {validationErrors['ubicacion.ciudad'] && <p className="text-red-500 text-xs mt-1">{validationErrors['ubicacion.ciudad']}</p>}
                </div>
                <div>
                    <label htmlFor="provincia" className="block text-xs font-medium text-textMuted">Provincia</label>
                    <input type="text" name="provincia" id="provincia" value={formData.ubicacion.provincia} onChange={handleUbicacionChange} required className="mt-1 block w-full input-style" />
                    {validationErrors['ubicacion.provincia'] && <p className="text-red-500 text-xs mt-1">{validationErrors['ubicacion.provincia']}</p>}
                </div>
                <div>
                    <label htmlFor="pais" className="block text-xs font-medium text-textMuted">País</label>
                    <input type="text" name="pais" id="pais" value={formData.ubicacion.pais} onChange={handleUbicacionChange} required className="mt-1 block w-full input-style" />
                    {validationErrors['ubicacion.pais'] && <p className="text-red-500 text-xs mt-1">{validationErrors['ubicacion.pais']}</p>}
                </div>
            </div>
        </fieldset>

        {/* Campos LOCAL */}
        {rol === 'LOCAL' && (
          <fieldset className="border p-4 rounded-md">
            <legend className="text-sm font-medium text-textMain px-1">Información del Local <span className="text-red-500">*</span></legend>
            <div className="space-y-4 mt-2">
              <div>
                <label htmlFor="tipoNegocio" className="block text-xs font-medium text-textMuted">Tipo de Negocio</label>
                <input type="text" name="tipoNegocio" id="tipoNegocio" value={formData.localData.tipoNegocio} onChange={handleLocalDataChange} required className="mt-1 block w-full input-style" placeholder="Ej: Restaurante"/>
                {validationErrors['localData.tipoNegocio'] && <p className="text-red-500 text-xs mt-1">{validationErrors['localData.tipoNegocio']}</p>}
              </div>
              <div>
                <label htmlFor="horarioAtencion" className="block text-xs font-medium text-textMuted">Horario de Atención</label>
                <input type="text" name="horarioAtencion" id="horarioAtencion" value={formData.localData.horarioAtencion} onChange={handleLocalDataChange} required className="mt-1 block w-full input-style" placeholder="Ej: L-V 9-18"/>
                {validationErrors['localData.horarioAtencion'] && <p className="text-red-500 text-xs mt-1">{validationErrors['localData.horarioAtencion']}</p>}
              </div>
              <div>
                <label htmlFor="descripcionEmpresa" className="block text-xs font-medium text-textMuted">Descripción de la Empresa</label>
                <textarea name="descripcionEmpresa" id="descripcionEmpresa" rows="3" value={formData.localData.descripcionEmpresa} onChange={handleLocalDataChange} required className="mt-1 block w-full input-style" placeholder="Breve descripción..."></textarea>
                {validationErrors['localData.descripcionEmpresa'] && <p className="text-red-500 text-xs mt-1">{validationErrors['localData.descripcionEmpresa']}</p>}
              </div>
            </div>
          </fieldset>
        )}

        {error && <p className="text-red-600 text-sm text-center mt-4">{error}</p>}
        <button type="submit" disabled={loading || !rol} className="w-full flex justify-center py-2.5 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-brandPrimaryDarker focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:opacity-50">
          {loading ? 'Guardando...' : 'Guardar y Continuar'}
        </button>
      </form>
    </div>
  );
};

export default CompleteProfilePage;