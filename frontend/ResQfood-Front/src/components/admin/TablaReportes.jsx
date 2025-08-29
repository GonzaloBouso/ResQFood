// frontend/src/components/admin/TablaReportes.jsx (NUEVO ARCHIVO)
import React from 'react';
import { Link } from 'react-router-dom';
import { Check, X, UserX, Trash2 } from 'lucide-react';

const TablaReportes = ({ reportes, onResolver, onSuspenderUsuario, onEliminarDonacion }) => {
    if (!reportes || reportes.length === 0) {
        return <p className="text-center text-gray-500 py-10">¡Excelente! No hay reportes pendientes.</p>;
    }

    return (
        <div className="overflow-x-auto">
            <table className="min-w-full bg-white text-sm">
                <thead className="bg-gray-50">
                    <tr>
                        <th className="px-4 py-3 text-left font-semibold text-gray-600">Donación</th>
                        <th className="px-4 py-3 text-left font-semibold text-gray-600">Usuario Reportado</th>
                        <th className="px-4 py-3 text-left font-semibold text-gray-600">Motivo</th>
                        <th className="px-4 py-3 text-left font-semibold text-gray-600">Reportado Por</th>
                        <th className="px-4 py-3 text-left font-semibold text-gray-600">Acciones</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                    {reportes.map(reporte => (
                        <tr key={reporte._id} className="hover:bg-gray-50">
                            <td className="px-4 py-3"><Link to={`/donacion/${reporte.donacionReportada._id}`} className="text-primary hover:underline">{reporte.donacionReportada.titulo}</Link></td>
                            <td className="px-4 py-3"><Link to={`/perfil/${reporte.usuarioReportado._id}`} className="text-primary hover:underline">{reporte.usuarioReportado.nombre}</Link></td>
                            <td className="px-4 py-3">{reporte.motivo}</td>
                            <td className="px-4 py-3">{reporte.reportadoPor.nombre}</td>
                            <td className="px-4 py-3">
                                <div className="flex items-center gap-2">
                                    <button onClick={() => onResolver(reporte._id)} title="Desestimar Reporte" className="p-1 text-green-600 hover:bg-green-100 rounded-full"><Check size={16} /></button>
                                    <button onClick={() => onEliminarDonacion(reporte.donacionReportada._id)} title="Eliminar Donación" className="p-1 text-orange-600 hover:bg-orange-100 rounded-full"><Trash2 size={16} /></button>
                                    <button onClick={() => onSuspenderUsuario(reporte.usuarioReportado._id)} title="Suspender Usuario Reportado" className="p-1 text-red-600 hover:bg-red-100 rounded-full"><UserX size={16} /></button>
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default TablaReportes;