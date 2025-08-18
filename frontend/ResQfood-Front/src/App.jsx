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



const useGlobalState= () => {// Antes useUserProfileAndLocation
    const { isLoaded: isAuthLoaded, isSignedIn, getToken, userId } = useAuth();
    const [profileStatus, setProfileStatus] = useState({ isLoadingUserProfile: true, isComplete: false, userRole: null, userDataFromDB: null });
    const [activeSearchLocation, setActiveSearchLocation] = useState(null);
    const [donationCreationTimestamp, setDonationCreationTimestamp] = useState(Date.now());

    const [searchQuery, setSearchQuery] = useState(''); //estado para la busqueda
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

    // 1. Devolvemos un objeto "plano" con todas las propiedades,
    //    extrayéndolas del estado 'profileStatus'.
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

    };
};

// --- Layout Guardián (ahora usa 'currentUserRole') ---
const ProtectedLayout = ({ adminOnly = false }) => {
    const { isLoadingUserProfile, isComplete, currentUserRole, updateProfileState } = useContext(ProfileStatusContext);

    if (isLoadingUserProfile) {
        return <div className="flex justify-center items-center h-[calc(100vh-10rem)]"><p>Verificando tu perfil...</p></div>;
    }

    if (!isComplete) {
        return <CompleteProfilePage onProfileComplete={updateProfileState} />;
    }
    
    if (adminOnly && currentUserRole !== 'ADMIN') {
        return <Navigate to="/dashboard" replace />;
    }

    return <Outlet />;
};

const AppContent = () => {
  const appStateHook = useGlobalState();
  
  const contextValueForProvider = useMemo(() => ({
    
    isLoadingUserProfile: appStateHook.isLoadingUserProfile,
    isComplete: appStateHook.isComplete,
    currentUserRole: appStateHook.userRole,
    currentUserDataFromDB: appStateHook.userDataFromDB,
    currentClerkUserId: appStateHook.currentClerkUserId,
    updateProfileState: appStateHook.updateProfileState,
    activeSearchLocation: appStateHook.activeSearchLocation,
    setActiveSearchLocation: appStateHook.setActiveSearchLocation,
    donationCreationTimestamp: appStateHook.donationCreationTimestamp,
    triggerDonationReFetch: appStateHook.triggerDonationReFetch,
    searchQuery: appStateHook.searchQuery,
    setSearchQuery: appStateHook.setSearchQuery,
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
                    <Route path="/" element={<RootRedirector />} />
                    <Route path="/sign-in/*" element={<SignInPage />} />
                    <Route path="/sign-up/*" element={<SignUpPage />} />
                    
                    {/* Grupo de Rutas para USUARIOS NORMALES */}
                    <Route element={<SignedIn><ProtectedLayout /></SignedIn>}>
                        <Route path="/dashboard" element={<DashboardPage />} />
                        <Route path="/publicar-donacion" element={<NewDonationPage onDonationCreated={handleDonationCreated} />} />
                        <Route path="/mis-donaciones" element={<MyDonationsPage />} />
                        <Route path="/mi-perfil" element={<MiPerfilPage />} />
                        <Route path="/perfil/:id" element={<UserProfilePage />} />
                    </Route>
                    
                    {/* Grupo de Rutas para ADMINS */}
                    <Route element={<SignedIn><ProtectedLayout adminOnly={true} /></SignedIn>}>
                        <Route path="/admin" element={<AdminDashboardPage />} />
                    </Route>

                    {/* Rutas Públicas de Contenido Estático */}
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