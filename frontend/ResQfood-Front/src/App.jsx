import React, { useState, useEffect, useContext, useMemo, useCallback } from 'react';
import { Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { SignedIn, SignedOut, ClerkLoaded, useAuth } from '@clerk/clerk-react';
import { LoadScript } from '@react-google-maps/api';

// --- Tus componentes y páginas ---
import Header from './components/layout/Header';
import BottomNavigationBar from './components/layout/BottomNavigationBar';
import Footer from './components/layout/Footer';
import HomePageUnregistered from './pages/HomePageUnregistered';
import DashboardPage from './pages/DashboardPage';
import SignInPage from './pages/SignInPage';
import SignUpPage from './pages/SignUpPage';
import CompleteProfilePage from './pages/CompleteProfilePage';
import UserProfilePage from './pages/UserProfilePage';
import MiPerfilPage from './pages/MiPerfilPage';
import NewDonationPage from './pages/NewDonationPage';
import MyDonationsPage from './pages/MyDonationsPage'; 
import PoliticaPrivacidad from './pages/PoliticaPrivacidad';
import FormularioContacto from './pages/FormularioContacto';
import PoliticaUsoDatos from './pages/PoliticaUsoDatos';
import PreguntasFrecuentes from './pages/PreguntasFrecuentes';
import SobreNosotros from './pages/SobreNosotros';
import TerminosCondiciones from './pages/TerminosCondiciones';
import FormularioVoluntario from './pages/FormularioVoluntario';
import AdminDashboardPage from './pages/AdminDashboardPage.jsx';

// --- Hook de Sockets ---
import { useSocket } from './hooks/useSocket'; 

// --- Contexto y Configuración ---
import { ProfileStatusContext } from './context/ProfileStatusContext';
import API_BASE_URL from './api/config.js';

const GOOGLE_MAPS_API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
const libraries = ['places'];

// --- Componente para gestionar la ruta raíz (sin cambios) ---
const RootRedirector = () => {
  const { isSignedIn, isLoaded } = useAuth();
  if (!isLoaded) { return <div className="text-center py-20">Cargando...</div>; }
  if (isSignedIn) { return <Navigate to="/dashboard" replace />; }
  return <HomePageUnregistered />;
};

// --- Hook de estado global (con la lógica de notificaciones correcta) ---
const useGlobalState = () => {
    const { isLoaded: isAuthLoaded, isSignedIn, getToken, userId } = useAuth();
    const [profileStatus, setProfileStatus] = useState({ isLoadingUserProfile: true, isComplete: false, userRole: null, userDataFromDB: null });
    const [activeSearchLocation, setActiveSearchLocation] = useState(null);
    const [donationCreationTimestamp, setDonationCreationTimestamp] = useState(Date.now());
    const [searchQuery, setSearchQuery] = useState('');
    const [notifications, setNotifications] = useState([]);
    const [unreadCount, setUnreadCount] = useState(0);

    useEffect(() => {
        const newCount = notifications.filter(n => !n.leida).length;
        setUnreadCount(newCount);
    }, [notifications]);

    const updateProfileState = (userData) => {
        setProfileStatus({ isLoadingUserProfile: false, isComplete: !!userData?.rol, userRole: userData?.rol || null, userDataFromDB: userData });
    };

    const triggerDonationReFetch = () => {
        setDonationCreationTimestamp(Date.now());
    };
    
    const addNotification = useCallback((newNotification) => {
        setNotifications(prev => [newNotification, ...prev]);
    }, []);

    useEffect(() => {
        if (!isAuthLoaded) return;
        
        const fetchInitialData = async () => {
            if (!isSignedIn) {
                updateProfileState(null);
                setActiveSearchLocation(null);
                setNotifications([]);
                return;
            }
            
            setProfileStatus(prev => ({ ...prev, isLoadingUserProfile: true }));
            try {
                const token = await getToken();
                const [profileRes, notifRes] = await Promise.all([
                    fetch(`${API_BASE_URL}/api/usuario/me`, { headers: { 'Authorization': `Bearer ${token}` } }),
                    fetch(`${API_BASE_URL}/api/notificacion`, { headers: { 'Authorization': `Bearer ${token}` } })
                ]);
                
                if (profileRes.status === 404) {
                    setProfileStatus({ isLoadingUserProfile: false, isComplete: false, userRole: null, userDataFromDB: null });
                } else if (profileRes.ok) {
                    const profileData = await profileRes.json();
                    updateProfileState(profileData.user);
                } else {
                    throw new Error("Error al obtener el perfil");
                }

                if (notifRes.ok) {
                    const notifData = await notifRes.json();
                    setNotifications(notifData.notificaciones || []);
                }

            } catch (error) {
                console.error("Error en fetchInitialData:", error);
                setProfileStatus({ isLoadingUserProfile: false, isComplete: false, userRole: null, userDataFromDB: null });
            }
        };
        fetchInitialData();
    }, [isAuthLoaded, isSignedIn]);

    return { 
        isLoadingUserProfile: profileStatus.isLoadingUserProfile,
        isComplete: profileStatus.isComplete,
        userRole: profileStatus.userRole,
        userDataFromDB: profileStatus.userDataFromDB,
        updateProfileState, 
        currentClerkUserId: userId,
        activeSearchLocation,
        setActiveSearchLocation,
        donationCreationTimestamp,
        triggerDonationReFetch,
        searchQuery,
        setSearchQuery,
        notifications,
        setNotifications,
        unreadCount,
        addNotification,
    };
};

// --- Layout Guardián (la clave de la solución) ---
const ProtectedLayout = ({ adminOnly = false }) => {
    const { isLoadingUserProfile, isComplete, currentUserRole, updateProfileState } = useContext(ProfileStatusContext);

    // Muestra un spinner MIENTRAS se cargan los datos. Esto evita la "race condition".
    if (isLoadingUserProfile) {
        return <div className="flex justify-center items-center h-[calc(100vh-10rem)]"><p>Verificando tu perfil...</p></div>;
    }

    // Una vez cargado, si el perfil no está completo, SIEMPRE muestra esta página.
    if (!isComplete) {
        return <CompleteProfilePage onProfileComplete={updateProfileState} />;
    }
    
    // Si la ruta es solo para admins y el usuario no lo es, redirige.
    if (adminOnly && currentUserRole !== 'ADMIN') {
        return <Navigate to="/dashboard" replace />;
    }

    // Si todas las comprobaciones pasan, renderiza la página solicitada.
    return <Outlet />;
};

const AppContent = () => {
  const appStateHook = useGlobalState();
  
  useSocket(appStateHook.addNotification);

  const contextValueForProvider = useMemo(() => (appStateHook), [appStateHook]);

  const handleDonationCreated = () => {
    appStateHook.triggerDonationReFetch();
  };

  return (
    <ProfileStatusContext.Provider value={contextValueForProvider}>
        <div className="flex flex-col min-h-screen bg-gray-50">
            <Header />
            <main className="flex-grow container mx-auto px-4 sm:px-6 lg:px-8 py-12 pb-24 md:pb-12">
            <ClerkLoaded>
                <Routes>
                    {/* --- Rutas Públicas y de Autenticación --- */}
                    <Route path="/" element={<RootRedirector />} />
                    <Route path="/sign-in/*" element={<SignInPage />} />
                    <Route path="/sign-up/*" element={<SignUpPage />} />
                    
                    {/* --- Grupo de Rutas para USUARIOS NORMALES --- */}
                    {/* Todas las rutas aquí dentro están protegidas por el guardián */}
                    <Route element={<SignedIn><ProtectedLayout /></SignedIn>}>
                        <Route path="/dashboard" element={<DashboardPage />} />
                        <Route path="/publicar-donacion" element={<NewDonationPage onDonationCreated={handleDonationCreated} />} />
                        <Route path="/mis-donaciones" element={<MyDonationsPage />} />
                        <Route path="/mi-perfil" element={<MiPerfilPage />} />
                        <Route path="/perfil/:id" element={<UserProfilePage />} />
                    </Route>
                    
                    {/* --- Grupo de Rutas para ADMINS --- */}
                    <Route element={<SignedIn><ProtectedLayout adminOnly={true} /></SignedIn>}>
                        <Route path="/admin" element={<AdminDashboardPage />} />
                    </Route>

                    {/* --- Rutas Públicas de Contenido Estático --- */}
                    <Route path="/politicaPrivacidad" element={<PoliticaPrivacidad />} />
                    <Route path="/formularioContacto" element={<FormularioContacto />} />
                    <Route path="/politicaUsoDatos" element={<PoliticaUsoDatos />} />
                    <Route path="/preguntasFrecuentes" element={<PreguntasFrecuentes />} />
                    <Route path="/sobreNosotros" element={<SobreNosotros />} />
                    <Route path="/terminosCondiciones" element={<TerminosCondiciones />} />
                    <Route path="/formulario-voluntario" element={<FormularioVoluntario />} />
                </Routes>
            </ClerkLoaded>
            </main>
            <BottomNavigationBar />
            <Footer />
        </div>
    </ProfileStatusContext.Provider>
  );
};

function App() {
    if (!GOOGLE_MAPS_API_KEY) { console.error("ADVERTENCIA: VITE_GOOGLE_MAPS_API_KEY no está definida."); }
    return (<LoadScript googleMapsApiKey={GOOGLE_MAPS_API_KEY} libraries={libraries}><AppContent /></LoadScript>);
}

export default App;