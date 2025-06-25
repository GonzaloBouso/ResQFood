import React, { useEffect, useState } from 'react';
import { useAuth } from '@clerk/clerk-react';

const FALLBACK_IMAGE = 'https://via.placeholder.com/300x300.png?text=Sin+Imagen';

const DetallesCardDonacion = ({ donacionId, onClose }) => {
  const [donacion, setDonacion] = useState(null);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);
  const { getToken } = useAuth();

  useEffect(() => {
    if (!donacionId) return;

    const fetchDonacion = async () => {
      try {
        const token = await getToken();
        const res = await fetch(`/donacion/${donacionId}`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        if (!res.ok) {
          const text = await res.text();
          console.error("Respuesta cruda del backend:", text);
          throw new Error(`Error al obtener los detalles (${res.status})`);
        }

        const data = await res.json();
        setDonacion(data.donacion);
      } catch (err) {
        console.error(err);
        setError('No se pudieron obtener los detalles.');
      } finally {
        setCargando(false);
      }
    };

    fetchDonacion();
  }, [donacionId, getToken]);

  if (!donacionId) return null;

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white border border-gray-300 rounded-xl w-full max-w-xl shadow-lg overflow-hidden relative">
        {/* Botón cerrar */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-500 hover:text-red-500 text-2xl font-bold"
        >
          &times;
        </button>

        {cargando ? (
          <div className="p-6 text-center">Cargando...</div>
        ) : error ? (
          <div className="p-6 text-red-600 text-center">{error}</div>
        ) : (
          <div className="p-6 space-y-5">
            {/* Título */}
            <h2 className="text-xl font-semibold text-center text-gray-800">{donacion.titulo}</h2>

            {/* Imagen */}
            <div className="mx-auto w-full max-w-[240px] aspect-square rounded-lg overflow-hidden bg-gray-100 border border-gray-200 shadow-sm">
              <img
                src={donacion.imagenesUrl?.[0] || FALLBACK_IMAGE}
                alt="Imagen de la donación"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="border-b border-gray-200 w-full" />

            {/* Información */}
            <div className="space-y-4 text-sm text-gray-700">
              <div>
                <p className="text-xs uppercase tracking-wide text-primary mb-1">Descripción</p>
                <p>{donacion.descripcion}</p>
              </div>

              <div>
                <p className="text-xs uppercase tracking-wide text-primary mb-1">Categoría</p>
                <p>{donacion.categoria}</p>
              </div>

              <div>
                <p className="text-xs uppercase tracking-wide text-primary mb-1">Estado del alimento</p>
                <p>{donacion.estadoAlimento}</p>
              </div>

              <div>
                <p className="text-xs uppercase tracking-wide text-primary mb-1">Ubicación</p>
                <p>{donacion.ubicacionRetiro?.direccion}, {donacion.ubicacionRetiro?.ciudad}, {donacion.ubicacionRetiro?.provincia}</p>
              </div>

              {donacion.condicionesEspeciales && (
                <div>
                  <p className="text-xs uppercase tracking-wide text-primary mb-1">Condiciones especiales</p>
                  <p>{donacion.condicionesEspeciales}</p>
                </div>
              )}

              {(donacion.informacionContactoAlternativa?.telefono || donacion.informacionContactoAlternativa?.email) && (
                <div>
                  <p className="text-xs uppercase tracking-wide text-primary mb-1">Contacto</p>
                  {donacion.informacionContactoAlternativa?.telefono && (
                    <p>📞 {donacion.informacionContactoAlternativa.telefono}</p>
                  )}
                  {donacion.informacionContactoAlternativa?.email && (
                    <p>✉️ {donacion.informacionContactoAlternativa.email}</p>
                  )}
                </div>
              )}
            </div>

            {/* Botón Solicitar */}
            <div className="pt-4 border-t border-gray-200">
              <button
                onClick={() => {
                  console.log("Solicitud enviada para:", donacion._id);
                  // Podés integrar lógica real más adelante
                }}
                className="w-full px-4 py-2 mt-2 bg-primary text-white rounded-md text-sm font-medium hover:bg-brandPrimaryDarker transition-colors"
              >
                Solicitar
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DetallesCardDonacion;
