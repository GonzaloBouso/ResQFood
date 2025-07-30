import React, { useState, useEffect, useContext, useMemo } from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { SignedIn, SignedOut, ClerkLoaded, useAuth } from '@clerk/clerk-react';
import { LoadScript } from '@react-google-maps/api';

// --- Tus importaciones de Componentes y Páginas (completas) ---
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
import NewDonationPage from './pages/NewDonationPage';

// --- Contexto y Configuración ---
import { ProfileStatusContext } from './context/ProfileStatusContext';
import API_BASE_URL from './api/config.js';

const GOOGLE_MAPS_API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
const libraries = ['places'];

// ==================================================================
// LA SOLUCIÓN FINAL ESTÁ AQUÍ
// ==================================================================
const useUserProfileStatus = () => {
    const { isLoaded: isAuthLoaded, isSignedIn, getToken, userId } = useAuth();
    const [profileStatus, setProfileStatus] = useState({ isLoading: true, isComplete: false, userRole: null, userDataFromDB: null });
    const [fetchTrigger, setFetchTrigger] = useState(0);

    // 1. Creamos una función para actualizar el estado directamente desde otros componentes.
    //    Esto evita la necesidad de un re-fetch después de completar el perfil, eliminando la "race condition".
    const updateProfileState = (userData) => {
        setProfileStatus({
            isLoading: false,
            isComplete: !!userData?.rol,
            userRole: userData?.rol || null,
            userDataFromDB: userData
        });
    };
  
    useEffect(() => {
        // No hacemos nada hasta que el SDK de Clerk esté 100% cargado.
        if (!isAuthLoaded) return;

        const fetchUserProfileFunction = async () => {
            if (!isSignedIn) {
                setProfileStatus({ isLoading: false, isComplete: false, userRole: null, userDataFromDB: null });
                return;
            }
            // Evita un re-fetch si el perfil ya está completo (optimización)
            if (profileStatus.isComplete) {
                setProfileStatus(prev => ({ ...prev, isLoading: false }));
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
                updateProfileState(data.user); // Usamos la nueva función para establecer el estado
            } catch (error) {
                console.error("Error en fetchUserProfileFunction:", error);
                setProfileStatus({ isLoading: false, isComplete: false, userRole: null, userDataFromDB: null });
            }
        };
        fetchUserProfileFunction();
    }, [isAuthLoaded, isSignedIn, fetchTrigger, getToken]);
  
    const refreshProfile = () => setFetchTrigger(prev => prev + 1);
  
    // 2. Pasamos la nueva función al return del hook.
    return { ...profileStatus, refreshProfile, updateProfileState, currentClerkUserId: userId };
};


// --- Componente de Ruta Protegida (Tu lógica original, que es correcta) ---
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


// --- Contenido Principal de la App ---
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
    updateProfileState: userProfileHookData.updateProfileState, // 3. Pasamos la nueva función al contexto.
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
                    {/* --- Tu estructura de rutas original, que es correcta --- */}
                    <Route path="/" element={<><SignedIn><Navigate to="/dashboard" /></SignedIn><SignedOut><HomePageUnregistered /></SignedOut></>} />
                    <Route path="/sign-in/*" element={<SignInPage />} />
                    <Route path="/sign-up/*" element={<SignUpPage />} />
                    
                    <Route path="/dashboard" element={<SignedIn><ProtectedRoute><DashboardPage /></ProtectedRoute></SignedIn>} />
                    <Route path="/perfil" element={<SignedIn><ProtectedRoute><UserProfilePage /></ProtectedRoute></SignedIn>} />
                    <Route path="/publicar-donacion" element={<SignedIn><ProtectedRoute><NewDonationPage onDonationCreated={() => setDonationCreationTimestamp(Date.now())} /></ProtectedRoute></SignedIn>} />

                    <Route
                        path="/complete-profile"
                        element={
                        <SignedIn>
                            {/* 4. Le pasamos la nueva función `updateProfileState` como prop a CompleteProfilePage. */}
                            <CompleteProfilePage onProfileComplete={userProfileHookData.updateProfileState} />
                        </SignedIn>
                        }
                    />

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


// --- Componente Raíz de la App (Sin cambios) ---
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