
import React, { useState } from "react";

import API_BASE_URL from '../api/config.js';

const MIN_AGE = 18;
const MAX_AGE = 65;
const FormularioVoluntario = () => {
  const initialState = {
    nombre: "",
    nacimiento: "",
    email: "",
    telefono: "",
    pais: "Argentina", 
    provincia: "",
    ciudad: "",
  };
  
  const [form, setForm] = useState(initialState);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [ageError, setAgeError]=useState(null);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    if (e.target.name === 'nacimiento') {
      setAgeError(null);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
   
    setError(null);
    setSuccess(null);
    setAgeError(null);


    const birthDate = new Date(form.nacimiento);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDifference = today.getMonth() - birthDate.getMonth();

    if (age < MIN_AGE) {
      setAgeError(`Lo sentimos, debes tener al menos ${MIN_AGE} años para ser voluntario.`);
      return; 
    }

    if (age > MAX_AGE) {
      setAgeError(`La edad máxima para registrarse como voluntario es de ${MAX_AGE} años.`);
      return; 
    }

    setLoading(true);

    try {
      const response = await fetch(`${API_BASE_URL}/api/voluntario/inscribir`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(form),
      });

      const data = await response.json();

      if (!response.ok) {
        
        throw new Error(data.message || 'Algo salió mal');
      }

      setSuccess(data.message);
      setForm(initialState); 

    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto mt-10 p-6 rounded-xl shadow-md bg-white text-gray-800">
      <h1 className="text-2xl md:text-3xl font-semibold text-center mb-10 text-green-700">
        Participa como voluntario
      </h1>

      <form onSubmit={handleSubmit} className="space-y-4 text-sm">
        
         <div>
          <label className="block mb-1">Nombre Completo</label>
          <input type="text" name="nombre" value={form.nombre} onChange={handleChange} className="w-full px-3 py-2 rounded-md border bg-gray-50" required />
        </div>
        <div>
          <label className="block mb-1">Fecha de nacimiento</label>
          <input type="date" name="nacimiento" value={form.nacimiento} onChange={handleChange} className="w-full px-3 py-2 rounded-md border bg-gray-50" required />
          {ageError && <p className="text-red-600 text-xs mt-1">{ageError}</p>}
        </div>
        <div>
          <label className="block mb-1">Correo Electrónico</label>
          <input type="email" name="email" value={form.email} onChange={handleChange} className="w-full px-3 py-2 rounded-md border bg-gray-50" required />
        </div>
        <div>
          <label className="block mb-1">Teléfono</label>
          <input type="tel" name="telefono" value={form.telefono} onChange={handleChange} className="w-full px-3 py-2 rounded-md border bg-gray-50" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block mb-1">País</label>
            <select name="pais" value={form.pais} onChange={handleChange} className="w-full px-2 py-2 rounded-md border bg-gray-50" required>
              <option value="">Seleccionar</option>
              <option value="Argentina">Argentina</option>
              <option value="Otro">Otro</option>
            </select>
          </div>
          <div>
            <label className="block mb-1">Provincia</label>
            <select name="provincia" value={form.provincia} onChange={handleChange} className="w-full px-2 py-2 rounded-md border bg-gray-50" required>
              <option value="">Seleccionar</option>
              <option value="Tucumán">Tucumán</option>
              <option value="Buenos Aires">Buenos Aires</option>
            </select>
          </div>
          <div>
            <label className="block mb-1">Ciudad</label>
            <select name="ciudad" value={form.ciudad} onChange={handleChange} className="w-full px-2 py-2 rounded-md border bg-gray-50" required>
              <option value="">Seleccionar</option>
              <option value="Concepción">Concepción</option>
              <option value="San Miguel">San Miguel</option>
            </select>
          </div>
        </div>
        
        {/* Mensajes de estado para el usuario */}
        {success && <p className="text-center text-green-600 font-semibold">{success}</p>}
        {error && <p className="text-center text-red-600 font-semibold">{error}</p>}
        
        <div className="text-right mt-6">
          <button
            type="submit"
            disabled={loading} // Deshabilita el botón mientras se envía
            className="bg-[#5A738E] hover:bg-[#4a6075] text-white px-5 py-2 rounded-md transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Enviando...' : 'Enviar'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default FormularioVoluntario;