import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@clerk/clerk-react';
import { Search, Edit } from 'lucide-react';
import API_BASE_URL from '../api/config';

const UserTable = ({ users, onEditUser }) => {
    if (!users || users.length === 0) {
        return <p className="text-center text-gray-500 py-10">No se encontraron usuarios con los filtros actuales.</p>;
    }

    return (
        <div>
            {/* --- Vista de Tabla para Escritorio (Visible en 'md' y superior) --- */}
            <div className="hidden md:block overflow-x-auto">
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
                                <td className="px-4 py-3 whitespace-nowrap">
                                    <span className={`px-2 py-1 text-xs font-bold rounded-full ${
                                        user.rol === 'ADMIN' ? 'bg-red-100 text-red-800' : 
                                        user.rol === 'LOCAL' ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800'
                                    }`}>
                                        {user.rol || 'Incompleto'}
                                    </span>
                                </td>
                                <td className="px-4 py-3 whitespace-nowrap">
                                    <span className={`font-medium ${user.activo ? 'text-green-600' : 'text-red-600'}`}>
                                        {user.activo ? 'Activo' : 'Suspendido'}
                                    </span>
                                </td>
                                <td className="px-4 py-3 whitespace-nowrap">
                                    <button onClick={() => onEditUser(user)} className="text-primary hover:text-brandPrimaryDarker font-medium flex items-center gap-1">
                                        <Edit size={14} /> Editar
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* --- Vista de Tarjetas para Móvil (Oculto en 'md' y superior) --- */}
            <div className="md:hidden space-y-4">
                {users.map(user => (
                    <div key={user._id} className="bg-white p-4 rounded-lg shadow border border-gray-200">
                        <div className="flex justify-between items-start">
                            <div>
                                <p className="font-bold text-base text-gray-800">{user.nombre || '-'}</p>
                                <p className="text-xs text-gray-500">{user.email}</p>
                            </div>
                            <button onClick={() => onEditUser(user)} className="text-primary hover:text-brandPrimaryDarker font-medium flex items-center gap-1 text-sm">
                                <Edit size={14} /> Editar
                            </button>
                        </div>
                        <div className="border-t my-3"></div>
                        <div className="flex justify-between items-center text-xs">
                            <div>
                                <span className="font-semibold text-gray-600">Rol: </span>
                                <span className={`px-2 py-1 font-bold rounded-full ${
                                    user.rol === 'ADMIN' ? 'bg-red-100 text-red-800' : 
                                    user.rol === 'LOCAL' ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800'
                                }`}>
                                    {user.rol || 'Incompleto'}
                                </span>
                            </div>
                            <div>
                                <span className="font-semibold text-gray-600">Estado: </span>
                                <span className={`font-medium ${user.activo ? 'text-green-600' : 'text-red-600'}`}>
                                    {user.activo ? 'Activo' : 'Suspendido'}
                                </span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};



const Pagination = ({ currentPage, totalPages, onPageChange }) => {
    if (totalPages <= 1) return null;
    const pages = Array.from({ length: totalPages }, (_, i) => i + 1);
    
    return (
        <div className="flex justify-center items-center gap-2 mt-6 text-sm">
            <button onClick={() => onPageChange(currentPage - 1)} disabled={currentPage === 1} className="px-3 py-1 rounded-md bg-gray-100 disabled:opacity-50 hover:bg-gray-200">
                Anterior
            </button>
            {pages.map(page => (
                <button 
                    key={page}
                    onClick={() => onPageChange(page)}
                    className={`w-8 h-8 rounded-md ${currentPage === page ? 'bg-primary text-white font-bold' : 'bg-gray-100 hover:bg-gray-200'}`}
                >
                    {page}
                </button>
            ))}
            <button onClick={() => onPageChange(currentPage + 1)} disabled={currentPage === totalPages} className="px-3 py-1 rounded-md bg-gray-100 disabled:opacity-50 hover:bg-gray-200">
                Siguiente
            </button>
        </div>
    );
};

// --- Componente Principal de la Página ---
const AdminDashboardPage = () => {
    const { getToken } = useAuth();
    
    // Estados para los datos de la tabla y la UI
    const [users, setUsers] = useState([]);
    const [pagination, setPagination] = useState({ currentPage: 1, totalPages: 1, totalUsers: 0 });
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    // Estados para los filtros y la paginación
    const [filters, setFilters] = useState({ rol: '', search: '' });
    const [page, setPage] = useState(1);

    // useCallback optimiza la función para que no se recree en cada render
    const fetchUsers = useCallback(async (currentPage, currentFilters) => {
        setIsLoading(true);
        setError(null);
        try {
            const token = await getToken();
            const params = new URLSearchParams({
                page: currentPage,
                limit: 10,
                ...currentFilters
            });
            
            const response = await fetch(`${API_BASE_URL}/api/usuario?${params.toString()}`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });

            if (!response.ok) {
                const errData = await response.json();
                throw new Error(errData.message || 'Error al cargar los usuarios.');
            }
            const data = await response.json();
            setUsers(data.users);
            setPagination({ currentPage: data.currentPage, totalPages: data.totalPages, totalUsers: data.totalUsers });
        } catch (err) {
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    }, [getToken]);

    // useEffect para llamar a fetchUsers cuando cambie la página o los filtros
    useEffect(() => {
        // Usamos un timeout para no hacer una llamada a la API en cada tecla presionada en la búsqueda
        const debounceTimer = setTimeout(() => {
            fetchUsers(page, filters);
        }, 300); // Espera 300ms después de que el usuario deja de escribir

        return () => clearTimeout(debounceTimer); // Limpia el timeout si el componente se desmonta
    }, [page, filters, fetchUsers]);

    const handleFilterChange = (e) => {
        const { name, value } = e.target;
        setPage(1); // Resetea a la página 1 cada vez que un filtro cambia
        setFilters(prev => ({ ...prev, [name]: value }));
    };

    return (
        <div className="container mx-auto py-10">
            <h1 className="text-4xl font-bold mb-8">Panel de Administrador</h1>
            
            <div className="bg-white p-6 rounded-lg shadow-md">
                <h2 className="text-2xl font-semibold mb-4">Gestión de Usuarios ({pagination.totalUsers})</h2>
                
                <div className="flex flex-col sm:flex-row gap-4 mb-4">
                    <div className="relative flex-1">
                        <input 
                            type="text"
                            name="search"
                            placeholder="Buscar por nombre o email..."
                            value={filters.search}
                            onChange={handleFilterChange}
                            className="w-full pl-10 pr-4 py-2 border rounded-md focus:ring-primary focus:border-primary"
                        />
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20}/>
                    </div>
                    <select name="rol" value={filters.rol} onChange={handleFilterChange} className="border rounded-md px-4 py-2 bg-white focus:ring-primary focus:border-primary">
                        <option value="">Todos los Roles</option>
                        <option value="ADMIN">Administrador</option>
                        <option value="LOCAL">Local</option>
                        <option value="GENERAL">General</option>
                    </select>
                </div>

                {isLoading 
                    ? <p className="text-center py-10">Cargando usuarios...</p>
                    : error 
                        ? <p className="text-center py-10 text-red-500"><strong>Error:</strong> {error}</p>
                        : <UserTable users={users} onEditUser={(user) => console.log("Abrir modal para editar:", user)} />
                }
                
                {!isLoading && !error && (
                    <Pagination currentPage={page} totalPages={pagination.totalPages} onPageChange={setPage} />
                )}
            </div>
        </div>
    );
};

export default AdminDashboardPage;