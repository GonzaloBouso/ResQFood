import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const MyDonationsPage = () => {
  const [donaciones, setDonaciones] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDonations = async () => {
      try {
        const response = await fetch("http://localhost:3000/api/donaciones/mis-donaciones");
        const data = await response.json();
        console.log("fetchDonations → data:", data);

        setDonaciones(data.donaciones || []);
      } catch (error) {
        console.error("Error al cargar las donaciones:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDonations();
  }, []);

  if (loading) {
    return <p className="text-center py-10">Cargando donaciones...</p>;
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Mis Donaciones</h1>

      {donaciones && donaciones.length > 0 ? (
        <div className="space-y-4">
          {donaciones.map((donacion) => (
            <div
              key={donacion._id}
              className="p-4 border rounded-lg shadow-sm bg-white"
            >
              <h2 className="font-semibold">{donacion.titulo}</h2>
              <p className="text-gray-600">{donacion.descripcion}</p>
              <p className="text-sm text-gray-500">
                Estado: {donacion.estado || "Activo"}
              </p>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-10 border-2 border-dashed rounded-lg">
          <p className="text-gray-600 mb-4">No tienes donaciones activas.</p>
          <Link
            to="/publicar-donacion"
            className="inline-block bg-primary text-white font-bold py-2 px-4 rounded hover:bg-brandPrimaryDarker"
          >
            ¡Publica una donación!
          </Link>
        </div>
      )}
    </div>
  );
};

export default MyDonationsPage;
