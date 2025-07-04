// src/App.jsx
import React, { useState, useEffect, useContext, useMemo } from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { SignedIn, SignedOut, useUser, ClerkLoaded, useAuth } from '@clerk/clerk-react';
import { LoadScript } from '@react-google-maps/api';

// import Header from './src/components/layout/Header';
import Header from './components/layout/Header'
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
import { ProfileStatusContext } from './context/ProfileStatusContext';
import API_BASE_URL from './api/config.js';

const GOOGLE_MAPS_API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
const libraries = ['places'];

const useUserProfileStatus = () => {
    const { user: clerkUser, isLoaded: isClerkLoaded, isSignedIn } = useUser();
    const { getToken } = useAuth();
    
    const [profileStatus, setProfileStatus] = useState({
      isLoading: true, isComplete: false, clerkUserId: null, userRole: null, userDataFromDB: null,
    });
    const [fetchTrigger, setFetchTrigger] = useState(0);
  
    const fetchUserProfileFunction = async () => {
      if (!isSignedIn || !clerkUser) {
        setProfileStatus({ isLoading: false, isComplete: false, clerkUserId: clerkUser?.id || null, userRole: null, userDataFromDB: null });
        return;
      }
      setProfileStatus(prev => ({ ...prev, isLoading: true, clerkUserId: clerkUser.id }));
      try {
        const token = await getToken();
        const response = await fetch(`${API_BASE_URL}/usuario/me`, { 
          headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
        });
        if (!response.ok) {
          if (response.status === 404) {
            setProfileStatus({ isLoading: false, isComplete: false, clerkUserId: clerkUser.id, userRole: null, userDataFromDB: null });
          }
          return;
        }
        const data = await response.json();
        const userFromOurDB = data.user || data;
        if (userFromOurDB && userFromOurDB.rol) {
          setProfileStatus({ isLoading: false, isComplete: true, clerkUserId: clerkUser.id, userRole: userFromOurDB.rol, userDataFromDB: userFromOurDB });
        } else {
          setProfileStatus({ isLoading: false, isComplete: false, clerkUserId: clerkUser.id, userRole: null, userDataFromDB: userFromOurDB });
        }
      } catch (error) {
        console.error("(useUserProfileStatus) CATCH ERROR en fetchUserProfileFunction:", error);
        setProfileStatus({ isLoading: false, isComplete: false, clerkUserId: clerkUser?.id, userRole: null, userDataFromDB: null });
      }
    };
  
    useEffect(() => {
      if (!isClerkLoaded) return; 
      if (isSignedIn && clerkUser) {
        fetchUserProfileFunction(); 
      } else if (isClerkLoaded && !isSignedIn) {
        setProfileStatus({ isLoading: false, isComplete: false, clerkUserId: null, userRole: null, userDataFromDB: null });
      }
    }, [isClerkLoaded, clerkUser, isSignedIn, fetchTrigger, getToken]); 
  
    const refreshProfile = () => setFetchTrigger(prev => prev + 1);
  
    return { ...profileStatus, refreshProfile };
};

const ProtectedRoute = ({ children }) => {
    const contextValue = useContext(ProfileStatusContext);
    const location = useLocation();
  
    if (!contextValue || contextValue.isLoadingUserProfile) {
      return <div className="flex justify-center items-center h-[calc(100vh-10rem)]"><p>Verificando tu perfil...</p></div>;
    }
  
    const { isProfileComplete } = contextValue;
  
    if (!isProfileComplete && location.pathname !== '/complete-profile') {
      return <Navigate to="/complete-profile" state={{ from: location }} replace />;
    }
  
    if (isProfileComplete && location.pathname === '/complete-profile') {
      return <Navigate to="/dashboard" replace />;
    }
  
    return children;
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
    currentClerkUserId: userProfileHookData.clerkUserId,
    donationCreationTimestamp: donationCreationTimestamp,
    activeSearchLocation: activeSearchLocation,
    setActiveSearchLocation: setActiveSearchLocation,
  }), [
      userProfileHookData.isLoading,
      userProfileHookData.isComplete,
      userProfileHookData.userRole,
      userProfileHookData.userDataFromDB,
      userProfileHookData.clerkUserId,
      donationCreationTimestamp,
      activeSearchLocation
  ]);

  return (
    <ProfileStatusContext.Provider value={contextValueForProvider}>
        <div className="flex flex-col min-h-screen bg-gray-50">
            <Header />
            <main className="flex-grow container mx-auto px-4 sm:px-6 lg:px-8 py-12 pb-24 md:pb-12">
            <ClerkLoaded>
                <Routes>
                <Route path="/" element={<><SignedIn><ProtectedRoute><DashboardPage /></ProtectedRoute></SignedIn><SignedOut><HomePageUnregistered /></SignedOut></>} />
                <Route path="/sign-in/*" element={<SignInPage />} />
                <Route path="/sign-up/*" element={<SignUpPage />} />
                <Route path="/dashboard" element={<SignedIn><ProtectedRoute><DashboardPage /></ProtectedRoute></SignedIn>} />
                <Route
                    path="/complete-profile"
                    element={
                    <SignedIn>
                        <ProtectedRoute>
                        <CompleteProfilePage onProfileComplete={() => userProfileHookData.refreshProfile()} />
                        </ProtectedRoute>
                    </SignedIn>
                    }
                />
                <Route path="/perfil" element={<SignedIn><ProtectedRoute><UserProfilePage /></ProtectedRoute></SignedIn>} />
                <Route 
                    path="/publicar-donacion" 
                    element={
                    <SignedIn>
                        <ProtectedRoute>
                        <NewDonationPage onDonationCreated={() => setDonationCreationTimestamp(Date.now())} />
                        </ProtectedRoute>
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

function App() {
  if (!GOOGLE_MAPS_API_KEY) {
    console.error("ADVERTENCIA: VITE_GOOGLE_MAPS_API_KEY no está definida.");
  }

  return (
    <>
      {GOOGLE_MAPS_API_KEY ? (
        <LoadScript
          googleMapsApiKey={GOOGLE_MAPS_API_KEY}
          libraries={libraries}
          loadingElement={<div className="text-center py-10">Cargando Google Maps API...</div>}
          id="google-maps-script-resqfood"
        >
          <AppContent />
        </LoadScript>
      ) : (
        <AppContent /> 
      )}
    </>
  );
}

export default App;