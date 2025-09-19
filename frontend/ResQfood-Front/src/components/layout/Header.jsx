import React, { useState, useEffect, useRef, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { SignedIn, SignedOut, UserButton, useAuth } from '@clerk/clerk-react';
import { Menu as MenuIcon, Search as SearchIcon, MoreVertical } from 'lucide-react';
import logoResQFood from '../../assets/Logo-ResQfood.png';
import { ProfileStatusContext } from '../../context/ProfileStatusContext';
import { LocationModalWorkflow } from '../map/Location';
import API_BASE_URL from '../../api/config';
import FilterModal from '../modals/FilterModal';

const Header = () => {
  const { getToken } = useAuth(); 
  const navigate = useNavigate();
  const menuRef = useRef(null);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);

  const { 
    isLoadingUserProfile, 
    isComplete, 
    currentUserRole, 
    activeSearchLocation,
    setActiveSearchLocation,
    filters,
    updateFilters,
    resetFilters,
    isFilterModalOpen, 
    toggleFilterModal,  
    setNotifications,
    hasUrgentNotifications, 
    hasNewDonationNotifications,
    hasNewRequestNotifications,
  } = useContext(ProfileStatusContext) || {};

  const profilePath = "/mi-perfil";
  const misDonacionesPath = "/mis-donaciones";
  const misSolicitudesPath = "/mis-solicitudes"; 
  const authButtonBaseClasses = "text-xs sm:text-sm font-medium py-1.5 px-2 sm:px-3 rounded-md transition-colors duration-150 ease-in-out whitespace-nowrap";
  
  const toggleProfileMenu = () => setIsProfileMenuOpen(prev => !prev);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsProfileMenuOpen(false);
      }
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

  const markAsRead = async (type) => {
    if (!getToken) return;
    const typesToUpdate = type === 'donations'
      ? ['SOLICITUD', 'HORARIO_CONFIRMADO', 'HORARIO_RECHAZADO', 'GENERAL']
      : ['APROBACION', 'RECHAZO', 'ENTREGA'];
    if (setNotifications) {
        setNotifications(prev => prev.map(n => typesToUpdate.includes(n.tipoNotificacion) ? { ...n, leida: true } : n));
    }
    try {
        const endpoint = type === 'donations' ? 'marcar-donaciones-leidas' : 'marcar-solicitudes-leidas';
        const token = await getToken();
        if (!token) return;
        await fetch(`${API_BASE_URL}/api/notificacion/${endpoint}`, { method: 'PATCH', headers: { 'Authorization': `Bearer ${token}` } });
    } catch (error) {
        console.error(`Fallo al sincronizar notificaciones de '${type}' como leídas:`, error);
    }
  };

  return (
    <>
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
                  <button onClick={() => toggleFilterModal && toggleFilterModal(true)} className="pl-4 pr-2 text-gray-500 hover:text-primary">
                    <MenuIcon size={20} />
                  </button>
                  <input 
                    type="text" 
                    placeholder="Buscar alguna donacion" 
                    className="w-full h-full bg-transparent text-sm focus:outline-none px-2" 
                    value={filters?.searchTerm || ''}
                    onChange={(e) => updateFilters && updateFilters({ searchTerm: e.target.value })}
                  />
                  <div className="pr-4 pl-2"><SearchIcon size={18} className="text-gray-500"/></div>
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-1 sm:space-x-1.5 md:space-x-2">
              <Link to="/sobreNosotros" className="hidden lg:block text-sm text-gray-700 hover:text-primary-600 px-3 py-2">Sobre Nosotros</Link>
              
              <button className="lg:hidden p-2 rounded-full text-gray-700 hover:bg-gray-100" onClick={() => toggleFilterModal && toggleFilterModal(true)}>
                <SearchIcon size={20} />
              </button>
              <SignedOut>
                <button onClick={() => navigate('/sign-in')} className={`${authButtonBaseClasses} text-primary border border-primary hover:bg-primary/10`}>Sign in</button>
                <button onClick={() => navigate('/sign-up')} className={`${authButtonBaseClasses} bg-primary text-white hover:bg-brandPrimaryDarker`}>Register</button>
              </SignedOut>

              <SignedIn>
                <div className="relative flex items-center" ref={menuRef}>
                  <UserButton afterSignOutUrl="/" />
                  {!isLoadingUserProfile && isComplete && (
                    <button
                       onClick={toggleProfileMenu}
                       className="relative p-2 ml-1 sm:ml-2 rounded-full text-gray-700 hover:bg-gray-100"
                       aria-label="Opciones de perfil"
                    >
                      <MoreVertical size={22} />
                      {hasUrgentNotifications && (
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
                        
                        {(currentUserRole === 'LOCAL' || currentUserRole === 'GENERAL' || currentUserRole === 'ADMIN') && (
                          <Link
                            to={misDonacionesPath}
                            className="relative px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left flex justify-between items-center"
                            onClick={() => {
                              markAsRead('donations');
                              toggleProfileMenu();
                            }}
                          >
                            <span>Mis donaciones</span>
                            {hasNewDonationNotifications && (
                                <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
                            )}
                          </Link>
                        )}

                        {(currentUserRole === 'GENERAL' || currentUserRole === 'ADMIN') && (
                          <Link
                            to={misSolicitudesPath}
                            className="relative px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left flex justify-between items-center"
                            onClick={() => {
                              markAsRead('requests');
                              toggleProfileMenu();
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
      
     
      {toggleFilterModal && (
        <FilterModal
            isOpen={isFilterModalOpen}
            onClose={() => toggleFilterModal(false)}
            currentFilters={filters}
            onFiltersChange={updateFilters}
            onResetFilters={resetFilters}
        />
      )}
    </>
  );
};

export default Header;