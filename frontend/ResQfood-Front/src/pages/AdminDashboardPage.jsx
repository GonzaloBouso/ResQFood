// frontend/src/pages/AdminDashboardPage.jsx (CÓDIGO COMPLETO Y CORREGIDO)
import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@clerk/clerk-react';
import { Search, Edit, ShieldAlert } from 'lucide-react';
import API_BASE_URL from '../api/config';
import ManageUserModal from '../components/modals/ManageUserModal';
import TablaReportes from '../components/admin/TablaReportes'; // Importamos la nueva tabla
import toast from 'react-hot-toast';

// ... (El componente UserTable y Pagination se quedan igual que los tienes)
const UserTable = ({ users, onEditUser }) => { /* ... tu código ... */ };
const Pagination = ({ currentPage, totalPages, onPageChange }) => { /* ... tu código ... */ };

const AdminDashboardPage = () => {
    const { getToken } = useAuth();
    
    // Nuevo estado para controlar la vista actual (usuarios o reportes)
    const [vistaActual, setVistaActual] = useState('usuarios'); 

    // Estados para los datos
    const [users, setUsers] = useState([]);
    const [reportes, setReportes] = useState([]);
    const [pagination, setPagination] = useState({ currentPage: 1, totalPages: 1, totalItems: 0 });
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [editingUser, setEditingUser] = useState(null);
    const [filters, setFilters] = useState({ rol: '', search: '' });
    const [page, setPage] = useState(1);

    const fetchUsers = useCallback(async (currentPage, currentFilters) => { /* ... tu código de fetchUsers está bien ... */ }, [getToken]);
    
    // Nueva función para obtener los reportes
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
    }, [page, filters, fetchUsers, vistaActual, fetchReportes]);

    const handleUpdateAndRefresh = () => { setEditingUser(null); fetchUsers(page, filters); };

    // --- Nuevas funciones para manejar acciones de reportes ---
    const handleResolverReporte = async (reporteId) => {
        if (!window.confirm("¿Seguro que quieres marcar este reporte como resuelto (desestimar)?")) return;
        try { /* ... lógica para llamar a /api/reporte/:id/resolver ... */ } catch (e) { /*...*/ }
    };
    const handleSuspenderUsuario = async (userId) => {
        if (!window.confirm("¿Seguro que quieres SUSPENDER a este usuario?")) return;
        try { /* ... lógica para llamar a /api/usuario/:id/manage ... */ } catch (e) { /*...*/ }
    };
    const handleEliminarDonacion = async (donacionId) => {
        if (!window.confirm("¿Seguro que quieres ELIMINAR esta donación?")) return;
        try { /* ... lógica para llamar a /api/donacion/:id ... */ } catch (e) { /*...*/ }
    };

    return (
        <div className="container mx-auto py-10">
            <h1 className="text-4xl font-bold mb-8">Panel de Administrador</h1>
            
            {/* --- Selector de Vista --- */}
            <div className="mb-6 flex border-b">
                <button onClick={() => setVistaActual('usuarios')} className={`px-4 py-2 font-semibold ${vistaActual === 'usuarios' ? 'border-b-2 border-primary text-primary' : 'text-gray-500'}`}>Gestión de Usuarios</button>
                <button onClick={() => setVistaActual('reportes')} className={`px-4 py-2 font-semibold flex items-center gap-2 ${vistaActual === 'reportes' ? 'border-b-2 border-primary text-primary' : 'text-gray-500'}`}>
                    <ShieldAlert size={18}/> Gestión de Reportes {reportes.length > 0 && <span className="bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">{reportes.length}</span>}
                </button>
            </div>

            {/* --- Renderizado Condicional de la Vista --- */}
            {vistaActual === 'usuarios' && (
                <div className="bg-white p-6 rounded-lg shadow-md">
                    <h2 className="text-2xl font-semibold mb-4">Usuarios Registrados ({pagination.totalItems})</h2>
                    {/* ... tu JSX de filtros de usuario ... */}
                    {isLoading ? <p>Cargando...</p> : error ? <p>{error}</p> : <UserTable users={users} onEditUser={setEditingUser} />}
                    <Pagination currentPage={page} totalPages={pagination.totalPages} onPageChange={setPage} />
                </div>
            )}

            {vistaActual === 'reportes' && (
                <div className="bg-white p-6 rounded-lg shadow-md">
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