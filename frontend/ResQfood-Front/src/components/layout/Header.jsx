// src/components/layout/Header.jsx
import React, { useState, useEffect, useRef, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { SignedIn, SignedOut, UserButton } from '@clerk/clerk-react';
import { MapPin, ChevronDown, Menu as MenuIcon, Search as SearchIcon, MoreVertical } from 'lucide-react';
import logoResQFood from '../../assets/Logo-ResQfood.png';
import { ProfileStatusContext } from '../../context/ProfileStatusContext'; // Ajusta la ruta si es necesario
import { LocationModalWorkflow } from '../map/Location'; // Asegúrate que esta importación sea correcta

const Header = () => {
  const navigate = useNavigate();
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const menuRef = useRef(null);
  const profileCtx = useContext(ProfileStatusContext);

  // --- MANEJO SEGURO DEL CONTEXTO ---
  // Si profileCtx es null o undefined, isLoadingUserProfile será true por defecto.
  // Si profileCtx existe pero isLoadingUserProfile es undefined, también será true.
  const isLoadingUserProfile = profileCtx?.isLoadingUserProfile ?? true;
  // Si profileCtx es null o undefined, isProfileComplete será false por defecto.
  // Si profileCtx existe pero isProfileComplete es undefined, también será false.
  const isProfileComplete = profileCtx?.isProfileComplete ?? false;
  // --- FIN MANEJO SEGURO ---

  const authButtonBaseClasses = "text-xs sm:text-sm font-medium py-1.5 px-2 sm:px-3 rounded-md transition-colors duration-150 ease-in-out whitespace-nowrap";

  const toggleProfileMenu = () => {
    setIsProfileMenuOpen(prev => !prev);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsProfileMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);
  
  const profilePath = "/perfil"; // Asumiendo que tienes una ruta /perfil para UserProfilePage

  return (
    <header className="bg-white shadow-md sticky top-0 z-50">
      <div className="container mx-auto px-2 sm:px-4 lg:px-8">
        <div className="flex items-center justify-between h-20 lg:h-24"> {/* Altura del Navbar */}
          
          {/* Izquierda: Logo y Ubicación */}
          <div className="flex items-center space-x-2 sm:space-x-4">
            <Link to="/" className="flex-shrink-0 flex items-center">
              <img 
                src={logoResQFood} 
                alt="ResQFood Logo" 
                className="h-14 sm:h-16 md:h-20 lg:w-[120px] lg:h-auto" // Ajustaste esto y te gusta
              />
            </Link>
            {/* Componente de Ubicación */}
            <div className="hidden sm:flex"> {/* Ejemplo: Oculto en xs, visible desde sm */}
              <LocationModalWorkflow /> 
            </div>
          </div>

          {/* Centro: Barra de Búsqueda (Visible desde LG) */}
          <div className="hidden lg:flex flex-1 justify-center items-center px-4">
            <div className="w-full max-w-lg xl:max-w-xl">
              <div className="relative flex items-center bg-searchBg rounded-full shadow-sm h-10">
                <div className="pl-4 pr-2 flex items-center justify-center">
                  <MenuIcon size={20} className="text-textMuted hover:text-textMain cursor-pointer" />
                </div>
                <input
                  type="text"
                  placeholder="Buscar alguna donacion"
                  className="w-full h-full bg-transparent text-sm text-textMain placeholder-textMuted focus:outline-none px-2"
                />
                <div className="pr-4 pl-2 flex items-center justify-center">
                  <SearchIcon size={18} className="text-textMuted hover:text-textMain cursor-pointer" />
                </div>
              </div>
            </div>
          </div>

          {/* Derecha: Enlaces Desktop y Auth */}
          <div className="flex items-center space-x-1 sm:space-x-1.5 md:space-x-2">
            <Link 
              to="/sobreNosotros" // Asegúrate que la ruta sea /sobreNosotros si así está en App.jsx
              className="hidden lg:block text-sm text-textMain hover:text-primary px-3 py-2 transition-colors whitespace-nowrap"
            >
              Sobre Nosotros
            </Link>

            <SignedOut>
              <button onClick={() => navigate('/sign-in')} className={`${authButtonBaseClasses} text-primary border border-primary hover:bg-primary hover:text-white`}>
                Sign in
              </button>
              <button onClick={() => navigate('/sign-up')} className={`${authButtonBaseClasses} bg-primary text-white hover:bg-brandPrimaryDarker`}>
                Register
              </button>
            </SignedOut>

            <SignedIn>
              <div className="relative flex items-center" ref={menuRef}>
                <UserButton afterSignOutUrl="/" />
                
                {/* Solo muestra el botón de menú de perfil si el perfil está cargado Y completo */}
                {!isLoadingUserProfile && isProfileComplete && (
                  <button
                    onClick={toggleProfileMenu}
                    className="p-2 ml-1 sm:ml-2 rounded-full text-textMain hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-300"
                    aria-label="Opciones de perfil"
                    aria-expanded={isProfileMenuOpen}
                    aria-haspopup="true"
                  >
                    <MoreVertical size={22} />
                  </button>
                )}

                {/* El menú desplegable solo se muestra si está abierto Y el perfil está cargado Y completo */}
                {isProfileMenuOpen && !isLoadingUserProfile && isProfileComplete && (
                  <div 
                    className="absolute top-full right-0 mt-2 w-48 bg-white rounded-md shadow-lg overflow-hidden ring-1 ring-black ring-opacity-5 z-[60]" // Aumentado z-index
                    role="menu" 
                    aria-orientation="vertical" 
                    aria-labelledby="options-menu-button"
                  >
                    <div className="py-1">
                      <Link
                        to={profilePath}
                        className="block px-4 py-2 text-sm text-textMain hover:bg-gray-100 hover:text-gray-900 w-full text-left"
                        role="menuitem"
                        onClick={() => setIsProfileMenuOpen(false)} // Cierra el menú al hacer clic
                      >
                        Ir a mi perfil
                      </Link>
                      {/* Puedes añadir más opciones de menú aquí */}
                      {/* <button
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900 w-full text-left"
                        role="menuitem"
                        onClick={() => {
                          // Lógica para otra acción
                          setIsProfileMenuOpen(false);
                        }}
                      >
                        Otra Opción
                      </button> */}
                    </div>
                  </div>
                )}
              </div>
            </SignedIn>
          </div>

          {/* Botón Hamburguesa para móvil (si decides implementarlo para otros elementos) */}
          {/* Este es un placeholder, la lógica de menú móvil completa requiere más estado */}
          {/* <div className="md:hidden flex items-center ml-2">
            <button className="p-2 rounded-md text-textMuted hover:text-primary focus:outline-none">
              <MenuIcon size={24} />
            </button>
          </div> */}

        </div>
      </div>
    </header>
  );
};

export default Header;