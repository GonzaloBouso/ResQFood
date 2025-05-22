import React from "react";
import { Star } from "lucide-react";

const CardOpinion = ({ user = "Juan", rating = 3.5, comment = "Estuvo muy bueno" }) => {
  return (
    <div className="border rounded-lg p-4 bg-white shadow-sm flex flex-col gap-2">
      {/* Usuario */}
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 bg-purple-100 text-purple-700 rounded-full flex items-center justify-center font-semibold text-sm">
          {user[0]}
        </div>
        <span className="text-sm font-medium text-gray-800">{user}</span>
        {/* Estrellas visuales */}
        <div className="flex ml-auto gap-[2px]">
          {[1, 2, 3, 4, 5].map((value) => {
            const fill =
              rating >= value ? 100 : rating >= value - 0.5 ? 50 : 0;

            return (
              <div key={value} className="relative w-5 h-5">
                <Star className="absolute w-5 h-5 text-gray-300" />
                <Star
                  className="absolute w-5 h-5 text-yellow-400"
                  style={{ clipPath: `inset(0 ${100 - fill}% 0 0)` }}
                />
              </div>
            );
          })}
        </div>
      </div>

      {/* Comentario */}
      <p className="text-sm text-gray-700">{comment}</p>
    </div>
  );
};

export default CardOpinion;
