// frontend/ResQfood-Front/src/components/admin/BitacoraTable.jsx

import React from 'react';

const BitacoraTable = ({ registros }) => {
    if (!registros || registros.length === 0) {
        return <p className="text-center text-gray-500 py-10">No hay registros de actividad.</p>;
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
                        <th className="text-left font-semibold px-4 py-3 text-gray-600">Fecha</th>
                        <th className="text-left font-semibold px-4 py-3 text-gray-600">Administrador</th>
                        <th className="text-left font-semibold px-4 py-3 text-gray-600">Acción</th>
                        <th className="text-left font-semibold px-4 py-3 text-gray-600">Detalles</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                    {registros.map(log => (
                        <tr key={log._id} className="hover:bg-gray-50">
                            <td className="px-4 py-3 whitespace-nowrap">{formatDate(log.createdAt)}</td>
                            <td className="px-4 py-3 whitespace-nowrap">{log.actorId?.nombre || 'Admin no encontrado'}</td>
                            <td className="px-4 py-3">{log.accion}</td>
                            <td className="px-4 py-3">
                                {log.detallesAdicionales && Object.keys(log.detallesAdicionales.antes).length > 0 ? (
                                    <pre className="text-xs bg-gray-100 p-2 rounded whitespace-pre-wrap">
                                        {JSON.stringify(log.detallesAdicionales, null, 2)}
                                    </pre>
                                ) : 'N/A'}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default BitacoraTable;