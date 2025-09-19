// frontend/src/pages/FormularioContacto.jsx

import React, { useState } from "react";
import API_BASE_URL from '../api/config.js'; 
const FormularioContacto = () => {
  const initialState = {
    nombre: "",
    email: "",
    mensaje: "",
  };

  const [form, setForm] = useState(initialState);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const response = await fetch(`${API_BASE_URL}/api/contacto/enviar`, {
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
    <main className="max-w-5xl mx-auto px-4 py-12 text-gray-800">
      <h1 className="text-2xl md:text-3xl font-semibold text-center mb-10 text-green-700">
        ¿Necesitás ayuda o querés contactarnos?
      </h1>

      <div className="flex flex-col md:flex-row items-start justify-center gap-6 p-6 md:p-12 rounded-xl shadow-md bg-gray-50">
        {/* Formulario */}
        <form onSubmit={handleSubmit} className="flex flex-col w-full md:w-1/2 gap-4 bg-white p-6 shadow-sm rounded-lg">
          <input
            type="text"
            name="nombre"
            value={form.nombre}
            onChange={handleChange}
            placeholder="Nombre"
            className="p-2 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
          <input
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            placeholder="Correo electrónico"
            className="p-2 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
          <textarea
            name="mensaje"
            value={form.mensaje}
            onChange={handleChange}
            placeholder="Mensaje"
            className="p-2 h-24 rounded border border-gray-300 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          ></textarea>

          {/* Mensajes de estado */}
          {success && <p className="text-center text-green-600 font-medium">{success}</p>}
          {error && <p className="text-center text-red-600 font-medium">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Enviando..." : "Enviar"}
          </button>
        </form>

        {/* Información de contacto */}
        <div className="flex flex-col items-center text-center gap-2 bg-white p-6 rounded-lg shadow-sm w-full md:w-1/3 mt-6 md:mt-0">
          <p className="text-green-800 font-medium">hola@resqfood.org</p>
          <p className="text-gray-700">+54 9 11 2345 6789</p>
        </div>
      </div>
    </main>
  );
};

export default FormularioContacto;