import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@clerk/clerk-react';
import { Search, Edit, ShieldAlert, Users, BookText } from 'lucide-react'; 
import API_BASE_URL from '../api/config';
import ManageUserModal from '../components/modals/ManageUserModal';
import TablaReportes from '../components/admin/TablaReportes'; 
import BitacoraTable from '../components/admin/BitacoraTable'; 
import toast from 'react-hot-toast';


const UserTable = ({ users, onEditUser }) => {
    if (!users || users.length === 0) {
        return <p className="text-center text-gray-500 py-10">No se encontraron usuarios con los filtros actuales.</p>;
    }
    
    return (
        <div className="overflow-x-auto">
            <table className="min-w-full bg-white text-sm">
                <thead className="bg-gray-50">
                    <tr>
                        <th className="text-left font-semibold px-4 py-3 text-gray-600">Nombre</th>
                        <th className="text-left font-semibold px-4 py-3 text-gray-600">Email</th>
                        <th className="text-left font-semibold px-4 py-3 text-gray-600">Rol</th>
                        <th className="text-left font-semibold px-4 py-3 text-gray-600">Estado</th>
                        <th className="text-left font-semibold px-4 py-3 text-gray-600">Acciones</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                    {users.map(user => (
                        <tr key={user._id} className="hover:bg-gray-50">
                            <td className="px-4 py-3 whitespace-nowrap">{user.nombre || '-'}</td>
                            <td className="px-4 py-3 whitespace-nowrap">{user.email}</td>
                            <td className="px-4 py-3 whitespace-nowrap"><span className={`px-2 py-1 text-xs font-bold rounded-full ${user.rol === 'ADMIN' ? 'bg-red-100 text-red-800' : user.rol === 'LOCAL' ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800'}`}>{user.rol || 'Incompleto'}</span></td>
                            <td className="px-4 py-3 whitespace-nowrap"><span className={`font-medium ${user.activo ? 'text-green-600' : 'text-red-600'}`}>{user.activo ? 'Activo' : 'Suspendido'}</span></td>
                            <td className="px-4 py-3 whitespace-nowrap"><button onClick={() => onEditUser(user)} className="text-primary hover:text-brandPrimaryDarker font-medium flex items-center gap-1"><Edit size={14} /> Editar</button></td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};


const Pagination = ({ currentPage, totalPages, onPageChange }) => {
    if (totalPages <= 1) return null;
    const pages = Array.from({ length: totalPages }, (_, i) => i + 1);
    return (
        <div className="flex justify-center items-center gap-2 mt-6 text-sm">
            <button onClick={() => onPageChange(currentPage - 1)} disabled={currentPage === 1} className="px-3 py-1 rounded-md bg-gray-100 disabled:opacity-50 hover:bg-gray-200">Anterior</button>
            {pages.map(page => (
                <button key={page} onClick={() => onPageChange(page)} className={`w-8 h-8 rounded-md ${currentPage === page ? 'bg-primary text-white font-bold' : 'bg-gray-100 hover:bg-gray-200'}`}>{page}</button>
            ))}
            <button onClick={() => onPageChange(currentPage + 1)} disabled={currentPage === totalPages} className="px-3 py-1 rounded-md bg-gray-100 disabled:opacity-50 hover:bg-gray-200">Siguiente</button>
        </div>
    );
};

// --- Componente Principal de la Página ---
const AdminDashboardPage = () => {
    const { getToken } = useAuth();
    
    const [vistaActual, setVistaActual] = useState('usuarios'); 
    const [users, setUsers] = useState([]);
    const [reportes, setReportes] = useState([]);
    const [bitacora, setBitacora] = useState([]); 
    const [pagination, setPagination] = useState({ currentPage: 1, totalPages: 1, totalItems: 0 });
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [editingUser, setEditingUser] = useState(null);
    const [filters, setFilters] = useState({ rol: '', search: '' });
    const [page, setPage] = useState(1);

    const fetchUsers = useCallback(async (currentPage, currentFilters) => {
        setIsLoading(true);
        setError(null);
        try {
            const token = await getToken();
            const params = new URLSearchParams({ page: currentPage, limit: 10, ...currentFilters });
            const response = await fetch(`${API_BASE_URL}/api/usuario?${params.toString()}`, { headers: { 'Authorization': `Bearer ${token}` } });
            if (!response.ok) { const errData = await response.json(); throw new Error(errData.message || 'No se pudieron cargar los usuarios.'); }
            const data = await response.json();
            setUsers(data.users);
            setPagination({ currentPage: data.currentPage, totalPages: data.totalPages, totalItems: data.totalUsers });
        } catch (err) {
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    }, [getToken]);
    
    const fetchReportes = useCallback(async () => {
        setIsLoading(true); 
        setError(null);
        try {
            const token = await getToken();
            const response = await fetch(`${API_BASE_URL}/api/reporte`, { headers: { 'Authorization': `Bearer ${token}` } });
            if (!response.ok) { const errData = await response.json(); throw new Error(errData.message || 'No se pudieron cargar los reportes.'); }
            const data = await response.json();
            setReportes(data.reportes);
        } catch (err) { 
            setError(err.message); 
        } finally { 
            setIsLoading(false); 
        }
    }, [getToken]);

   
    const fetchBitacora = useCallback(async () => {
        setIsLoading(true); 
        setError(null);
        try {
            const token = await getToken();
            const response = await fetch(`${API_BASE_URL}/api/bitacoraAdmin`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (!response.ok) {
                const errData = await response.json();
                throw new Error(errData.message || 'No se pudo cargar la bitácora.');
            }
            const data = await response.json();
            setBitacora(data.bitacora);
        } catch (err) { 
            setError(err.message); 
        } finally { 
            setIsLoading(false); 
        }
    }, [getToken]);

    
    useEffect(() => {
        if (vistaActual === 'usuarios') {
            const debounceTimer = setTimeout(() => { fetchUsers(page, filters); }, 300);
            return () => clearTimeout(debounceTimer);
        } else if (vistaActual === 'reportes') {
            fetchReportes();
        } else if (vistaActual === 'bitacora') {
            fetchBitacora();
        }
    }, [page, filters, vistaActual, fetchUsers, fetchReportes, fetchBitacora]);
    
    const handleFilterChange = (e) => {
        const { name, value } = e.target;
        setPage(1); 
        setFilters(prev => ({ ...prev, [name]: value }));
    };

    const handleViewChange = (view) => {
        setVistaActual(view);
        setError(null);
        setPage(1);
    };
    
    const handleUpdateAndRefresh = () => {
        setEditingUser(null);
        fetchUsers(page, filters);
        
        if (vistaActual === 'bitacora') {
            fetchBitacora();
        }
    };
    
    const handleResolverReporte = async (reporteId) => { toast.error("Función no implementada"); };
    const handleSuspenderUsuario = async (userId, reporteId) => { toast.error("Función no implementada"); };
    const handleEliminarDonacion = async (donacionId, reporteId) => { toast.error("Función no implementada"); };

    return (
        <div className="container mx-auto py-10">
            <h1 className="text-4xl font-bold mb-8">Panel de Administrador</h1>
            
            
            <div className="mb-6 flex border-b">
                <button onClick={() => handleViewChange('usuarios')} className={`px-4 py-2 font-semibold flex items-center gap-2 ${vistaActual === 'usuarios' ? 'border-b-2 border-primary text-primary' : 'text-gray-500'}`}><Users size={18}/> Gestión de Usuarios</button>
                <button onClick={() => handleViewChange('reportes')} className={`px-4 py-2 font-semibold flex items-center gap-2 ${vistaActual === 'reportes' ? 'border-b-2 border-primary text-primary' : 'text-gray-500'}`}>
                    <ShieldAlert size={18}/> Gestión de Reportes {reportes.length > 0 && <span className="bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">{reportes.length}</span>}
                </button>
                <button onClick={() => handleViewChange('bitacora')} className={`px-4 py-2 font-semibold flex items-center gap-2 ${vistaActual === 'bitacora' ? 'border-b-2 border-primary text-primary' : 'text-gray-500'}`}>
                    <BookText size={18}/> Bitácora de Actividad
                </button>
            </div>

            
            {vistaActual === 'usuarios' && (
                <div className="bg-white p-6 rounded-lg shadow-md animate-fade-in-up">
                    <h2 className="text-2xl font-semibold mb-4">Usuarios Registrados ({pagination.totalItems || 0})</h2>
                    <div className="flex flex-col sm:flex-row gap-4 mb-4">
                        <div className="relative flex-1">
                            <input type="text" name="search" placeholder="Buscar por nombre o email..." value={filters.search} onChange={handleFilterChange} className="w-full pl-10 pr-4 py-2 border rounded-md"/>
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20}/>
                        </div>
                        <select name="rol" value={filters.rol} onChange={handleFilterChange} className="border rounded-md px-4 py-2 bg-white">
                             <option value="">Todos los Roles</option>
                             <option value="ADMIN">Admin</option>
                             <option value="LOCAL">Local</option>
                             <option value="GENERAL">General</option>
                        </select>
                    </div>

                    {isLoading ? <p className="text-center py-10">Cargando...</p> 
                               : error ? <p className="text-center py-10 text-red-500">{error}</p> 
                               : <UserTable users={users} onEditUser={setEditingUser} />}
                    {!isLoading && !error && (
                        <Pagination currentPage={page} totalPages={pagination.totalPages} onPageChange={setPage} />
                    )}
                </div>
            )}

          
            {vistaActual === 'reportes' && (
                <div className="bg-white p-6 rounded-lg shadow-md animate-fade-in-up">
                    <h2 className="text-2xl font-semibold mb-4">Reportes Pendientes ({reportes.length})</h2>
                    {isLoading ? <p className="text-center py-10">Cargando...</p> 
                               : error ? <p className="text-center py-10 text-red-500">{error}</p> 
                               : <TablaReportes reportes={reportes} onResolver={handleResolverReporte} onSuspenderUsuario={handleSuspenderUsuario} onEliminarDonacion={handleEliminarDonacion}/>}
                </div>
            )}

          
            {vistaActual === 'bitacora' && (
                 <div className="bg-white p-6 rounded-lg shadow-md animate-fade-in-up">
                    <h2 className="text-2xl font-semibold mb-4">Registro de Actividad de Administradores</h2>
                    {isLoading ? <p className="text-center py-10">Cargando bitácora...</p> 
                               : error ? <p className="text-center py-10 text-red-500">{error}</p> 
                               : <BitacoraTable registros={bitacora} />}
                </div>
            )}

            {editingUser && <ManageUserModal user={editingUser} onClose={() => setEditingUser(null)} onUpdate={handleUpdateAndRefresh}/>}
        </div>
    );
};

export default AdminDashboardPage;