import React, { useState, useEffect, useContext, useMemo } from 'react';
import { Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { SignedIn, SignedOut, useUser, ClerkLoaded, useAuth } from '@clerk/clerk-react';
import { LoadScript } from '@react-google-maps/api';

// --- Componentes y Páginas (Tus importaciones originales) ---
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

// --- Hook Personalizado (Sin cambios, tu lógica es correcta) ---
const useUserProfileStatus = () => {
    const { isLoaded: isAuthLoaded, isSignedIn, getToken, userId } = useAuth();
    const [profileStatus, setProfileStatus] = useState({ isLoading: true, isComplete: false, userRole: null, userDataFromDB: null });
    const [fetchTrigger, setFetchTrigger] = useState(0);

    useEffect(() => {
        if (!isAuthLoaded) return;
        if (!isSignedIn) {
            setProfileStatus({ isLoading: false, isComplete: false, userRole: null, userDataFromDB: null });
            return;
        }

        const fetchUserProfile = async () => {
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
                const userFromDB = data.user || data;
                setProfileStatus({ isLoading: false, isComplete: !!userFromDB?.rol, userRole: userFromDB?.rol || null, userDataFromDB: userFromDB });
            } catch (error) {
                console.error("Error fetching user profile:", error);
                setProfileStatus({ isLoading: false, isComplete: false, userRole: null, userDataFromDB: null });
            }
        };
        fetchUserProfile();
    }, [isAuthLoaded, isSignedIn, fetchTrigger, getToken]);

    const refreshProfile = () => setFetchTrigger(p => p + 1);
    return { ...profileStatus, refreshProfile, currentClerkUserId: userId };
};

// ==================================================================
// LA SOLUCIÓN: Un "Contenedor Inteligente" para Usuarios Logueados
// ==================================================================
const AuthenticatedLayout = () => {
    const { isLoadingUserProfile, isProfileComplete, refreshUserProfile } = useContext(ProfileStatusContext);

    // Muestra un spinner mientras se verifica el estado del perfil.
    if (isLoadingUserProfile) {
        return <div className="flex justify-center items-center h-[calc(100vh-10rem)]"><p>Verificando tu perfil...</p></div>;
    }

    // Si el perfil NO está completo, renderiza el formulario para completarlo.
    // La URL no cambia, simplemente se muestra este componente.
    if (!isProfileComplete) {
        return <CompleteProfilePage onProfileComplete={refreshUserProfile} />;
    }

    // Si el perfil SÍ está completo, renderiza el resto de las rutas protegidas (Dashboard, etc.).
    // Outlet es el marcador de posición de react-router-dom para las rutas anidadas.
    return <Outlet />;
};

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
                            {/* --- Rutas Públicas (para usuarios no logueados) --- */}
                            <Route path="/" element={<SignedOut><HomePageUnregistered /></SignedOut>} />
                            
                            {/* --- Rutas de Autenticación --- */}
                            <Route path="/sign-in/*" element={<SignInPage />} />
                            <Route path="/sign-up/*" element={<SignUpPage />} />
                            
                            {/* --- Rutas Protegidas (para usuarios logueados) --- */}
                            {/* Se crea un grupo de rutas que requiere que el usuario esté logueado */}
                            <Route element={<SignedIn><AuthenticatedLayout /></SignedIn>}>
                                {/* Estas rutas anidadas se renderizarán en el <Outlet /> si el perfil está completo */}
                                <Route path="/dashboard" element={<DashboardPage />} />
                                <Route path="/perfil" element={<UserProfilePage />} />
                                <Route path="/publicar-donacion" element={<NewDonationPage onDonationCreated={() => setDonationCreationTimestamp(Date.now())} />} />
                                
                                {/* Si un usuario logueado intenta ir a la raíz, se le redirige al dashboard */}
                                <Route path="/" element={<Navigate to="/dashboard" replace />} />
                            </Route>
                            
                            {/* --- Rutas de Contenido Estático (públicas para todos) --- */}
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