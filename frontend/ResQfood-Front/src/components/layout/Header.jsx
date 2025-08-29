import React, { useState, useEffect, useRef, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { SignedIn, SignedOut, UserButton, useAuth } from '@clerk/clerk-react';
import { Menu as MenuIcon, Search as SearchIcon, MoreVertical } from 'lucide-react';
import logoResQFood from '../../assets/Logo-ResQfood.png';
import { ProfileStatusContext } from '../../context/ProfileStatusContext';
import { LocationModalWorkflow } from '../map/Location';
import API_BASE_URL from '../../api/config';

const Header = () => {
  const navigate = useNavigate();
  const { getToken } = useAuth();
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const menuRef = useRef(null);

  const { 
    isLoadingUserProfile, 
    isComplete, 
    currentUserRole, 
    activeSearchLocation,
    setActiveSearchLocation,
    searchQuery,
    setSearchQuery,
    notifications,
    markDonationNotificationsAsRead,
    markRequestNotificationsAsRead,  
    setNotifications,
    unreadCount,
    hasNewDonationNotifications,
    hasNewRequestNotifications
  } = useContext(ProfileStatusContext) || {};

  const profilePath = "/mi-perfil";
  const misDonacionesPath = "/mis-donaciones";
  const misSolicitudesPath = "/mis-solicitudes"; 
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
        const token = await getToken();
        const response = await fetch(`${API_BASE_URL}/api/notificacion/marcar-como-leidas`, {
            method: 'PATCH',
            headers: { 'Authorization': `Bearer ${token}` }
        });
        
        // Solo si el backend confirma que las marcó como leídas,
        // actualizamos el estado en el frontend.
        if (response.ok) {
            setNotifications(prevNotifications => 
                prevNotifications.map(notif => ({ ...notif, leida: true }))
            );
        } else {
            // Opcional: mostrar un toast de error si falla
            console.error("El servidor no pudo marcar las notificaciones como leídas.");
        }
    } catch (error) {
        console.error("Error de red al marcar notificaciones como leídas:", error);
    }
  };

  return (
    <header className="bg-white shadow-md sticky top-0 z-50">
      <div className="container mx-auto px-2 sm:px-4 lg:px-8">
        <div className="flex items-center justify-between h-20 lg:h-24">

          <div className="flex items-center space-x-2 sm:space-x-4">
            <Link to="/" className="flex-shrink-0 flex items-center">
              <img src={logoResQFood} alt="ResQFood Logo" className="h-14 sm:h-16 md:h-20 lg:w-[120px] lg:h-auto" />
            </Link>
            <div className="hidden md:flex"><LocationModalWorkflow onLocationSelected={handleLocationSelected} currentDisplayAddress={displayLocationText}/></div>
            <div className="flex md:hidden"><LocationModalWorkflow onLocationSelected={handleLocationSelected} currentDisplayAddress={displayLocationTextShort}/></div>
          </div>
          
          <div className="hidden lg:flex flex-1 justify-center items-center px-4">
            <div className="w-full max-w-lg xl:max-w-xl">
              <div className="relative flex items-center bg-gray-100 rounded-full shadow-sm h-10">
                <div className="pl-4 pr-2"><MenuIcon size={20} className="text-gray-500"/></div>
                <input type="text" placeholder="Buscar alguna donacion" className="w-full h-full bg-transparent text-sm focus:outline-none px-2" value={searchQuery || ''} onChange={(e)=>setSearchQuery(e.target.value)}/>
                <div className="pr-4 pl-2"><SearchIcon size={18} className="text-gray-500"/></div>
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-1 sm:space-x-1.5 md:space-x-2">
            <Link to="/sobreNosotros" className="hidden lg:block text-sm text-gray-700 hover:text-primary-600 px-3 py-2">Sobre Nosotros</Link>
            <button className="lg:hidden p-2 rounded-full text-gray-700 hover:bg-gray-100"><SearchIcon size={20} /></button>
            <SignedOut>
              <button onClick={() => navigate('/sign-in')} className={`${authButtonBaseClasses} text-primary border border-primary hover:bg-primary/10`}>Sign in</button>
              <button onClick={() => navigate('/sign-up')} className={`${authButtonBaseClasses} bg-primary text-white hover:bg-brandPrimaryDarker`}>Register</button>
            </SignedOut>

            <SignedIn>
              <div className="relative flex items-center" ref={menuRef}>
                <UserButton afterSignOutUrl="/" />
                {!isLoadingUserProfile && isComplete && (
                  <button
                     onClick={() => {
                        toggleProfileMenu();
                    }}
                    className="relative p-2 ml-1 sm:ml-2 rounded-full text-gray-700 hover:bg-gray-100"
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

                {isProfileMenuOpen && !isLoadingUserProfile && isComplete && (
                  <div className="absolute top-full right-0 mt-2 w-48 bg-white rounded-md shadow-lg overflow-hidden ring-1 ring-black ring-opacity-5 z-[60]">
                    <div className="py-1">
                      
                      {/* El Panel de Admin se muestra solo para el rol ADMIN */}
                      {currentUserRole === 'ADMIN' && (
                        <>
                          <Link to="/admin" className="block px-4 py-2 text-sm text-red-600 hover:bg-red-50 w-full text-left font-semibold" onClick={toggleProfileMenu}>
                            Panel de Admin
                          </Link>
                          <div className="border-t border-gray-100 my-1"></div>
                        </>
                      )}
                      
                      {/* "Ir a mi perfil" se muestra para TODOS los roles */}
                      <Link to={profilePath} className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left" onClick={toggleProfileMenu}>
                        Ir a mi perfil
                      </Link>
                      
                      {/* "Mis donaciones" se muestra para LOCAL, GENERAL */}
                      {(currentUserRole === 'LOCAL' || currentUserRole === 'GENERAL' ) && (
                        <Link
                          to={misDonacionesPath}
                          className="relative px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left flex justify-between items-center"
                          onClick={() => {
                            toggleProfileMenu(); // Cierra el menú
                            markDonationNotificationsAsRead(); // Marca las notificaciones como leídas
                          }}
                        >

                          <span>Mis donaciones</span>
                          {hasNewDonationNotifications && (
                              <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
                          )}
                        </Link>
                      )}

                      {/* "Mis solicitudes" se muestra solo para GENERAL y ADMIN */}
                      {(currentUserRole === 'GENERAL' ) && (
                        <Link
                          to={misSolicitudesPath}
                          className="relative px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left flex justify-between items-center"
                          onClick={() => {
                            toggleProfileMenu(); // Cierra el menú
                            markRequestNotificationsAsRead(); // Marca las notificaciones como leídas
                          }}
                        >
                          <span>Mis solicitudes</span>
                          {hasNewRequestNotifications && (
                              <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
                          )}
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