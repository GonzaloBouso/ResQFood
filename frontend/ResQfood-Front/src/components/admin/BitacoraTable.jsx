import React from 'react';
import DetallesCambio from './DetallesCambio'; 
const BitacoraTable = ({ registros }) => {
    if (!registros || registros.length === 0) {
        return <p className="text-center text-gray-500 py-10">No hay registros de actividad recientes.</p>;
    }

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleString('es-ES', {
            day: '2-digit', month: '2-digit', year: 'numeric',
            hour: '2-digit', minute: '2-digit',
        });
    };

    return (
        <div className="overflow-x-auto">
            <table className="min-w-full bg-white text-sm">
                <thead className="bg-gray-50">
                    <tr>
                        <th className="text-left font-semibold px-4 py-3 text-gray-600 w-[140px]">Fecha</th>
                        <th className="text-left font-semibold px-4 py-3 text-gray-600 w-1/5">Administrador</th>
                        <th className="text-left font-semibold px-4 py-3 text-gray-600">Acción</th>
                        <th className="text-left font-semibold px-4 py-3 text-gray-600 w-1/4">Detalles del Cambio</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                    {registros.map(log => (
                        <tr key={log._id} className="hover:bg-gray-50 align-top">
                            <td className="px-4 py-3 whitespace-nowrap text-gray-500">{formatDate(log.createdAt)}</td>
                            <td className="px-4 py-3 whitespace-nowrap font-medium text-gray-800">{log.actorId?.nombre || 'Admin no encontrado'}</td>
                            <td className="px-4 py-3 text-gray-700">{log.accion}</td>
                            <td className="px-4 py-3">
                                
                                <DetallesCambio detalles={log.detallesAdicionales} />
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default BitacoraTable;