import React, { useContext } from 'react';
import { NavLink } from 'react-router-dom';
import { Home, User, Search, PlusCircle } from 'lucide-react';
import { ProfileStatusContext } from '../../context/ProfileStatusContext'; 

const navItems = [
  { name: 'Inicio', href: '/dashboard', icon: Home, exact: true }, 
  { name: 'Usuario', href: '/mi-perfil', icon: User },
  { name: 'Publicar', href: '/publicar-donacion', icon: PlusCircle },
];

const BottomNavigationBar = () => {
  const { toggleFilterModal } = useContext(ProfileStatusContext) || {};

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-top-md z-40">
      <div className="container mx-auto flex justify-around items-center h-16 px-2">
        {navItems.map((item) => (
          <NavLink
            key={item.name}
            to={item.href}
            className={({ isActive }) => 
              `flex flex-col items-center justify-center space-y-1 px-2 py-1 rounded-md transition-colors duration-150 ease-in-out w-1/4
               ${isActive ? 'text-primary font-semibold' : 'text-textMuted hover:text-primary hover:bg-gray-50'}`
            }
            end={item.exact || false}
          >
            <item.icon size={24} /> 
            <span className="text-xs">{item.name}</span>
          </NavLink>
        ))}
        <button
          onClick={() => toggleFilterModal && toggleFilterModal(true)}
          className="flex flex-col items-center justify-center space-y-1 px-2 py-1 rounded-md text-textMuted hover:text-primary hover:bg-gray-50 w-1/4"
        >
            <Search size={24} />
            <span className="text-xs">Buscar</span>
        </button>
      </div>
    </nav>
  );
};

export default BottomNavigationBar;
