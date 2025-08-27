// //DropsownSolicitudes.jsx

// import React, { useState } from 'react';
// import { useAuth } from '@clerk/clerk-react';
// import { ChevronDown, ChevronRight } from 'lucide-react';
// import Modal from './Modal';
// import FormularioConfirmacion from './FormularioConfirmacion';
// import API_BASE_URL from '../../api/config';

// const DropdownSolicitudes = ({ solicitudes, solicitudAceptada, donacionId }) => {
//   const [open, setOpen] = useState(false);
//   const [modalVisible, setModalVisible] = useState(false);
//   const [solicitudSeleccionada, setSolicitudSeleccionada] = useState(null);
//   const { getToken } = useAuth();

//   const handleAceptarClick = (solicitud) => {
//     setSolicitudSeleccionada(solicitud);
//     setModalVisible(true);
//   };

//   const handleRechazarClick = async (solicitud) => {
//     if (!window.confirm(`¿Estás seguro de que quieres rechazar la solicitud de ${solicitud.solicitanteId?.nombre || 'este usuario'}?`)) return;
//     try {
//       const token = await getToken();
//       const response = await fetch(`${API_BASE_URL}/api/solicitud/${solicitud._id}/rechazar`, {
//         method: 'POST',
//         headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
//         body: JSON.stringify({ motivoRechazo: 'El donante ha rechazado la solicitud.' })
//       });
//       if (!response.ok) throw new Error('Error al rechazar la solicitud');
//       alert('Solicitud rechazada.');
//       window.location.reload();
//     } catch (error) {
//       console.error('Error al rechazar:', error);
//       alert(error.message);
//     }
//   };

//   const handleFormularioSubmit = async (data) => {
//     try {
//       const token = await getToken();

      
//       const horarioEntregaPropuestaPorDonanteObj = {
//           horarioInicio: data.horaDesde,
//           horarioFin: data.horaHasta,
//       };

   
//       const fechaInicio = new Date(`${data.fechaDesde}T${data.horaDesde}`);
//       let fechaFin = null;
//       if (data.fechaHasta) {
        
//         fechaFin = new Date(`${data.fechaHasta}T${data.horaHasta}`);
//       } else {
        
//         fechaFin = new Date(`${data.fechaDesde}T${data.horaHasta}`);
//       }
      
//       const fechaPropuestoObj = {
//           fechaInicio: fechaInicio,
//           fechaFin: fechaFin,
//       };

//       const payload = {
//         horarioEntregaPropuestaPorDonante: horarioEntregaPropuestaPorDonanteObj,
//         fechaPropuesto: fechaPropuestoObj,
//       };

//       const response = await fetch(`${API_BASE_URL}/api/solicitud/${solicitudSeleccionada._id}/aceptar-y-proponer`, {
//         method: 'POST',
//         headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
//         body: JSON.stringify(payload)
//       });

//       if (!response.ok) {
//         const errorData = await response.json();
//         throw new Error(errorData.message || 'Error al aceptar la solicitud');
//       }

//       alert('Solicitud aceptada y horario propuesto.');
//       setModalVisible(false);
//       window.location.reload();
//     } catch (error) {
//       console.error('Error al aceptar:', error);
//       alert(error.message);
//     }
//   };

//   return (
//     <div className="bg-gray-50 text-black rounded-lg shadow-sm overflow-hidden w-full border border-gray-200">
//       <button
//         onClick={() => setOpen(!open)}
//         className="w-full flex items-center justify-between px-4 py-3 text-left font-medium text-sm hover:bg-gray-100 transition"
//       >
//         <span>Lista de solicitudes ({solicitudes.length})</span>
//         {open ? <ChevronDown className="w-5 h-5" /> : <ChevronRight className="w-5 h-5" />}
//       </button>

//       {open && (
//         <div className="divide-y border-t border-gray-200 px-4 pb-3">
//           {solicitudes.length === 0 ? (
//             <p className="text-sm py-3 text-gray-500">No hay solicitudes pendientes.</p>
//           ) : (
//             solicitudes.map((s) => (
//               <div key={s._id} className="py-3 flex flex-col sm:flex-row justify-between sm:items-center">
//                 <div className="text-sm">
//                   <p><strong>Usuario:</strong> {s.solicitanteId?.nombre || 'Usuario desconocido'}</p>
//                 </div>
//                 <div className="flex gap-2 mt-2 sm:mt-0">
//                   <button
//                       onClick={() => handleAceptarClick(s)}
//                       className={`text-xs px-3 py-1 rounded transition ${
//                       solicitudAceptada
//                           ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
//                           : 'bg-green-500 hover:bg-green-600 text-white'
//                       }`}
//                       disabled={!!solicitudAceptada}
//                   >
//                       Aceptar
//                   </button>
//                   <button
//                     onClick={() => handleRechazarClick(s)}
//                     className="bg-red-500 hover:bg-red-600 text-white text-xs px-3 py-1 rounded transition"
//                     disabled={!!solicitudAceptada}
//                   >
//                     Rechazar
//                   </button>
//                 </div>
//               </div>
//             ))
//           )}
//         </div>
//       )}

//       <Modal isOpen={modalVisible} onClose={() => setModalVisible(false)}>
//         <h2 className="text-lg font-semibold mb-4">Proponer Horario de Entrega</h2>
//         <FormularioConfirmacion onSubmit={handleFormularioSubmit} />
//       </Modal>
//     </div>
//   );
// };

// export default DropdownSolicitudes;