import React, { useState, useEffect } from 'react';
import { useAuth } from '@clerk/clerk-react';
import API_BASE_URL from '../api/config';

// Componente para la tabla de usuarios (lo añadimos aquí mismo por simplicidad)
const UserTable = ({ users }) => (
  <div className="overflow-x-auto">
    <table className="min-w-full bg-white text-sm">
      <thead className="bg-gray-100">
        <tr>
          <th className="text-left font-semibold px-4 py-2">Nombre</th>
          <th className="text-left font-semibold px-4 py-2">Email</th>
          <th className="text-left font-semibold px-4 py-2">Rol</th>
          <th className="text-left font-semibold px-4 py-2">Estado</th>
          <th className="text-left font-semibold px-4 py-2">Acciones</th>
        </tr>
      </thead>
      <tbody>
        {users.map(user => (
          <tr key={user._id} className="border-b hover:bg-gray-50">
            <td className="px-4 py-2">{user.nombre || '-'}</td>
            <td className="px-4 py-2">{user.email}</td>
            <td className="px-4 py-2">
              <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                user.rol === 'ADMIN' ? 'bg-red-100 text-red-700' : 
                user.rol === 'LOCAL' ? 'bg-blue-100 text-blue-700' : 'bg-green-100 text-green-700'
              }`}>
                {user.rol || 'Incompleto'}
              </span>
            </td>
            <td className="px-4 py-2">
              <span className={user.activo ? 'text-green-600' : 'text-red-600'}>
                {user.activo ? 'Activo' : 'Suspendido'}
              </span>
            </td>
            <td className="px-4 py-2">
              <button className="text-blue-500 hover:underline">Editar</button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

const AdminDashboardPage = () => {
  const { getToken } = useAuth();
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUsers = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const token = await getToken();
        // Llamamos al nuevo endpoint GET /api/usuario
        const response = await fetch(`${API_BASE_URL}/api/usuario`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (!response.ok) {
          const errData = await response.json();
          throw new Error(errData.message || 'Error al cargar los usuarios.');
        }
        const data = await response.json();
        setUsers(data.users);
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };
    fetchUsers();
  }, [getToken]);

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-4xl font-bold mb-8">Panel de Administrador</h1>
      
      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-2xl font-semibold mb-4">Gestión de Usuarios ({users.length})</h2>
        
        {isLoading && <p className="text-center py-4">Cargando usuarios...</p>}
        {error && <p className="text-center py-4 text-red-500"><strong>Error:</strong> {error}</p>}
        
        {!isLoading && !error && <UserTable users={users} />}
      </div>
    </div>
  );
};

export default AdminDashboardPage;