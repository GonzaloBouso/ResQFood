// src/App.jsx
import React, { useState, useEffect, useContext } from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { SignedIn, SignedOut, useUser, ClerkLoaded, useAuth } from '@clerk/clerk-react';

import Header from './components/layout/Header';
import BottomNavigationBar from './components/layout/BottomNavigationBar';
import Footer from './components/layout/Footer';
import HomePageUnregistered from './pages/HomePageUnregistered';
import DashboardPage from './pages/DashboardPage';
import SignInPage from './pages/SignInPage';
import SignUpPage from './pages/SignUpPage';
import CompleteProfilePage from './pages/CompleteProfilePage';
import UserProfilePage from './pages/UserProfilePage';

// Tus otras páginas (asegúrate que las rutas de importación sean correctas)
import PoliticaPrivacidad from './pages/PoliticaPrivacidad';
import FormularioContacto from './pages/FormularioContacto';
import PoliticaUsoDatos from './pages/PoliticaUsoDatos';
import PreguntasFrecuentes from './pages/PreguntasFrecuentes';
import SobreNosotros from './pages/SobreNosotros';
import TerminosCondiciones from './pages/TerminosCondiciones';
import FormularioVoluntario from './pages/FormularioVoluntario';

// --- IMPORTAR CONTEXTO DESDE SU NUEVO ARCHIVO ---
import { ProfileStatusContext } from './context/ProfileStatusContext'; 

// Hook personalizado para verificar el estado del perfil del usuario en NUESTRA DB
const useUserProfileStatus = () => {
  const { user: clerkUser, isLoaded: isClerkLoaded, isSignedIn } = useUser();
  const { getToken } = useAuth();

  const [profileStatus, setProfileStatus] = useState({
    isLoading: true,
    isComplete: false,
    clerkUserId: null,
    userRole: null,
    userDataFromDB: null,
  });
  
  const [fetchTrigger, setFetchTrigger] = useState(0);

  const fetchUserProfileFunction = async () => {
    if (!isSignedIn || !clerkUser) {
      console.log("(useUserProfileStatus) fetchUserProfileFunction: No hay usuario logueado o clerkUser no está listo.");
      setProfileStatus({ isLoading: false, isComplete: false, clerkUserId: clerkUser?.id || null, userRole: null, userDataFromDB: null });
      return;
    }

    console.log("(useUserProfileStatus) Iniciando fetchUserProfileFunction para clerkUserId:", clerkUser.id);
    setProfileStatus(prev => ({ ...prev, isLoading: true, clerkUserId: clerkUser.id }));
    try {
      const token = await getToken();
      const response = await fetch(`/usuario/me`, { 
        headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
      });
      console.log("(useUserProfileStatus) fetchUserProfileFunction - Respuesta recibida, status:", response.status);

      if (!response.ok) {
        if (response.status === 404) {
          console.warn(`(useUserProfileStatus) PERFIL INCOMPLETO O NO ENCONTRADO (404) para ${clerkUser.id}. Estableciendo isComplete: false.`);
          setProfileStatus({ isLoading: false, isComplete: false, clerkUserId: clerkUser.id, userRole: null, userDataFromDB: null });
          return;
        }
        const errorData = await response.text();
        console.error(`(useUserProfileStatus) Error del servidor al obtener perfil: ${response.status} ${response.statusText}. Respuesta: ${errorData}`);
        throw new Error(`Error del servidor al obtener perfil: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      const userFromOurDB = data.user || data;

      if (userFromOurDB && userFromOurDB.rol) {
        console.log("(useUserProfileStatus) PERFIL COMPLETO ENCONTRADO. Estableciendo isComplete: true. User:", JSON.stringify(userFromOurDB, null, 2));
        setProfileStatus({ isLoading: false, isComplete: true, clerkUserId: clerkUser.id, userRole: userFromOurDB.rol, userDataFromDB: userFromOurDB });
      } else {
        console.log("(useUserProfileStatus) PERFIL INCOMPLETO (sin rol o user es null/undefined). Estableciendo isComplete: false. User:", JSON.stringify(userFromOurDB, null, 2));
        setProfileStatus({ isLoading: false, isComplete: false, clerkUserId: clerkUser.id, userRole: null, userDataFromDB: userFromOurDB });
      }
    } catch (error) {
      console.error("(useUserProfileStatus) ERROR en fetchUserProfileFunction:", error);
      setProfileStatus({ isLoading: false, isComplete: false, clerkUserId: clerkUser?.id, userRole: null, userDataFromDB: null });
    }
  };

  useEffect(() => {
    console.log("(useUserProfileStatus) useEffect DISPARADO. Deps:", 
      { isClerkLoaded, isSignedIn, clerkUserId: clerkUser?.id, fetchTrigger }
    );

    if (!isClerkLoaded) {
      console.log("(useUserProfileStatus) Clerk no cargado todavía.");
      setProfileStatus(prev => ({ ...prev, isLoading: true }));
      return;
    }

    if (isSignedIn && clerkUser) {
      fetchUserProfileFunction(); 
    } else if (isClerkLoaded && !isSignedIn) {
      console.log("(useUserProfileStatus) Clerk cargado pero NO isSignedIn. Estableciendo perfil vacío.");
      setProfileStatus({ isLoading: false, isComplete: false, clerkUserId: null, userRole: null, userDataFromDB: null });
    }
  //getToken fue añadido de nuevo aquí ya que es una dependencia de fetchUserProfileFunction (indirectamente).
  //El uso de fetchTrigger debería seguir siendo la forma principal de forzar un re-fetch.
  }, [isClerkLoaded, clerkUser, isSignedIn, fetchTrigger, getToken]); 

  const refreshProfile = () => {
    console.log("(useUserProfileStatus) refreshProfile llamado. Incrementando fetchTrigger.");
    setFetchTrigger(prev => prev + 1);
  };

  return { ...profileStatus, refreshProfile };
};

// Componente Wrapper para proteger rutas y manejar redirección a completar perfil
const ProtectedRoute = ({ children }) => {
  const profileStatusContextValue = useContext(ProfileStatusContext); // Renombrar para evitar confusión con el estado local
  const location = useLocation();

  // Desestructurar con valores por defecto por si profileStatusContextValue es null/undefined inicialmente
  // o si sus propiedades son undefined.
  const { 
    isLoadingUserProfile = true, // Default a true si no está definido o es undefined
    isProfileComplete = false    // Default a false si no está definido o es undefined
  } = profileStatusContextValue || {}; // Si profileStatusContextValue es null/undefined, usar objeto vacío

  console.log("(ProtectedRoute) EVALUANDO. Path:", location.pathname, 
    "Effective_isLoading:", isLoadingUserProfile, 
    "Effective_isComplete:", isProfileComplete
  );

  if (isLoadingUserProfile) { // Ya no necesitamos el chequeo de undefined aquí si tenemos defaults
    console.log("(ProtectedRoute) MOSTRANDO 'Verificando tu perfil...'");
    return <div className="flex justify-center items-center h-[calc(100vh-10rem)]"><p>Verificando tu perfil...</p></div>;
  }

  if (!isProfileComplete && location.pathname !== '/complete-profile') {
    console.log("(ProtectedRoute) Perfil NO completo Y NO en /complete-profile. REDIRIGIENDO a /complete-profile.");
    return <Navigate to="/complete-profile" state={{ from: location }} replace />;
  }

  if (isProfileComplete && location.pathname === '/complete-profile') {
    console.log("(ProtectedRoute) Perfil COMPLETO Y EN /complete-profile. REDIRIGIENDO a /dashboard.");
    return <Navigate to="/dashboard" replace />;
  }

  console.log("(ProtectedRoute) DEVOLVIENDO children para path:", location.pathname);
  return children;
};

function App() {
  const userProfileData = useUserProfileStatus(); 
  
  console.log("(App component) userProfileData from hook:", JSON.stringify(userProfileData, null, 2));

  return (
    <ProfileStatusContext.Provider
      value={{ // Pasar los valores directamente desde userProfileData
        isLoadingUserProfile: userProfileData.isLoading,
        isProfileComplete: userProfileData.isComplete,
        currentUserRole: userProfileData.userRole,
        currentUserDataFromDB: userProfileData.userDataFromDB,
        currentClerkUserId: userProfileData.clerkUserId
        // No es necesario pasar refreshProfile aquí si App lo llama directamente en onProfileComplete
      }}
    >
      <div className="flex flex-col min-h-screen bg-gray-50">
        <Header />
        <main className="flex-grow container mx-auto px-4 sm:px-6 lg:px-8 py-12 pb-24 md:pb-12">
          <ClerkLoaded>
            <Routes>
              <Route
                path="/"
                element={
                  <>
                    <SignedIn>
                      <ProtectedRoute><DashboardPage /></ProtectedRoute>
                    </SignedIn>
                    <SignedOut><HomePageUnregistered /></SignedOut>
                  </>
                }
              />
              <Route path="/sign-in/*" element={<SignInPage />} />
              <Route path="/sign-up/*" element={<SignUpPage />} />
              <Route
                path="/dashboard"
                element={
                  <SignedIn><ProtectedRoute><DashboardPage /></ProtectedRoute></SignedIn>
                }
              />
              <Route
                path="/complete-profile"
                element={
                  <SignedIn>
                    <ProtectedRoute>
                      <CompleteProfilePage onProfileComplete={() => {
                        console.log("(App component) onProfileComplete llamado. Llamando a userProfileData.refreshProfile().");
                        userProfileData.refreshProfile(); // Llamar a la función de refresh del hook
                      }} />
                    </ProtectedRoute>
                  </SignedIn>
                }
              />
              <Route
                path="/perfil"
                element={
                  <SignedIn><ProtectedRoute><UserProfilePage /></ProtectedRoute></SignedIn>
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
}

export default App;