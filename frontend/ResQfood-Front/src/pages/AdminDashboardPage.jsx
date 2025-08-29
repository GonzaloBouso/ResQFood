// frontend/src/pages/AdminDashboardPage.jsx (CÓDIGO COMPLETO Y CORREGIDO)
import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@clerk/clerk-react';
import { Search, Edit, ShieldAlert, Users } from 'lucide-react';
import API_BASE_URL from '../api/config';
import ManageUserModal from '../components/modals/ManageUserModal';
import TablaReportes from '../components/admin/TablaReportes'; // Importamos la nueva tabla
import toast from 'react-hot-toast';

// Tus componentes UserTable y Pagination se quedan igual que los tienes
const UserTable = ({ users, onEditUser }) => { /* ... tu código existente ... */ };
const Pagination = ({ currentPage, totalPages, onPageChange }) => { /* ... tu código existente ... */ };

const AdminDashboardPage = () => {
    const { getToken } = useAuth();
    
    const [vistaActual, setVistaActual] = useState('usuarios'); 
    const [users, setUsers] = useState([]);
    const [reportes, setReportes] = useState([]);
    const [pagination, setPagination] = useState({ currentPage: 1, totalPages: 1, totalItems: 0 });
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [editingUser, setEditingUser] = useState(null);
    const [filters, setFilters] = useState({ rol: '', search: '' });
    const [page, setPage] = useState(1);

    const fetchUsers = useCallback(async (currentPage, currentFilters) => { /* ... tu código de fetchUsers está bien ... */ }, [getToken]);
    
    const fetchReportes = useCallback(async () => {
        setIsLoading(true); setError(null);
        try {
            const token = await getToken();
            const response = await fetch(`${API_BASE_URL}/api/reporte`, { headers: { 'Authorization': `Bearer ${token}` } });
            if (!response.ok) throw new Error('No se pudieron cargar los reportes.');
            const data = await response.json();
            setReportes(data.reportes);
        } catch (err) { setError(err.message); } finally { setIsLoading(false); }
    }, [getToken]);

    useEffect(() => {
        if (vistaActual === 'usuarios') {
            const debounceTimer = setTimeout(() => { fetchUsers(page, filters); }, 300);
            return () => clearTimeout(debounceTimer);
        } else if (vistaActual === 'reportes') {
            fetchReportes();
        }
    }, [page, filters, vistaActual, fetchUsers, fetchReportes]);

    const handleFilterChange = (e) => {
        const { name, value } = e.target;
        setPage(1);
        setFilters(prev => ({ ...prev, [name]: value }));
    };

    const handleUpdateAndRefresh = () => { setEditingUser(null); fetchUsers(page, filters); };

    // --- Nuevas funciones para manejar acciones de reportes ---
    const handleResolverReporte = async (reporteId) => {
        if (!window.confirm("¿Seguro que quieres desestimar este reporte?")) return;
        const toastId = toast.loading('Resolviendo reporte...');
        try {
            const token = await getToken();
            await fetch(`${API_BASE_URL}/api/reporte/${reporteId}/resolver`, { method: 'PATCH', headers: { 'Authorization': `Bearer ${token}` }});
            toast.success('Reporte resuelto.', { id: toastId });
            fetchReportes(); // Recargar
        } catch (e) { toast.error('Error al resolver el reporte.', { id: toastId }); }
    };

    const handleSuspenderUsuario = async (userId, reporteId) => {
        if (!window.confirm("¡Atención! ¿Seguro que quieres SUSPENDER a este usuario?")) return;
        const toastId = toast.loading('Suspendiendo usuario...');
        try {
            const token = await getToken();
            // 1. Suspender al usuario
            await fetch(`${API_BASE_URL}/api/usuario/${userId}/manage`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
                body: JSON.stringify({ activo: false }) // Suspender
            });
            // 2. Marcar el reporte como resuelto
            await fetch(`${API_BASE_URL}/api/reporte/${reporteId}/resolver`, { method: 'PATCH', headers: { 'Authorization': `Bearer ${token}` }});
            toast.success('Usuario suspendido y reporte resuelto.', { id: toastId });
            fetchReportes(); // Recargar
        } catch (e) { toast.error('Error al suspender al usuario.', { id: toastId }); }
    };

    const handleEliminarDonacion = async (donacionId, reporteId) => {
        if (!window.confirm("¡Atención! ¿Seguro que quieres ELIMINAR esta donación?")) return;
        const toastId = toast.loading('Eliminando donación...');
        try {
            const token = await getToken();
            // 1. Eliminar la donación
            await fetch(`${API_BASE_URL}/api/donacion/${donacionId}`, { method: 'DELETE', headers: { 'Authorization': `Bearer ${token}` }});
             // 2. Marcar el reporte como resuelto
            await fetch(`${API_BASE_URL}/api/reporte/${reporteId}/resolver`, { method: 'PATCH', headers: { 'Authorization': `Bearer ${token}` }});
            toast.success('Donación eliminada y reporte resuelto.', { id: toastId });
            fetchReportes(); // Recargar
        } catch (e) { toast.error('Error al eliminar la donación.', { id: toastId }); }
    };

    return (
        <div className="container mx-auto py-10">
            <h1 className="text-4xl font-bold mb-8">Panel de Administrador</h1>
            
            <div className="mb-6 flex border-b">
                <button onClick={() => setVistaActual('usuarios')} className={`px-4 py-2 font-semibold flex items-center gap-2 ${vistaActual === 'usuarios' ? 'border-b-2 border-primary text-primary' : 'text-gray-500'}`}><Users size={18}/> Gestión de Usuarios</button>
                <button onClick={() => setVistaActual('reportes')} className={`px-4 py-2 font-semibold flex items-center gap-2 ${vistaActual === 'reportes' ? 'border-b-2 border-primary text-primary' : 'text-gray-500'}`}>
                    <ShieldAlert size={18}/> Gestión de Reportes {reportes.length > 0 && <span className="bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">{reportes.length}</span>}
                </button>
            </div>

            {vistaActual === 'usuarios' && (
                <div className="bg-white p-6 rounded-lg shadow-md animate-fade-in-up">
                    <h2 className="text-2xl font-semibold mb-4">Usuarios Registrados ({pagination.totalItems})</h2>
                    { /* ... tu JSX de filtros de usuario que ya funciona ... */ }
                    {isLoading ? <p>Cargando...</p> : error ? <p>{error}</p> : <UserTable users={users} onEditUser={setEditingUser} />}
                    <Pagination currentPage={page} totalPages={pagination.totalPages} onPageChange={setPage} />
                </div>
            )}

            {vistaActual === 'reportes' && (
                <div className="bg-white p-6 rounded-lg shadow-md animate-fade-in-up">
                    <h2 className="text-2xl font-semibold mb-4">Reportes Pendientes ({reportes.length})</h2>
                    {isLoading ? <p>Cargando...</p> : error ? <p>{error}</p> : 
                        <TablaReportes 
                            reportes={reportes} 
                            onResolver={handleResolverReporte} 
                            onSuspenderUsuario={handleSuspenderUsuario} 
                            onEliminarDonacion={handleEliminarDonacion}
                        />}
                </div>
            )}

            {editingUser && <ManageUserModal user={editingUser} onClose={() => setEditingUser(null)} onUpdate={handleUpdateAndRefresh}/>}
        </div>
    );
};

export default AdminDashboardPage;