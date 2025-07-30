import React, { useState, useEffect, useContext, useMemo } from 'react';
import { Routes, Route, Navigate, Outlet, useNavigate } from 'react-router-dom';
import { SignedIn, SignedOut, ClerkLoaded, useAuth } from '@clerk/clerk-react';
import { LoadScript } from '@react-google-maps/api';

// --- Tus importaciones de Componentes y Páginas ---
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

// --- Hook de Perfil (Con la lógica de actualización directa) ---
const useUserProfileStatus = () => {
    const { isLoaded: isAuthLoaded, isSignedIn, getToken, userId } = useAuth();
    const [profileStatus, setProfileStatus] = useState({ isLoading: true, isComplete: false, userRole: null, userDataFromDB: null });

    const updateProfileState = (userData) => {
        setProfileStatus({ isLoading: false, isComplete: !!userData?.rol, userRole: userData?.rol || null, userDataFromDB: userData });
    };

    useEffect(() => {
        if (!isAuthLoaded) return;

        const fetchUserProfileFunction = async () => {
            if (!isSignedIn) {
                updateProfileState(null);
                return;
            }
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
                updateProfileState(data.user);
            } catch (error) {
                console.error("Error en fetchUserProfileFunction:", error);
                setProfileStatus({ isLoading: false, isComplete: false, userRole: null, userDataFromDB: null });
            }
        };
        fetchUserProfileFunction();
    }, [isAuthLoaded, isSignedIn, getToken]);

    return { ...profileStatus, updateProfileState, currentClerkUserId: userId };
};


// ==================================================================
// LA SOLUCIÓN: Un "Contenedor Inteligente" para Usuarios Logueados
// ==================================================================
const AuthenticatedLayout = () => {
    const { isLoadingUserProfile, isProfileComplete, updateProfileState } = useContext(ProfileStatusContext);
    const navigate = useNavigate();

    // 1. Muestra un spinner mientras se verifica el estado del perfil.
    if (isLoadingUserProfile) {
        return <div className="flex justify-center items-center h-[calc(100vh-10rem)]"><p>Verificando tu perfil...</p></div>;
    }

    // 2. Si el perfil NO está completo, renderiza el formulario para completarlo.
    //    Le pasamos una función de callback que navega al dashboard después de actualizar el estado.
    if (!isProfileComplete) {
        const handleProfileCompletion = (userData) => {
            updateProfileState(userData);
            navigate('/dashboard', { replace: true });
        };
        return <CompleteProfilePage onProfileComplete={handleProfileCompletion} />;
    }

    // 3. Si el perfil SÍ está completo, renderiza el resto de las rutas protegidas.
    //    <Outlet /> es el marcador de posición para las rutas anidadas como /dashboard, /perfil, etc.
    return <Outlet />;
};


const AppContent = () => {
  const userProfileHookData = useUserProfileStatus();
  // ... tu otro estado ...
  const contextValueForProvider = useMemo(() => ({
    isLoadingUserProfile: userProfileHookData.isLoading,
    isProfileComplete: userProfileHookData.isComplete,
    currentUserRole: userProfileHookData.userRole,
    currentUserDataFromDB: userProfileHookData.userDataFromDB,
    currentClerkUserId: userProfileHookData.currentClerkUserId,
    updateProfileState: userProfileHookData.updateProfileState,
  }), [userProfileHookData]);

  return (
    <ProfileStatusContext.Provider value={contextValueForProvider}>
        <div className="flex flex-col min-h-screen bg-gray-50">
            <Header />
            <main className="flex-grow container mx-auto px-4 sm:px-6 lg:px-8 py-12 pb-24 md:pb-12">
            <ClerkLoaded>
                <Routes>
                    {/* --- Rutas Públicas (para usuarios no logueados) --- */}
                    <Route path="/" element={<SignedOut><HomePageUnregistered /></SignedOut>} />
                    <Route path="/sign-in/*" element={<SignInPage />} />
                    <Route path="/sign-up/*" element={<SignUpPage />} />

                    {/* --- Ruta para Completar Perfil (ahora es una ruta de primer nivel) --- */}
                    <Route path="/complete-profile" element={<SignedIn><AuthenticatedLayout /></SignedIn>} />

                    {/* --- Rutas Protegidas --- */}
                    <Route path="/dashboard" element={<SignedIn><AuthenticatedLayout /></SignedIn>} />
                    <Route path="/perfil" element={<SignedIn><AuthenticatedLayout /></SignedIn>} />
                    <Route path="/publicar-donacion" element={<SignedIn><AuthenticatedLayout /></SignedIn>} />

                    {/* --- Redirección para usuarios logueados que van a la raíz --- */}
                    <Route path="/" element={<SignedIn><Navigate to="/dashboard" replace /></SignedIn>} />

                    {/* --- Rutas Estáticas --- */}
                    <Route path="/politicaPrivacidad" element={<PoliticaPrivacidad />} />
                    <Route path="/formularioContacto" element={<FormularioContacto />} />
                    {/* ...el resto de tus rutas estáticas... */}
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
    if (!GOOGLE_MAPS_API_KEY) { console.error("ADVERTENCIA: VITE_GOOGLE_MAPS_API_KEY no está definida."); }
    return (<LoadScript googleMapsApiKey={GOOGLE_MAPS_API_KEY} libraries={libraries}><AppContent /></LoadScript>);
}

export default App;