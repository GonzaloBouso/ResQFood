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
import { ProfileStatusContext } from './context/ProfileStatusContext';
import API_BASE_URL from './api/config.js';

const GOOGLE_MAPS_API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
const libraries = ['places'];

const RootRedirector = () => {
  const { isSignedIn, isLoaded } = useAuth();
  if (!isLoaded) { return <div className="text-center py-20">Cargando...</div>; }
  if (isSignedIn) { return <Navigate to="/dashboard" replace />; }
  return <HomePageUnregistered />;
};

// --- Hook de estado global CORREGIDO Y COMPLETO ---
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

    const unreadCount = useMemo(() => notifications.filter(n => !n.leida).length, [notifications]);

    const hasNewDonationNotifications = useMemo(() => 
        notifications.some(n => !n.leida && n.tipoNotificacion === 'SOLICITUD'), 
        [notifications]
    );

    const hasNewRequestNotifications = useMemo(() => 
        notifications.some(n => !n.leida && ['APROBACION', 'RECHAZO'].includes(n.tipoNotificacion)), 
        [notifications]
    );

    const updateProfileState = (userData) => {
        setProfileStatus({ 
          isLoadingUserProfile: false, 
          isComplete: !!userData?.rol, 
          currentUserRole: userData?.rol || null, 
          currentUserDataFromDB: userData 
        });
    };

    const triggerDonationReFetch = () => { setDonationCreationTimestamp(Date.now()); };

    const addNotification = useCallback((newNotification) => {
        setNotifications(prev => {
            if (prev.some(n => n._id === newNotification._id)) return prev;
            return [newNotification, ...prev];
        });
    }, []);

    // --- FUNCIONES NUEVAS AÑADIDAS ---
    const markDonationNotificationsAsRead = useCallback(() => {
        setNotifications(prev => 
            prev.map(n => 
                n.tipoNotificacion === 'SOLICITUD' ? { ...n, leida: true } : n
            )
        );
    }, []);

    const markRequestNotificationsAsRead = useCallback(() => {
        setNotifications(prev =>
            prev.map(n =>
                ['APROBACION', 'RECHAZO'].includes(n.tipoNotificacion) ? { ...n, leida: true } : n
            )
        );
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
                
                const [profileResponse, notificationsResponse] = await Promise.all([
                    fetch(`${API_BASE_URL}/api/usuario/me`, { headers: { 'Authorization': `Bearer ${token}` } }),
                    fetch(`${API_BASE_URL}/api/notificacion`, { headers: { 'Authorization': `Bearer ${token}` } })
                ]);
                
                if (profileResponse.status === 404) {
                    setProfileStatus({ isLoadingUserProfile: false, isComplete: false, currentUserRole: null, currentUserDataFromDB: null });
                    setNotifications([]); 
                    return;
                }
                
                if (!profileResponse.ok) {
                  const errorData = await profileResponse.json();
                  throw new Error(errorData.message || "Error al obtener el perfil del usuario.");
                }
                if (!notificationsResponse.ok) throw new Error("Failed to fetch notifications");
                
                const profileData = await profileResponse.json();
                const notificationsData = await notificationsResponse.json();

                updateProfileState(profileData.user); 
                setNotifications(notificationsData.notificaciones || []);

            } catch (error) {
                console.error("Error en fetchUserProfileFunction:", error.message);
                setProfileStatus({ isLoadingUserProfile: false, isComplete: false, currentUserRole: null, currentUserDataFromDB: null });
            }
        };

        fetchUserProfileFunction();
    }, [isAuthLoaded, isSignedIn, getToken]); 

    // Se retornan todos los valores, incluyendo las nuevas funciones
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
        hasNewRequestNotifications,
        hasNewDonationNotifications,
        markDonationNotificationsAsRead,
        markRequestNotificationsAsRead,
    };
};

const ProtectedLayout = ({ adminOnly = false }) => {
    const { isLoadingUserProfile, isComplete, currentUserRole } = useContext(ProfileStatusContext);
    if (isLoadingUserProfile) return <div className="flex justify-center items-center h-[calc(100vh-10rem)]"><p>Verificando tu perfil...</p></div>;
    if (!isComplete) return <CompleteProfilePage onProfileComplete={useContext(ProfileStatusContext).updateProfileState} />;
    if (adminOnly && currentUserRole !== 'ADMIN') return <Navigate to="/dashboard" replace />;
    return <Outlet />;
};

const AppContent = () => {
  const appStateHook = useGlobalState();
  useSocket(appStateHook.addNotification);

  // --- CORRECCIÓN #2: Simplificar las dependencias de useMemo ---
  // Pasar el objeto 'appStateHook' completo es suficiente y más limpio.
  // React detectará cambios en sus propiedades internas.
  const contextValueForProvider = useMemo(() => appStateHook, [appStateHook]);

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
                    <Route element={<SignedIn><ProtectedLayout /></SignedIn>}>
                        <Route path="/dashboard" element={<DashboardPage />} />
                        <Route path="/publicar-donacion" element={<NewDonationPage onDonationCreated={appStateHook.triggerDonationReFetch} />} />
                        <Route path="/mis-donaciones" element={<MyDonationsPage />} />
                        <Route path="/mis-solicitudes" element={<MyRequestsPage />} />
                        <Route path="/mi-perfil" element={<MiPerfilPage />} />
                        <Route path="/perfil/:id" element={<UserProfilePage />} />
                    </Route>
                    <Route element={<SignedIn><ProtectedLayout adminOnly={true} /></SignedIn>}>
                        <Route path="/admin" element={<AdminDashboardPage />} />
                    </Route>
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