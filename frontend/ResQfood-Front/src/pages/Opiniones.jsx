import React from "react";
import CardOpinion from "../components/layout/CardOpinion";

const opinionesEjemplo = [
  { user: "Juan", rating: 3.5, comment: "Estuvo muy bueno" },
  { user: "Juan", rating: 4, comment: "Estuvo muy bueno" },
  { user: "Juan", rating: 5, comment: "Estuvo muy bueno" },
  { user: "Juan", rating: 2.5, comment: "Estuvo muy bueno" },
  { user: "Juan", rating: 3, comment: "Estuvo muy bueno" },
];

const Opiniones = () => {
  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold text-center mb-8 text-gray-900">OPINIONES</h1>
      <div className="space-y-4">
        {opinionesEjemplo.map((op, index) => (
          <CardOpinion key={index} {...op} />
        ))}
      </div>
    </div>
  );
};

export default Opiniones;
