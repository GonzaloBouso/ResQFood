import React, { useState } from 'react';
import StarRating from '../components/layout/Estrellas';

const Calificacion = () => {
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(null);
  const [opinion, setOpinion] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log({ rating, opinion });
    
  };

  return (
    <div className="max-w-3xl mx-auto mt-10 p-6 border border-gray-300 rounded-lg bg-white shadow-sm text-center">
      <h1 className="text-2xl sm:text-3xl font-semibold mb-6 text-gray-800">Danos tu opinión</h1>

      <StarRating rating={rating} setRating={setRating} hover={hover} setHover={setHover} />

      <form onSubmit={handleSubmit} className="flex flex-col items-center gap-4">
        <label htmlFor="opinion" className="text-left w-full text-sm font-medium text-gray-700">
          TU OPINIÓN:
        </label>
        <textarea
          id="opinion"
          value={opinion}
          onChange={(e) => setOpinion(e.target.value)}
          placeholder="Escribe tu comentario..."
          className="w-full h-28 p-3 border rounded-lg bg-gray-100 text-gray-800 resize-none focus:outline-none focus:ring-2 focus:ring-[#A8D5BA]"
        />
        <button
          type="submit"
          className="bg-[#5A738E] text-white px-6 py-2 rounded-md hover:bg-[#4a6075] transition"
        >
          Enviar
        </button>
      </form>
    </div>
  );
};

export default Calificacion;
