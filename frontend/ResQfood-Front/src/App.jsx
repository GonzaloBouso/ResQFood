import React, { useState, useEffect, useContext, useMemo } from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { SignedIn, SignedOut, useUser, ClerkLoaded, useAuth } from '@clerk/clerk-react';
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
// ... el resto de tus importaciones de páginas

// --- Contexto y Configuración ---
import { ProfileStatusContext } from './context/ProfileStatusContext';
import API_BASE_URL from './api/config.js';

const GOOGLE_MAPS_API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
const libraries = ['places'];

// ==================================================================
// LA ÚNICA CORRECCIÓN IMPORTANTE ESTÁ AQUÍ
// ==================================================================
const useUserProfileStatus = () => {
    const { isLoaded: isAuthLoaded, isSignedIn, getToken, userId } = useAuth();
    
    const [profileStatus, setProfileStatus] = useState({
      isLoading: true, // Siempre empezamos cargando
      isComplete: false,
      userRole: null,
      userDataFromDB: null,
    });
    const [fetchTrigger, setFetchTrigger] = useState(0);
  
    useEffect(() => {
      // LA SOLUCIÓN: No hacemos NADA hasta que el SDK de Clerk nos confirme que está listo.
      // Esto evita las "race conditions" al refrescar la página.
      if (!isAuthLoaded) {
        return;
      }

      const fetchUserProfileFunction = async () => {
        if (!isSignedIn) {
          setProfileStatus({ isLoading: false, isComplete: false, userRole: null, userDataFromDB: null });
          return;
        }
  
        setProfileStatus(prev => ({ ...prev, isLoading: true }));
        try {
          const token = await getToken();
          const response = await fetch(`${API_BASE_URL}/api/usuario/me`, { 
            headers: { 'Authorization': `Bearer ${token}` },
          });
          
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
    }, [isAuthLoaded, isSignedIn, fetchTrigger, getToken]); // La dependencia clave es isAuthLoaded
  
    const refreshProfile = () => setFetchTrigger(prev => prev + 1);
  
    return { ...profileStatus, refreshProfile, currentClerkUserId: userId };
};


// --- TU LÓGICA ORIGINAL (QUE ERA CORRECTA) ---
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

const AppContent = () => {
  const userProfileHookData = useUserProfileStatus();
  // ... tu otro estado
  const contextValueForProvider = useMemo(() => ({
    isLoadingUserProfile: userProfileHookData.isLoading,
    isProfileComplete: userProfileHookData.isComplete,
    currentUserRole: userProfileHookData.userRole,
    currentUserDataFromDB: userProfileHookData.userDataFromDB,
    currentClerkUserId: userProfileHookData.currentClerkUserId,
    refreshUserProfile: userProfileHookData.refreshProfile,
    // ... tus otras dependencias
  }), [userProfileHookData, /* ...tus otras dependencias */ ]);

  return (
    <ProfileStatusContext.Provider value={contextValueForProvider}>
        <div className="flex flex-col min-h-screen bg-gray-50">
            <Header />
            <main className="flex-grow container mx-auto px-4 sm:px-6 lg:px-8 py-12 pb-24 md:pb-12">
            
            <ClerkLoaded>
                {/* TU ESTRUCTURA DE RUTAS ORIGINAL (QUE ERA CORRECTA) */}
                <Routes>
                    <Route path="/" element={<><SignedIn><Navigate to="/dashboard" /></SignedIn><SignedOut><HomePageUnregistered /></SignedOut></>} />
                    <Route path="/sign-in/*" element={<SignInPage />} />
                    <Route path="/sign-up/*" element={<SignUpPage />} />
                    
                    <Route path="/dashboard" element={<SignedIn><ProtectedRoute><DashboardPage /></ProtectedRoute></SignedIn>} />
                    <Route path="/perfil" element={<SignedIn><ProtectedRoute><UserProfilePage /></ProtectedRoute></SignedIn>} />
                    <Route path="/publicar-donacion" element={<SignedIn><ProtectedRoute><NewDonationPage onDonationCreated={() => {/*...tu lógica*/}} /></ProtectedRoute></SignedIn>} />

                    {/* LA RUTA SIN EL PROTECTEDROUTE CONFLICTIVO */}
                    <Route
                        path="/complete-profile"
                        element={
                        <SignedIn>
                            <CompleteProfilePage onProfileComplete={userProfileHookData.refreshProfile} />
                        </SignedIn>
                        }
                    />

                    {/* Tus otras rutas públicas */}
                    <Route path="/politicaPrivacidad" element={<PoliticaPrivacidad />} />
                    {/* ...el resto de tus rutas públicas... */}
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
  // ... tu código ...
  return (
    <LoadScript /* ...tus props */ >
        <AppContent />
    </LoadScript>
  );
}

export default App;