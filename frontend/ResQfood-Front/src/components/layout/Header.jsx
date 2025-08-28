import React, { useState, useEffect, useRef, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { SignedIn, SignedOut, UserButton, useAuth } from '@clerk/clerk-react';
import { MoreVertical, Search as SearchIcon, Menu as MenuIcon } from 'lucide-react';
import logoResQFood from '../../assets/Logo-ResQfood.png';
import { ProfileStatusContext } from '../../context/ProfileStatusContext';
import { LocationModalWorkflow } from '../map/Location';
import API_BASE_URL from '../../api/config';

const Header = () => {
  const navigate = useNavigate();
  const { getToken } = useAuth();
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const menuRef = useRef(null);

  // --- OBTENEMOS TODO DEL CONTEXTO ---
  const { 
    isLoadingUserProfile, 
    isComplete, 
    currentUserRole, 
    activeSearchLocation,
    setActiveSearchLocation,
    searchQuery,
    setSearchQuery,
    // --- CAMBIO IMPORTANTE: NECESITAMOS LA LISTA COMPLETA DE NOTIFICACIONES ---
    notifications, // Asumimos que el contexto ahora provee esto
    setNotifications,
    setUnreadCount 
  } = useContext(ProfileStatusContext) || {};

  // --- NUEVA LÓGICA DE NOTIFICACIÓN ESPECÍFICA ---
  // Calculamos qué tipo de notificaciones nuevas hay revisando el campo 'enlace'
  const hasNewDonationNotifications = notifications?.some(n => !n.leida && n.enlace === '/mis-donaciones');
  const hasNewRequestNotifications = notifications?.some(n => !n.leida && n.enlace === '/mis-solicitudes');
  const unreadCount = notifications?.filter(n => !n.leida).length || 0;


  const profilePath = "/mi-perfil";
  const misDonacionesPath = "/mis-donaciones";
  const misSolicitudesPath = "/mis-solicitudes"; // Nueva ruta
  const authButtonBaseClasses = "text-xs sm:text-sm font-medium py-1.5 px-2 sm:px-3 rounded-md transition-colors duration-150 ease-in-out whitespace-nowrap";
  
  const toggleProfileMenu = () => setIsProfileMenuOpen(prev => !prev);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) setIsProfileMenuOpen(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);
  
  const handleLocationSelected = (locationData) => {
    if (setActiveSearchLocation && locationData) {
      setActiveSearchLocation(locationData);
    }
  };

  // --- LÓGICA DE UBICACIÓN (SIN CAMBIOS) ---
  let displayLocationText = "Ingresa tu ubicación";
  let displayLocationTextShort = "Ubicación";

  if (activeSearchLocation?.address) {
    displayLocationText = activeSearchLocation.address;
    displayLocationTextShort = activeSearchLocation.address.split(',')[0] || "Ubicación";
  } else if (activeSearchLocation?.lat) {
    const latLngText = `Lat: ${activeSearchLocation.lat.toFixed(2)}, Lng: ${activeSearchLocation.lng.toFixed(2)}`;
    displayLocationText = latLngText;
    displayLocationTextShort = latLngText;
  }

  const handleMarkAsRead = async () => {
    if (unreadCount === 0) return;
    try {
        // Actualización optimista en el frontend
        setUnreadCount(0);
        setNotifications(prev => prev.map(notif => ({ ...notif, leida: true })));
        
        // Llamada a la API
        const token = await getToken();
        await fetch(`${API_BASE_URL}/api/notificacion/marcar-como-leidas`, {
            method: 'PATCH',
            headers: { 'Authorization': `Bearer ${token}` }
        });
    } catch (error) {
        console.error("Error al marcar notificaciones como leídas:", error);
    }
  };

  return (
    <header className="bg-white shadow-md sticky top-0 z-50">
      <div className="container mx-auto px-2 sm:px-4 lg:px-8">
        <div className="flex items-center justify-between h-20 lg:h-24">
          
          {/* --- SECCIÓN IZQUIERDA (SIN CAMBIOS) --- */}
          <div className="flex items-center space-x-2 sm:space-x-4">
            <Link to="/" className="flex-shrink-0 flex items-center">
              <img src={logoResQFood} alt="ResQFood Logo" className="h-14 sm:h-16 md:h-20 lg:w-[120px] lg:h-auto" />
            </Link>
            <div className="hidden md:flex">
              <LocationModalWorkflow onLocationSelected={handleLocationSelected} currentDisplayAddress={displayLocationText} /> 
            </div>
            <div className="flex md:hidden">
              <LocationModalWorkflow onLocationSelected={handleLocationSelected} currentDisplayAddress={displayLocationTextShort} /> 
            </div>
          </div>
          
          {/* --- BÚSQUEDA CENTRAL (SIN CAMBIOS) --- */}
          <div className="hidden lg:flex flex-1 justify-center items-center px-4">{/* ... */}</div>

          {/* --- SECCIÓN DERECHA --- */}
          <div className="flex items-center space-x-1 sm:space-x-1.5 md:space-x-2">
            <Link to="/sobreNosotros" className="hidden lg:block text-sm text-gray-700 hover:text-primary-600 px-3 py-2 transition-colors whitespace-nowrap">
              Sobre Nosotros
            </Link>
            <button className="lg:hidden p-2 rounded-full text-gray-700 hover:bg-gray-100">
                <SearchIcon size={20} />
            </button>

            <SignedOut>{/* ... (SIN CAMBIOS) */}</SignedOut>

            <SignedIn>
              <div className="relative flex items-center" ref={menuRef}>
                <UserButton afterSignOutUrl="/" />
                {!isLoadingUserProfile && isComplete && (
                  <button
                    onClick={() => {
                      toggleProfileMenu();
                      handleMarkAsRead(); // Marcar como leídas al abrir el menú
                    }}
                    className="relative p-2 ml-1 sm:ml-2 rounded-full text-gray-700 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-300"
                    aria-label="Opciones de perfil"
                  >
                    <MoreVertical size={22} />
                    {unreadCount > 0 && (
                        <span className="absolute top-1.5 right-1.5 flex h-3 w-3">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
                        </span>
                    )}
                  </button>
                )}
                
                {/* --- EL NUEVO MENÚ INTELIGENTE --- */}
                {isProfileMenuOpen && !isLoadingUserProfile && isComplete && (
                  <div className="absolute top-full right-0 mt-2 w-52 bg-white rounded-md shadow-lg overflow-hidden ring-1 ring-black ring-opacity-5 z-[60]">
                    <div className="py-1">
                      {currentUserRole === 'ADMIN' && (
                        <>
                          <Link to="/admin" className="block px-4 py-2 text-sm text-red-600 hover:bg-red-50 w-full text-left font-semibold" onClick={toggleProfileMenu}>
                            Panel de Admin
                          </Link>
                          <div className="border-t border-gray-100 my-1"></div>
                        </>
                      )}
                      
                      <Link to={profilePath} className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left" onClick={toggleProfileMenu}>
                        Ir a mi perfil
                      </Link>

                      {/* ENLACE CONDICIONAL PARA DONANTES (LOCAL y ADMIN) */}
                      {(currentUserRole === 'LOCAL' || currentUserRole === 'ADMIN') && (
                        <Link to={misDonacionesPath} className="relative px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left flex justify-between items-center" onClick={toggleProfileMenu}>
                          <span>Mis donaciones</span>
                          {hasNewDonationNotifications && <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>}
                        </Link>
                      )}

                      {/* ¡EL ENLACE QUE FALTABA! CONDICIONAL PARA RECEPTORES (GENERAL) */}
                      {currentUserRole === 'GENERAL' && (
                         <Link to={misSolicitudesPath} className="relative px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left flex justify-between items-center" onClick={toggleProfileMenu}>
                          <span>Mis solicitudes</span>
                          {hasNewRequestNotifications && <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>}
                        </Link>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </SignedIn>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;