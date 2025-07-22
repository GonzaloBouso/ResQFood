import React, { useState, useEffect, useContext, useMemo } from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { SignedIn, SignedOut, useUser, ClerkLoaded, useAuth } from '@clerk/clerk-react';
import { LoadScript } from '@react-google-maps/api';
import Header from './components/layout/Header';
import BottomNavigationBar from './components/layout/BottomNavigationBar';
import Footer from './components/layout/Footer';
import HomePageUnregistered from './pages/HomePageUnregistered';
import DashboardPage from './pages/DashboardPage';
import SignInPage from './pages/SignInPage';
import SignUpPage from './pages/SignUpPage';
import CompleteProfilePage from './pages/CompleteProfilePage';
import UserProfilePage from './pages/UserProfilePage';
import PoliticaPrivacidad from './pages/PoliticaPrivacidad';
import FormularioContacto from './pages/FormularioContacto';
import PoliticaUsoDatos from './pages/PoliticaUsoDatos';
import PreguntasFrecuentes from './pages/PreguntasFrecuentes';
import SobreNosotros from './pages/SobreNosotros';
import TerminosCondiciones from './pages/TerminosCondiciones';
import FormularioVoluntario from './pages/FormularioVoluntario';
import NewDonationPage from './pages/NewDonationPage'; // <-- ESTA ERA UNA DE LAS LÍNEAS QUE FALTABA

// --- Contexto y Configuración ---
import { ProfileStatusContext } from './context/ProfileStatusContext';
import API_BASE_URL from './api/config.js';

const GOOGLE_MAPS_API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
const libraries = ['places'];

// --- Hook de Perfil (Con la lógica de sincronización correcta) ---
const useUserProfileStatus = () => {
    const { isLoaded: isAuthLoaded, isSignedIn, getToken, userId } = useAuth();
    const [profileStatus, setProfileStatus] = useState({ isLoading: true, isComplete: false, userRole: null, userDataFromDB: null });
    const [fetchTrigger, setFetchTrigger] = useState(0);

    useEffect(() => {
        if (!isAuthLoaded) { return; }

        const fetchUserProfileFunction = async () => {
            if (!isSignedIn) {
                setProfileStatus({ isLoading: false, isComplete: false, userRole: null, userDataFromDB: null });
                return;
            }
            setProfileStatus(prev => ({ ...prev, isLoading: true }));
            try {
                const token = await getToken();
                const response = await fetch(`${API_BASE_URL}/api/usuario/me`, { headers: { 'Authorization': `Bearer ${token}` } });
                if (response.status === 404) {
                    setProfileStatus({ isLoading: false, isComplete: false, userRole: null, userDataFromDB: null });
                    return;
                }
                if (!response.ok) throw new Error("Error fetching user profile");
                const data = await response.json();
                const userFromOurDB = data.user || data;
                setProfileStatus({ 
                    isLoading: false, 
                    isComplete: !!userFromOurDB?.rol,
                    userRole: userFromOurDB?.rol || null, 
                    userDataFromDB: userFromOurDB 
                });
            } catch (error) {
                console.error("Error en fetchUserProfileFunction:", error);
                setProfileStatus({ isLoading: false, isComplete: false, userRole: null, userDataFromDB: null });
            }
        };
        fetchUserProfileFunction();
    }, [isAuthLoaded, isSignedIn, fetchTrigger, getToken]);

    const refreshProfile = () => setFetchTrigger(prev => prev + 1);
    return { ...profileStatus, refreshProfile, currentClerkUserId: userId };
};

// --- Componente de Ruta Protegida (lógica original) ---
const ProtectedRoute = ({ children }) => {
    const { isLoading, isComplete } = useContext(ProfileStatusContext);
    const location = useLocation();
  
    if (isLoading) {
      return <div className="flex justify-center items-center h-[calc(100vh-10rem)]"><p>Verificando tu perfil...</p></div>;
    }
    if (!isComplete) {
      return <Navigate to="/complete-profile" state={{ from: location }} replace />;
    }
    return children;
};

// --- Contenido Principal de la App (estructura de rutas original) ---
const AppContent = () => {
  const userProfileHookData = useUserProfileStatus();
  const [donationCreationTimestamp, setDonationCreationTimestamp] = useState(null);
  const [activeSearchLocation, setActiveSearchLocation] = useState(null);

  const contextValueForProvider = useMemo(() => ({
    isLoadingUserProfile: userProfileHookData.isLoading,
    isProfileComplete: userProfileHookData.isComplete,
    currentUserRole: userProfileHookData.userRole,
    currentUserDataFromDB: userProfileHookData.userDataFromDB,
    currentClerkUserId: userProfileHookData.currentClerkUserId,
    refreshUserProfile: userProfileHookData.refreshProfile,
    donationCreationTimestamp,
    activeSearchLocation,
    setActiveSearchLocation,
  }), [userProfileHookData, donationCreationTimestamp, activeSearchLocation]);

  return (
    <ProfileStatusContext.Provider value={contextValueForProvider}>
        <div className="flex flex-col min-h-screen bg-gray-50">
            <Header />
            <main className="flex-grow container mx-auto px-4 sm:px-6 lg:px-8 py-12 pb-24 md:pb-12">
            <ClerkLoaded>
                <Routes>
                    <Route path="/" element={<><SignedIn><Navigate to="/dashboard" /></SignedIn><SignedOut><HomePageUnregistered /></SignedOut></>} />
                    <Route path="/sign-in/*" element={<SignInPage />} />
                    <Route path="/sign-up/*" element={<SignUpPage />} />
                    
                    <Route path="/dashboard" element={<SignedIn><ProtectedRoute><DashboardPage /></ProtectedRoute></SignedIn>} />
                    <Route path="/perfil" element={<SignedIn><ProtectedRoute><UserProfilePage /></ProtectedRoute></SignedIn>} />
                    <Route path="/publicar-donacion" element={<SignedIn><ProtectedRoute><NewDonationPage onDonationCreated={() => setDonationCreationTimestamp(Date.now())} /></ProtectedRoute></SignedIn>} />

                    <Route path="/complete-profile" element={<SignedIn><CompleteProfilePage onProfileComplete={userProfileHookData.refreshProfile} /></SignedIn>} />

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

// --- Componente Raíz de la App ---
function App() {
  if (!GOOGLE_MAPS_API_KEY) {
    console.error("ADVERTENCIA: VITE_GOOGLE_MAPS_API_KEY no está definida.");
  }
  return (
    <LoadScript
        googleMapsApiKey={GOOGLE_MAPS_API_KEY}
        libraries={libraries}
        loadingElement={<div className="text-center py-10">Cargando...</div>}
        id="google-maps-script-resqfood"
    >
        <AppContent />
    </LoadScript>
  );
}

export default App;