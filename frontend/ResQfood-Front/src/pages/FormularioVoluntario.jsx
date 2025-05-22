import React, { useState } from "react";

const FormularioVoluntario = () => {
  const [form, setForm] = useState({
    nombre: "",
    nacimiento: "",
    email: "",
    telefono: "",
    pais: "",
    provincia: "",
    ciudad: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Formulario enviado:", form);
    // Enviar al backend si es necesario
  };

  return (
    <div className="max-w-3xl mx-auto mt-10 p-6 rounded-xl shadow-md bg-white text-gray-800">
      <h1 className="text-2xl md:text-3xl font-semibold text-center mb-10 text-green-700">
        Participa como voluntario
      </h1>

      <form onSubmit={handleSubmit} className="space-y-4 text-sm">
        <div>
          <label className="block mb-1">Nombre Completo</label>
          <input
            type="text"
            name="nombre"
            value={form.nombre}
            onChange={handleChange}
            className="w-full px-3 py-2 rounded-md border bg-gray-50"
            required
          />
        </div>

        <div>
          <label className="block mb-1">Fecha de nacimiento</label>
          <input
            type="date"
            name="nacimiento"
            value={form.nacimiento}
            onChange={handleChange}
            className="w-full px-3 py-2 rounded-md border bg-gray-50"
            required
          />
        </div>

        <div>
          <label className="block mb-1">Correo Electrónico</label>
          <input
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            className="w-full px-3 py-2 rounded-md border bg-gray-50"
            required
          />
        </div>

        <div>
          <label className="block mb-1">Teléfono</label>
          <input
            type="tel"
            name="telefono"
            value={form.telefono}
            onChange={handleChange}
            className="w-full px-3 py-2 rounded-md border bg-gray-50"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block mb-1">País</label>
            <select
              name="pais"
              value={form.pais}
              onChange={handleChange}
              className="w-full px-2 py-2 rounded-md border bg-gray-50"
              required
            >
              <option value="">Seleccionar</option>
              <option value="Argentina">Argentina</option>
              <option value="Otro">Otro</option>
            </select>
          </div>

          <div>
            <label className="block mb-1">Provincia</label>
            <select
              name="provincia"
              value={form.provincia}
              onChange={handleChange}
              className="w-full px-2 py-2 rounded-md border bg-gray-50"
              required
            >
              <option value="">Seleccionar</option>
              <option value="Tucumán">Tucumán</option>
              <option value="Buenos Aires">Buenos Aires</option>
            </select>
          </div>

          <div>
            <label className="block mb-1">Ciudad</label>
            <select
              name="ciudad"
              value={form.ciudad}
              onChange={handleChange}
              className="w-full px-2 py-2 rounded-md border bg-gray-50"
              required
            >
              <option value="">Seleccionar</option>
              <option value="Concepción">Concepción</option>
              <option value="San Miguel">San Miguel</option>
            </select>
          </div>
        </div>

        <div className="text-right mt-6">
          <button
            type="submit"
            className="bg-[#5A738E] hover:bg-[#4a6075] text-white px-5 py-2 rounded-md transition"
          >
            Enviar
          </button>
        </div>
      </form>
    </div>
  );
};

export default FormularioVoluntario;
