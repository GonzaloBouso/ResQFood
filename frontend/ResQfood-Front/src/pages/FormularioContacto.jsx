import React from "react";

const FormularioContacto = () => {
  return (
    <main className="max-w-5xl mx-auto px-4 py-12 text-gray-800">
      <h1 className="text-2xl md:text-3xl font-semibold text-center mb-10 text-green-700">
        ¿Necesitás ayuda o querés contactarnos?
      </h1>

      <div className="flex flex-col md:flex-row items-center justify-center gap-6 p-6 md:p-12 rounded-xl shadow-md">
        {/* Formulario */}
        <form className="flex flex-col w-full md:w-1/2 gap-4 bg-white p-6 shadow-sm rounded-lg">
          <input
            type="text"
            placeholder="Nombre"
            className="p-2 rounded border border-gray-300 focus:outline-none"
          />
          <input
            type="email"
            placeholder="Correo electrónico"
            className="p-2 rounded border border-gray-300 focus:outline-none"
          />
          <textarea
            placeholder="Mensaje"
            className="p-2 h-24 rounded border border-gray-300 resize-none focus:outline-none"
          ></textarea>
          <button
            type="submit"
            className="bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition-colors"
          >
            Enviar
          </button>
        </form>

        {/* Información de contacto */}
        <div className="flex flex-col items-center text-center gap-2 bg-white p-6 rounded-lg shadow-sm w-full md:w-1/3">
          {/* Icono omitido */}
          <p className="text-green-800 font-medium">hola@resqfood.org</p>
          <p className="text-gray-700">+54 9 11 2345 6789</p>
        </div>
      </div>
    </main>
  );
};

export default FormularioContacto;
