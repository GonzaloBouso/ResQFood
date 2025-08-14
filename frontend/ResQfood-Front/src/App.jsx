import React, { useState, useEffect, useContext, useMemo } from 'react';
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

// --- Hook personalizado para gestionar el estado global (sin cambios) ---
const useUserProfileAndLocation = () => {
    const { isLoaded: isAuthLoaded, isSignedIn, getToken, userId } = useAuth();
    const [profileStatus, setProfileStatus] = useState({ isLoadingUserProfile: true, isComplete: false, userRole: null, userDataFromDB: null });
    const [activeSearchLocation, setActiveSearchLocation] = useState(null);
    const [donationCreationTimestamp, setDonationCreationTimestamp] = useState(Date.now());

    const updateProfileState = (userData) => {
        setProfileStatus({ isLoadingUserProfile: false, isComplete: !!userData?.rol, userRole: userData?.rol || null, userDataFromDB: userData });
    };

    const triggerDonationReFetch = () => {
        setDonationCreationTimestamp(Date.now());
    };

    useEffect(() => {
        if (!isAuthLoaded) return;
        
        const fetchUserProfileFunction = async () => {
            if (!isSignedIn) {
                updateProfileState(null);
                setActiveSearchLocation(null);
                return;
            }
            if (profileStatus.isComplete && !profileStatus.isLoadingUserProfile) return;
            
            setProfileStatus(prev => ({ ...prev, isLoadingUserProfile: true }));
            try {
                const token = await getToken();
                const response = await fetch(`${API_BASE_URL}/api/usuario/me`, { headers: { 'Authorization': `Bearer ${token}` } });
                
                if (response.status === 404) {
                    setProfileStatus({ isLoadingUserProfile: false, isComplete: false, userRole: null, userDataFromDB: null });
                    return;
                }
                
                if (!response.ok) throw new Error("Error fetching user profile");
                
                const data = await response.json();
                updateProfileState(data.user);
            } catch (error) {
                console.error("Error en fetchUserProfileFunction:", error);
                setProfileStatus({ isLoadingUserProfile: false, isComplete: false, userRole: null, userDataFromDB: null });
            }
        };
        fetchUserProfileFunction();
    }, [isAuthLoaded, isSignedIn]);

    return { 
        ...profileStatus, 
        updateProfileState, 
        currentClerkUserId: userId,
        activeSearchLocation,
        setActiveSearchLocation,
        donationCreationTimestamp,
        triggerDonationReFetch
    };
};

//  único "Layout Guardián" que maneja todos los roles
const ProtectedLayout = ({ adminOnly = false }) => {
    const { isLoadingUserProfile, isComplete, currentUserRole, updateProfileState } = useContext(ProfileStatusContext);

    // 1. Siempre esperamos a que el perfil se cargue.
    if (isLoadingUserProfile) {
        return <div className="flex justify-center items-center h-[calc(100vh-10rem)]"><p>Verificando tu perfil...</p></div>;
    }

    // 2. Si el perfil no está completo, SIEMPRE se muestra la página para completarlo.
    if (!isComplete) {
        return <CompleteProfilePage onProfileComplete={updateProfileState} />;
    }
    
    // 3. Si esta ruta requiere ser admin Y el usuario NO es admin, se le redirige.
    if (adminOnly && currentUserRole !== 'ADMIN') {
        return <Navigate to="/dashboard" replace />;
    }

    // 4. Si todas las comprobaciones pasan, se muestra el contenido solicitado.
    return <Outlet />;
};

const AppContent = () => {
  const appStateHook = useUserProfileAndLocation();
  
  const contextValueForProvider = useMemo(() => ({
    isLoadingUserProfile: appStateHook.profileStatus.isLoadingUserProfile,
    isComplete: appStateHook.profileStatus.isComplete,
    currentUserRole: appStateHook.profileStatus.userRole,
    currentUserDataFromDB: appStateHook.profileStatus.userDataFromDB,
    currentClerkUserId: appStateHook.currentClerkUserId,
    updateProfileState: appStateHook.updateProfileState,
    activeSearchLocation: appStateHook.activeSearchLocation,
    setActiveSearchLocation: appStateHook.setActiveSearchLocation,
    donationCreationTimestamp: appStateHook.donationCreationTimestamp,
    triggerDonationReFetch: appStateHook.triggerDonationReFetch
  }), [appStateHook]);

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
                    {/* La página de completar perfil ahora es manejada por ProtectedLayout */}

                    {/* --- Grupo de Rutas para USUARIOS NORMALES --- */}
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
                        {/* Aquí puedes añadir más rutas de admin en el futuro */}
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