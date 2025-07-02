import React from "react";
import { Link } from "react-router-dom";
import { FaPlusCircle } from "react-icons/fa";

const BotonPublicar = ({
  text = "Publicar nueva donación",
  path = "/publicar-donacion"
}) => {
  return (
    <Link
      to={path}
      className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-emerald-500 to-emerald-700 text-white font-semibold rounded-full shadow-md hover:from-emerald-600 hover:to-emerald-800 transition-colors duration-300"
    >
      <FaPlusCircle className="text-white" />
      {text}
    </Link>
  );
};

export default BotonPublicar;
