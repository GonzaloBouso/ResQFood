// src/App.jsx
import React, { useState, useEffect, createContext, useContext } from 'react';
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

import UserProfilePage from './pages/UserProfilePage'; // <<< NUEVA IMPORTACIÓN

// Tus otras páginas
// import PerfilUsuarioGeneral from './pages/PerfilUsuarioGeneral'; // Ya no se usa directamente aquí
import PoliticaPrivacidad from './pages/PoliticaPrivacidad';
import FormularioContacto from './pages/FormularioContacto';
import PoliticaUsoDatos from './pages/PoliticaUsoDatos';
import PreguntasFrecuentes from './pages/PreguntasFrecuentes';
import SobreNosotros from './pages/SobreNosotros';
import TerminosCondiciones from './pages/TerminosCondiciones';
import FormularioVoluntario from './pages/FormularioVoluntario';
// import Location from './pages/Location';

// --- CONTEXTO ---
// Mueve la definición del contexto fuera del componente App si es exportado
export const ProfileStatusContext = createContext(null);

// Hook personalizado para verificar el estado del perfil del usuario en NUESTRA DB
const useUserProfileStatus = () => {
  const { user: clerkUser, isLoaded: isClerkLoaded, isSignedIn } = useUser();
  const { getToken } = useAuth();
  const profileContextValue = useContext(ProfileStatusContext); // Para acceder a profileLastUpdated

  const [profileStatus, setProfileStatus] = useState({
    isLoading: true,
    isComplete: false,
    clerkUserId: null,
    userRole: null,
    userDataFromDB: null,
  });

  useEffect(() => {
    if (!isClerkLoaded) {
      setProfileStatus(prev => ({ ...prev, isLoading: true }));
      return;
    }

    if (isSignedIn && clerkUser) {
      setProfileStatus(prev => ({ ...prev, clerkUserId: clerkUser.id, isLoading: true }));

      const fetchUserProfile = async () => {
        try {
          const token = await getToken();
          const response = await fetch(`/usuario/me`, {
            headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
          });

          if (!response.ok) {
            if (response.status === 404) {
              console.warn(`(useUserProfileStatus) Perfil de usuario para ${clerkUser.id} no encontrado en DB (rol no seteado).`);
              setProfileStatus({ isLoading: false, isComplete: false, clerkUserId: clerkUser.id, userRole: null, userDataFromDB: null });
              return;
            }
            throw new Error(`Error del servidor al obtener perfil: ${response.status} ${response.statusText}`);
          }

          const data = await response.json();
          const userFromOurDB = data.user || data;

          if (userFromOurDB && userFromOurDB.rol) {
            console.log("(useUserProfileStatus) Perfil completo encontrado en DB:", userFromOurDB);
            setProfileStatus({ isLoading: false, isComplete: true, clerkUserId: clerkUser.id, userRole: userFromOurDB.rol, userDataFromDB: userFromOurDB });
          } else {
            console.log("(useUserProfileStatus) Perfil incompleto en DB o usuario no encontrado:", userFromOurDB);
            setProfileStatus({ isLoading: false, isComplete: false, clerkUserId: clerkUser.id, userRole: null, userDataFromDB: userFromOurDB });
          }
        } catch (error) {
          console.error("(useUserProfileStatus) Error al obtener el perfil de usuario de DB:", error);
          setProfileStatus({ isLoading: false, isComplete: false, clerkUserId: clerkUser.id, userRole: null, userDataFromDB: null });
        }
      };

      fetchUserProfile();

    } else if (isClerkLoaded && !isSignedIn) {
      setProfileStatus({ isLoading: false, isComplete: false, clerkUserId: null, userRole: null, userDataFromDB: null });
    }
  }, [isClerkLoaded, clerkUser, isSignedIn, getToken, profileContextValue?.profileLastUpdated]);

  return profileStatus;
};

// Componente Wrapper para proteger rutas y manejar redirección a completar perfil
const ProtectedRoute = ({ children }) => {
  const profileStatus = useContext(ProfileStatusContext); // Usar el contexto directamente
  const location = useLocation();

  if (profileStatus.isLoadingUserProfile) { // Usar el nombre del contexto
    return <div className="flex justify-center items-center h-[calc(100vh-10rem)]"><p>Verificando tu perfil...</p></div>;
  }

  if (!profileStatus.isProfileComplete && location.pathname !== '/complete-profile') {
    console.log("(ProtectedRoute) Perfil no completo, redirigiendo a /complete-profile desde", location.pathname);
    return <Navigate to="/complete-profile" state={{ from: location }} replace />;
  }

  if (profileStatus.isProfileComplete && location.pathname === '/complete-profile') {
    console.log("(ProtectedRoute) Perfil completo, redirigiendo desde /complete-profile a /dashboard");
    return <Navigate to="/dashboard" replace />;
  }
  return children;
};

function App() {
  const [profileLastUpdated, setProfileLastUpdated] = useState(null);
  const { isLoading, isComplete, userRole, userDataFromDB, clerkUserId } = useUserProfileStatus();

  return (
    <ProfileStatusContext.Provider
      value={{
        profileLastUpdated,
        setProfileLastUpdated,
        isLoadingUserProfile: isLoading,
        isProfileComplete: isComplete,
        currentUserRole: userRole,
        currentUserDataFromDB: userDataFromDB,
        currentClerkUserId: clerkUserId
      }}
    >
      <div className="flex flex-col min-h-screen bg-gray-50">
        <Header /> {/* Header ahora puede consumir ProfileStatusContext */}
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
                    {/* ProtectedRoute internamente decidirá si mostrar o redirigir */}
                    <ProtectedRoute>
                      <CompleteProfilePage onProfileComplete={() => setProfileLastUpdated(Date.now())} />
                    </ProtectedRoute>
                  </SignedIn>
                }
              />
              {/* <<< RUTA DE PERFIL GENÉRICA >>> */}
              <Route
                path="/perfil"
                element={
                  <SignedIn><ProtectedRoute><UserProfilePage /></ProtectedRoute></SignedIn>
                }
              />
              {/* Ya no necesitas /perfilGeneral aquí si usas /perfil */}
              {/* <Route path="/perfilGeneral" element={<SignedIn><ProtectedRoute><PerfilUsuarioGeneral /></ProtectedRoute></SignedIn>} /> */}
              
              <Route path="/politicaPrivacidad" element={<PoliticaPrivacidad />} />
              <Route path="/formularioContacto" element={<FormularioContacto />} />
              <Route path="/politicaUsoDatos" element={<PoliticaUsoDatos />} />
              <Route path="/preguntasFrecuentes" element={<PreguntasFrecuentes />} />
              <Route path="/sobreNosotros" element={<SobreNosotros />} />
              <Route path="/terminosCondiciones" element={<TerminosCondiciones />} />
              <Route path="/formulario-voluntario" element={<FormularioVoluntario />} />
              {/* <Route path="/buscar-alimentos" element={<Location />}/> */}
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