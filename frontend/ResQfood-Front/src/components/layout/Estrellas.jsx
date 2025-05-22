import React from "react";
import { Star } from "lucide-react";

const Estrellas = ({ rating, setRating, hover, setHover }) => {
  const getFillPercent = (value) => {
    const current = hover !== null ? hover : rating;
    if (current >= value) return 100;
    if (current >= value - 0.5) return 50;
    return 0;
  };

  return (
    <div className="flex justify-center gap-2 mb-6">
      {[1, 2, 3, 4, 5].map((value) => {
        const fill = getFillPercent(value);
        return (
          <button
            key={value}
            type="button"
            onClick={() => setRating(value)}
            onMouseEnter={() => setHover(value)}
            onMouseLeave={() => setHover(null)}
            className="relative w-10 h-10"
          >
            {/* Fondo vacío */}
            <Star className="absolute top-0 left-0 w-10 h-10 text-gray-300" />
            {/* Estrella rellena parcialmente con máscara */}
            <Star
              className="absolute top-0 left-0 w-10 h-10 text-yellow-400"
              style={{
                clipPath: `inset(0 ${100 - fill}% 0 0)`,
              }}
            />
          </button>
        );
      })}
    </div>
  );
};

export default Estrellas;
