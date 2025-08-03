import React, { useState, useEffect, useContext, useMemo } from 'react';
import { Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { SignedIn, SignedOut, ClerkLoaded, useAuth } from '@clerk/clerk-react';
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
import NewDonationPage from './pages/NewDonationPage';

import { ProfileStatusContext } from './context/ProfileStatusContext';
import API_BASE_URL from './api/config.js';

const GOOGLE_MAPS_API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
const libraries = ['places'];

const useUserProfileStatus = () => {
    const { isLoaded: isAuthLoaded, isSignedIn, getToken, userId } = useAuth();
    const [profileStatus, setProfileStatus] = useState({ isLoading: true, isComplete: false, userRole: null, userDataFromDB: null });

    const updateProfileState = (userData) => {
        if (!userData) {
            setProfileStatus({ isLoading: false, isComplete: false, userRole: null, userDataFromDB: null });
            return;
        }
        setProfileStatus({ isLoading: false, isComplete: !!userData.rol, userRole: userData.rol || null, userDataFromDB: userData });
    };

    useEffect(() => {
        if (!isAuthLoaded) return;

        const fetchUserProfileFunction = async () => {
            if (!isSignedIn) {
                updateProfileState(null);
                return;
            }
            if (profileStatus.isComplete && !profileStatus.isLoading) {
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
    }, [isAuthLoaded, isSignedIn]);

    return { ...profileStatus, updateProfileState, currentClerkUserId: userId };
};

const ProtectedLayout = () => {
    const { isLoading, isComplete, updateProfileState } = useContext(ProfileStatusContext);

    if (isLoading) {
        return <div className="flex justify-center items-center h-[calc(100vh-10rem)]"><p>Verificando tu perfil...</p></div>;
    }

    if (!isComplete) {
        return <CompleteProfilePage onProfileComplete={updateProfileState} />;
    }

    return <Outlet />;
};

const AppContent = () => {
  const userProfileHookData = useUserProfileStatus();
  
  const contextValueForProvider = useMemo(() => ({
    isLoading: userProfileHookData.isLoading,
    isComplete: userProfileHookData.isComplete,
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
                    <Route path="/" element={<SignedOut><HomePageUnregistered /></SignedOut>} />
                    <Route path="/sign-in/*" element={<SignInPage />} />
                    <Route path="/sign-up/*" element={<SignUpPage />} />

                    <Route element={<SignedIn><ProtectedLayout /></SignedIn>}>
                        <Route path="/dashboard" element={<DashboardPage />} />
                        <Route path="/perfil" element={<UserProfilePage />} />
                        <Route path="/publicar-donacion" element={<NewDonationPage />} />
                        <Route path="/politicaPrivacidad" element={<PoliticaPrivacidad />} />
                        <Route path="/formularioContacto" element={<FormularioContacto />} />
                        <Route path="/politicaUsoDatos" element={<PoliticaUsoDatos />} />
                        <Route path="/preguntasFrecuentes" element={<PreguntasFrecuentes />} />
                        <Route path="/sobreNosotros" element={<SobreNosotros />} />
                        <Route path="/terminosCondiciones" element={<TerminosCondiciones />} />
                        <Route path="/formularioVoluntario" element={<FormularioVoluntario />} />

                        <Route path="/" element={<Navigate to="/dashboard" replace />} />
                    </Route>
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