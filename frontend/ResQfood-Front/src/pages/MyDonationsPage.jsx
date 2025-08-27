import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Clock, MapPin, User, Calendar, Package } from 'lucide-react';
import ProposeScheduleModal from '../components/modals/ProposeScheduleModal';

const MyDonationsPage = () => {
  const { user, token } = useAuth();
  const [donations, setDonations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedSolicitud, setSelectedSolicitud] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetchMyDonations();
  }, []);

  const fetchMyDonations = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/donacion/mis-donaciones`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await response.json();
      if (data.success) {
        setDonations(data.donaciones);
      }
    } catch (error) {
      console.error('Error al obtener donaciones:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAcceptSolicitud = (solicitud) => {
    setSelectedSolicitud(solicitud);
  };

  const handleSubmitSchedule = async (solicitudId, propuesta) => {
    setIsSubmitting(true);
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/solicitud/${solicitudId}/aceptar-y-proponer`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify(propuesta)
        }
      );

      const data = await response.json();
      
      if (data.success) {
        
        await fetchMyDonations();
        setSelectedSolicitud(null);
        alert('Propuesta de horario enviada exitosamente!');
      } else {
        alert('Error: ' + (data.message || 'No se pudo enviar la propuesta'));
      }
    } catch (error) {
      console.error('Error al enviar propuesta:', error);
      alert('Error al enviar la propuesta');
    } finally {
      setIsSubmitting(false);
    }
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      'disponible': { color: 'bg-green-100 text-green-800', text: 'Disponible' },
      'pendiente': { color: 'bg-yellow-100 text-yellow-800', text: 'Pendiente' },
      'entregado': { color: 'bg-gray-100 text-gray-800', text: 'Entregado' },
      'cancelado': { color: 'bg-red-100 text-red-800', text: 'Cancelado' }
    };
    
    const config = statusConfig[status] || statusConfig['disponible'];
    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.color}`}>
        {config.text}
      </span>
    );
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Mis Donaciones</h1>
        <p className="text-gray-600">Gestiona tus donaciones y solicitudes recibidas</p>
      </div>

      {donations.length === 0 ? (
        <div className="text-center py-12">
          <Package className="h-24 w-24 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No tienes donaciones</h3>
          <p className="text-gray-500">Comienza creando tu primera donación para ayudar a otros.</p>
        </div>
      ) : (
        <div className="grid gap-6">
          {donations.map((donation) => (
            <div key={donation._id} className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="flex">
                <div className="w-48 h-48 flex-shrink-0">
                  <img
                    src={donation.imagen}
                    alt={donation.titulo}
                    className="w-full h-full object-cover"
                  />
                </div>
                
                <div className="flex-1 p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-xl font-bold text-gray-900 mb-2">{donation.titulo}</h3>
                      <p className="text-gray-600 mb-2">{donation.descripcion}</p>
                      <div className="flex items-center gap-4 text-sm text-gray-500">
                        <div className="flex items-center gap-1">
                          <MapPin className="h-4 w-4" />
                          <span>{donation.ubicacion}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Package className="h-4 w-4" />
                          <span>{donation.cantidad} unidades</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Calendar className="h-4 w-4" />
                          <span>{new Date(donation.fechaCreacion).toLocaleDateString()}</span>
                        </div>
                      </div>
                    </div>
                    {getStatusBadge(donation.estado)}
                  </div>

                  {/* Solicitudes */}
                  {donation.solicitudes && donation.solicitudes.length > 0 && (
                    <div className="border-t pt-4">
                      <h4 className="font-medium text-gray-900 mb-3">
                        Solicitudes ({donation.solicitudes.length})
                      </h4>
                      
                      <div className="space-y-3">
                        {donation.solicitudes.map((solicitud) => (
                          <div key={solicitud._id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                            <div className="flex items-center gap-3">
                              <User className="h-5 w-5 text-gray-400" />
                              <div>
                                <p className="font-medium text-gray-900">
                                  {solicitud.solicitanteId?.nombre || 'Usuario'}
                                </p>
                                <p className="text-sm text-gray-500">
                                  {solicitud.mensaje || 'Sin mensaje'}
                                </p>
                                <p className="text-xs text-gray-400">
                                  {new Date(solicitud.fechaSolicitud).toLocaleDateString()}
                                </p>
                              </div>
                            </div>
                            
                            <div className="flex items-center gap-2">
                              <span className={`px-2 py-1 text-xs rounded-full font-medium ${
                                solicitud.estado === 'pendiente' ? 'bg-yellow-100 text-yellow-800' :
                                solicitud.estado === 'aceptada' ? 'bg-green-100 text-green-800' :
                                solicitud.estado === 'rechazada' ? 'bg-red-100 text-red-800' :
                                'bg-gray-100 text-gray-800'
                              }`}>
                                {solicitud.estado}
                              </span>
                              
                              {solicitud.estado === 'pendiente' && (
                                <button
                                  onClick={() => handleAcceptSolicitud(solicitud)}
                                  className="px-3 py-1 bg-primary text-white text-xs rounded hover:bg-brandPrimaryDarker transition-colors"
                                >
                                  Aceptar
                                </button>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

  
      {selectedSolicitud && (
        <ProposeScheduleModal
          solicitud={selectedSolicitud}
          onClose={() => setSelectedSolicitud(null)}
          onSubmit={handleSubmitSchedule}
          isSubmitting={isSubmitting}
        />
      )}
    </div>
  );
};

export default MyDonationsPage;