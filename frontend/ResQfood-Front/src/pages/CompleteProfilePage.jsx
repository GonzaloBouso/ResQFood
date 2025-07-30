import React, { useState, useEffect } from 'react';
import { useUser, useAuth } from '@clerk/clerk-react';
import { User as UserIcon } from 'lucide-react';
// Ya no se necesita 'useNavigate' en este componente
import API_BASE_URL from '../api/config.js';

const CompleteProfilePage = ({ onProfileComplete }) => {
  // Se elimina la inicialización de 'navigate'
  const diasSemana = ['LUNES', 'MARTES', 'MIERCOLES', 'JUEVES', 'VIERNES', 'SABADO', 'DOMINGO'];
  const generarOpcionesHora = () => {
    const opciones = [];
    for (let h = 0; h < 24; h++) {
      for (let m = 0; m < 60; m += 30) {
        opciones.push(`${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`);
      }
    }
    opciones.push("23:59");
    return opciones;
  };
  const opcionesHora = generarOpcionesHora();

  const { user: clerkUser, isLoaded: isClerkLoaded } = useUser();
  const { getToken } = useAuth();

  const [rol, setRol] = useState('');
  const [formData, setFormData] = useState({
    nombre: '',
    telefono: '',
    ubicacion: { direccion: '', ciudad: '', provincia: '', pais: '' },
    localData: { tipoNegocio: '', descripcionEmpresa: '' },
  });

  const [diaInicio, setDiaInicio] = useState('LUNES');
  const [diaFin, setDiaFin] = useState('VIERNES');
  const [horaApertura, setHoraApertura] = useState('09:00');
  const [horaCierre, setHoraCierre] = useState('18:00');

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');
  const [validationErrors, setValidationErrors] = useState({});

  useEffect(() => {
    if (isClerkLoaded && clerkUser) {
      setFormData(prev => ({
        ...prev,
        nombre: `${clerkUser.firstName || ''} ${clerkUser.lastName || ''}`.trim() || '',
        ubicacion: prev.ubicacion.direccion ? prev.ubicacion : { direccion: '', ciudad: '', provincia: '', pais: '' },
        localData: prev.localData.tipoNegocio ? prev.localData : { tipoNegocio: '', descripcionEmpresa: '' },
      }));
    }
  }, [isClerkLoaded, clerkUser]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleUbicacionChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, ubicacion: { ...prev.ubicacion, [name]: value } }));
  };
  
  const handleLocalDataChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, localData: { ...prev.localData, [name]: value } }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccessMessage('');
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
      ubicacion: {
        ...formData.ubicacion,
        coordenadas: {
          type: 'Point',
          coordinates: [0, 0] 
        }
      },
    };

    if (rol === 'LOCAL') {
      let horarioString = (diaInicio === diaFin) 
        ? `${diaInicio} de ${horaApertura} a ${horaCierre}`
        : `${diaInicio} a ${diaFin} de ${horaApertura} a ${horaCierre}`;
      
      payload.localData = { ...formData.localData, horarioAtencion: horarioString };
    }
    
    try {
      const token = await getToken();
      const response = await fetch(`${API_BASE_URL}/api/usuario/create-profile`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}`},
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!response.ok) {
        throw data;
      }
      
      setSuccessMessage("¡Perfil guardado exitosamente!");
      
      // ==================================================================
      // LA SOLUCIÓN FINAL:
      // Se actualiza el estado global a través de la prop onProfileComplete.
      // La lógica de enrutamiento en App.jsx se encargará de mostrar el Dashboard
      // automáticamente cuando el estado 'isComplete' cambie a true.
      // Ya no necesitamos una redirección manual aquí.
      // ==================================================================
      if (onProfileComplete) {
        onProfileComplete(data.user);
      }

      // Se ha eliminado el bloque setTimeout y la llamada a navigate('/dashboard').

    } catch (err) {
      console.error("CompleteProfilePage: Error en handleSubmit:", err);
      if (err.errors) {
        const formattedErrors = {};
        err.errors.forEach(e => { 
          const pathKey = Array.isArray(e.path) ? e.path.join('.') : String(e.path);
          formattedErrors[pathKey] = e.message; 
        });
        setValidationErrors(formattedErrors);
        setError("Por favor, corrige los errores en el formulario.");
      } else {
        setError(err.message || "Ocurrió un error de red o del servidor. Inténtalo de nuevo.");
      }
      setLoading(false);
    }
  };

  if (!isClerkLoaded || !clerkUser) {
    return <div className="text-center py-10">Cargando información de usuario...</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl sm:text-3xl font-bold text-textMain mb-6 text-center">
        Completa Tu Perfil en ResQFood
      </h1>
      <p className="text-center text-textMuted mb-8 max-w-md mx-auto">
        ¡Casi listo! Solo necesitamos unos detalles más para personalizar tu experiencia.
      </p>
      <form onSubmit={handleSubmit} className="max-w-lg mx-auto bg-white p-6 sm:p-8 rounded-lg shadow-xl space-y-6">
        <div>
          <label htmlFor="rol" className="block text-sm font-medium text-textMain mb-1">Tipo de Cuenta <span className="text-red-500">*</span></label>
          <select id="rol" name="rol" value={rol} onChange={(e) => setRol(e.target.value)} required className="mt-1 block w-full input-style">
            <option value="" disabled>Selecciona un rol...</option>
            <option value="GENERAL">Usuario General</option>
            <option value="LOCAL">Local / Negocio</option>
          </select>
          {validationErrors.rol && <p className="text-red-500 text-xs mt-1">{validationErrors.rol}</p>}
        </div>

        <div className="space-y-2">
            <label className="block text-sm font-medium text-textMain">Foto de Perfil</label>
            <div className="flex items-center space-x-4">
                {clerkUser?.imageUrl ? (
                    <img src={clerkUser.imageUrl} alt="Foto de perfil" className="h-20 w-20 rounded-full object-cover shadow-sm" />
                ) : (
                    <div className="h-20 w-20 rounded-full bg-gray-200 flex items-center justify-center text-textMuted">
                        <UserIcon size={36} />
                    </div>
                )}
                <p className="text-xs text-textMuted">
                    Puedes cambiar tu foto de perfil desde el menú de usuario (arriba a la derecha) una vez completado tu perfil.
                </p>
            </div>
        </div>

        <div>
          <label htmlFor="nombre" className="block text-sm font-medium text-textMain">Nombre Completo o del Local <span className="text-red-500">*</span></label>
          <input type="text" name="nombre" id="nombre" value={formData.nombre} onChange={handleInputChange} required className="mt-1 block w-full input-style"/>
          {validationErrors.nombre && <p className="text-red-500 text-xs mt-1">{validationErrors.nombre}</p>}
        </div>

        <div>
          <label htmlFor="telefono" className={`block text-sm font-medium text-textMain ${rol === 'LOCAL' ? '' : 'opacity-70'}`}>Teléfono {rol === 'LOCAL' && <span className="text-red-500">*</span>}</label>
          <input type="tel" name="telefono" id="telefono" value={formData.telefono} onChange={handleInputChange} required={rol === 'LOCAL'} className="mt-1 block w-full input-style" placeholder="Ej: 1122334455"/>
          {validationErrors.telefono && <p className="text-red-500 text-xs mt-1">{validationErrors.telefono}</p>}
        </div>
        
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

        {rol === 'LOCAL' && (
          <fieldset className="border p-4 rounded-md">
            <legend className="text-sm font-medium text-textMain px-1">Información del Local <span className="text-red-500">*</span></legend>
            <div className="space-y-4 mt-2">
              <div>
                <label htmlFor="tipoNegocio" className="block text-xs font-medium text-textMuted">Tipo de Negocio</label>
                <input type="text" name="tipoNegocio" id="tipoNegocio" value={formData.localData.tipoNegocio} onChange={handleLocalDataChange} required className="mt-1 block w-full input-style" placeholder="Ej: Restaurante"/>
                {validationErrors['localData.tipoNegocio'] && <p className="text-red-500 text-xs mt-1">{validationErrors['localData.tipoNegocio']}</p>}
              </div>
              <div className="border-t pt-4 mt-4">
                <h4 className="text-sm font-medium text-textMain mb-2">Horario de Atención Principal <span className="text-red-500">*</span></h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="diaInicioSelect" className="block text-xs font-medium text-textMuted">Desde el día</label>
                    <select id="diaInicioSelect" name="diaInicioSelect" value={diaInicio} onChange={(e) => setDiaInicio(e.target.value)} className="mt-1 block w-full input-style">
                      {diasSemana.map(dia => <option key={`inicio-${dia}`} value={dia}>{dia.charAt(0).toUpperCase() + dia.slice(1).toLowerCase()}</option>)}
                    </select>
                  </div>
                  <div>
                    <label htmlFor="diaFinSelect" className="block text-xs font-medium text-textMuted">Hasta el día</label>
                    <select id="diaFinSelect" name="diaFinSelect" value={diaFin} onChange={(e) => setDiaFin(e.target.value)} className="mt-1 block w-full input-style">
                      {diasSemana.map(dia => <option key={`fin-${dia}`} value={dia}>{dia.charAt(0).toUpperCase() + dia.slice(1).toLowerCase()}</option>)}
                    </select>
                  </div>
                  <div>
                    <label htmlFor="horaAperturaSelect" className="block text-xs font-medium text-textMuted">Abre a las</label>
                    <select id="horaAperturaSelect" name="horaAperturaSelect" value={horaApertura} onChange={(e) => setHoraApertura(e.target.value)} className="mt-1 block w-full input-style">
                      {opcionesHora.map(hora => <option key={`apertura-${hora}`} value={hora}>{hora}</option>)}
                    </select>
                  </div>
                  <div>
                    <label htmlFor="horaCierreSelect" className="block text-xs font-medium text-textMuted">Cierra a las</label>
                    <select id="horaCierreSelect" name="horaCierreSelect" value={horaCierre} onChange={(e) => setHoraCierre(e.target.value)} className="mt-1 block w-full input-style">
                      {opcionesHora.map(hora => <option key={`cierre-${hora}`} value={hora}>{hora}</option>)}
                    </select>
                  </div>
                </div>
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
        {successMessage && <p className="text-green-600 text-sm text-center mt-4">{successMessage}</p>}
        <button type="submit" disabled={loading || !rol} className="w-full flex justify-center py-2.5 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-brandPrimaryDarker focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:opacity-50">
          {loading ? 'Guardando...' : 'Guardar y Continuar'}
        </button>
      </form>
    </div>
  );
};

export default CompleteProfilePage;