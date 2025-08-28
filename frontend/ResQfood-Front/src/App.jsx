
import React, { useState, useEffect, useContext, useMemo, useCallback } from 'react';
import { Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { SignedIn, ClerkLoaded, useAuth } from '@clerk/clerk-react';
import { LoadScript } from '@react-google-maps/api';
import { Toaster } from 'react-hot-toast';

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
import MyRequestsPage from './pages/MyRequestsPage';
import PoliticaPrivacidad from './pages/PoliticaPrivacidad';
import FormularioContacto from './pages/FormularioContacto';
import PoliticaUsoDatos from './pages/PoliticaUsoDatos';
import PreguntasFrecuentes from './pages/PreguntasFrecuentes';
import SobreNosotros from './pages/SobreNosotros';
import TerminosCondiciones from './pages/TerminosCondiciones';
import FormularioVoluntario from './pages/FormularioVoluntario';
import AdminDashboardPage from './pages/AdminDashboardPage.jsx';

import { useSocket } from './hooks/useSocket';

import { ProfileStatusContext } from './context/ProfileStatusContext.js';
import API_BASE_URL from './api/config.js';

const GOOGLE_MAPS_API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
const libraries = ['places'];

const RootRedirector = () => {
  const { isSignedIn, isLoaded } = useAuth();
  if (!isLoaded) { return <div className="text-center py-20">Cargando...</div>; }
  if (isSignedIn) { return <Navigate to="/dashboard" replace />; }
  return <HomePageUnregistered />;
};

const useGlobalState = () => {
    const { isLoaded: isAuthLoaded, isSignedIn, getToken, userId } = useAuth();
    
    const [profileStatus, setProfileStatus] = useState({ 
      isLoadingUserProfile: true, 
      isComplete: false, 
      currentUserRole: null, 
      currentUserDataFromDB: null 
    });

    const [activeSearchLocation, setActiveSearchLocation] = useState(null);
    const [donationCreationTimestamp, setDonationCreationTimestamp] = useState(Date.now());
    const [searchQuery, setSearchQuery] = useState('');
    const [notifications, setNotifications] = useState([]);
    const [unreadCount, setUnreadCount] = useState(0);

    useEffect(() => {
        const newUnreadCount = notifications.filter(n => !n.leida).length;
        setUnreadCount(newUnreadCount);
    }, [notifications]);

    const updateProfileState = (userData) => {
        setProfileStatus({ 
          isLoadingUserProfile: false, 
          isComplete: !!userData?.rol, 
          currentUserRole: userData?.rol || null, 
          currentUserDataFromDB: userData 
        });
    };

    const triggerDonationReFetch = () => {
        setDonationCreationTimestamp(Date.now());
    };

    const addNotification = useCallback((newNotification) => {
        setNotifications(prev => {
            if (prev.some(n => n._id === newNotification._id)) return prev;
            return [newNotification, ...prev];
        });
    }, []);

    const fetchInitialNotifications = useCallback(async (token) => {
        if (!token) return;
        try {
            const response = await fetch(`${API_BASE_URL}/api/notificacion`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (!response.ok) throw new Error("Failed to fetch notifications");
            const data = await response.json();
            setNotifications(data.notificaciones || []);
        } catch (error) {
            console.error("Error al cargar notificaciones iniciales:", error);
            setNotifications([]);
        }
    }, []);

    useEffect(() => {
        if (!isAuthLoaded) return; 
        
        const fetchUserProfileFunction = async () => {
            if (!isSignedIn) {
                updateProfileState(null);
                setActiveSearchLocation(null);
                setNotifications([]);
                return;
            }

            setProfileStatus(prev => ({ ...prev, isLoadingUserProfile: true }));
            
            try {
                const token = await getToken();
                
                const profileResponse = await fetch(`${API_BASE_URL}/api/usuario/me`, { 
                  headers: { 'Authorization': `Bearer ${token}` } 
                });
                
                if (profileResponse.status === 404) {
                    setProfileStatus({ isLoadingUserProfile: false, isComplete: false, currentUserRole: null, currentUserDataFromDB: null });
                    return;
                }
                
                if (!profileResponse.ok) {
                  const errorData = await profileResponse.json();
                  throw new Error(errorData.message || "Error al obtener el perfil del usuario.");
                }
                
                const data = await profileResponse.json();
                updateProfileState(data.user); 
                await fetchInitialNotifications(token); 

            } catch (error) {
                console.error("Error en fetchUserProfileFunction:", error.message);
                setProfileStatus({ isLoadingUserProfile: false, isComplete: false, currentUserRole: null, currentUserDataFromDB: null });
            }
        };

        fetchUserProfileFunction();
    }, [isAuthLoaded, isSignedIn, getToken, fetchInitialNotifications]); 

    return {
        ...profileStatus,
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

const ProtectedLayout = ({ adminOnly = false }) => {
    const { isLoadingUserProfile, isComplete, currentUserRole } = useContext(ProfileStatusContext);

    if (isLoadingUserProfile) {
        return <div className="flex justify-center items-center h-[calc(100vh-10rem)]"><p>Verificando tu perfil...</p></div>;
    }

    if (!isComplete) {
        return <CompleteProfilePage onProfileComplete={useContext(ProfileStatusContext).updateProfileState} />;
    }
    
    if (adminOnly && currentUserRole !== 'ADMIN') {
        return <Navigate to="/dashboard" replace />;
    }

    return <Outlet />;
};

const AppContent = () => {
  const appStateHook = useGlobalState();
  useSocket(appStateHook.addNotification);

  const contextValueForProvider = useMemo(() => (appStateHook), [
    appStateHook.isLoadingUserProfile,
    appStateHook.isComplete,
    appStateHook.currentUserDataFromDB,
    appStateHook.activeSearchLocation,
    appStateHook.donationCreationTimestamp,
    appStateHook.searchQuery,
    appStateHook.notifications,
    appStateHook.unreadCount
  ]);

  return (
    <ProfileStatusContext.Provider value={contextValueForProvider}>
        <div className="flex flex-col min-h-screen bg-gray-50">
             <Toaster position="top-center" reverseOrder={false} />
            <Header />
            <main className="flex-grow container mx-auto px-4 sm:px-6 lg:px-8 py-12 pb-24 md:pb-12">
            <ClerkLoaded>
                <Routes>
                    <Route path="/" element={<RootRedirector />} />
                    <Route path="/sign-in/*" element={<SignInPage />} />
                    <Route path="/sign-up/*" element={<SignUpPage />} />

                    {/* Rutas Protegidas para usuarios logueados y con perfil completo */}
                    <Route element={<SignedIn><ProtectedLayout /></SignedIn>}>
                        <Route path="/dashboard" element={<DashboardPage />} />
                        <Route path="/publicar-donacion" element={<NewDonationPage onDonationCreated={appStateHook.triggerDonationReFetch} />} />
                        <Route path="/mis-donaciones" element={<MyDonationsPage />} />
                        <Route path="/mis-solicitudes" element={<MyRequestsPage />} />
                        <Route path="/mi-perfil" element={<MiPerfilPage />} />
                        <Route path="/perfil/:id" element={<UserProfilePage />} />
                    </Route>

                    {/* Rutas Protegidas solo para Administradores */}
                    <Route element={<SignedIn><ProtectedLayout adminOnly={true} /></SignedIn>}>
                        <Route path="/admin" element={<AdminDashboardPage />} />
                    </Route>

                    {/* Rutas Públicas */}
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