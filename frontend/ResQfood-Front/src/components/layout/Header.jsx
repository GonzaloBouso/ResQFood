// src/components/layout/Header.jsx
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { SignedIn, SignedOut, UserButton } from '@clerk/clerk-react';
import { MapPin, ChevronDown, Menu, Search } from 'lucide-react';

// 1. Importa tu logo
import logoResQFood from '../../assets/Logo-ResQfood.png'; // Ajusta la ruta si es diferente

const Header = () => {
  const navigate = useNavigate();

  return (
    <header className="bg-white shadow-md sticky top-0 z-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Lado Izquierdo: Logo y Ubicación */}
          <div className="flex items-center space-x-8">
            {/* 2. Reemplaza el Link de texto con el logo */}
            <Link to="/" className="flex items-center"> {/* Hacemos el Link un flex container si necesitas alinear algo junto al logo */}
              <img 
                src={logoResQFood} 
                alt="ResQFood Logo" 
                className="h-50 w-auto" // Ajusta la altura (h-10 = 2.5rem = 40px). El ancho será automático.
                                        // Puedes cambiar h-10 a h-12, h-14, etc., según el tamaño deseado.
              />
              {/* Si quieres mantener el texto "ResQFood" al lado del logo, puedes añadirlo aquí: */}
              {/* <span className="ml-2 text-2xl font-bold text-emerald-600">ResQFood</span> */}
            </Link>

            {/* Selector de Ubicación */}
            <div className="flex items-center space-x-1 cursor-pointer text-sm text-gray-700 hover:text-emerald-600">
              <MapPin size={18} />
              <span>Ingrese su ubicación</span>
              <ChevronDown size={18} />
            </div>
          </div>

          {/* Centro: Barra de Búsqueda */}
          <div className="flex-grow max-w-xl mx-4">
            <div className="relative flex items-center bg-gray-100 hover:bg-gray-200 rounded-full px-4 py-2">
              <Menu size={20} className="text-gray-500 mr-2" />
              <input
                type="text"
                placeholder="Buscar alguna donacion"
                className="w-full bg-transparent text-sm text-gray-700 placeholder-gray-500 focus:outline-none"
              />
              <Search size={20} className="text-gray-500 ml-2" />
            </div>
          </div>

          {/* Lado Derecho: Enlaces y Autenticación */}
          <div className="flex items-center space-x-4">
            <Link to="/about" className="text-sm text-gray-700 hover:text-emerald-600 px-3 py-2">
              Sobre Nosotros
            </Link>

            <SignedOut>
              <button
                onClick={() => navigate('/sign-in')}
                className="text-sm text-gray-700 border border-gray-300 hover:border-gray-400 rounded-md px-4 py-2 transition-colors"
              >
                Sign in
              </button>
              <button
                onClick={() => navigate('/sign-up')}
                className="text-sm bg-gray-800 hover:bg-gray-700 text-white font-medium py-2 px-4 rounded-md transition-colors"
              >
                Register
              </button>
            </SignedOut>

            <SignedIn>
              <div className="ml-2">
                <UserButton afterSignOutUrl="/" />
              </div>
            </SignedIn>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;