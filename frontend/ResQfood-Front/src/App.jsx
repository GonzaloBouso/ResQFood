// src/App.jsx
import React, { useState, useEffect, useContext, createContext } from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { SignedIn, SignedOut, useUser, ClerkLoaded, useAuth } from '@clerk/clerk-react';
import { LoadScript } from '@react-google-maps/api'; // <<<--- IMPORTADO LoadScript

// Tus componentes de layout y páginas
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
// import Location from './pages/Location'; // Si tienes una página que usa componentes de mapa

// --- Contexto para el estado del perfil (si lo moviste a un archivo separado, ajusta la importación) ---
export const ProfileStatusContext = createContext(null); 

// --- Clave de API de Google Maps y Librerías ---
const GOOGLE_MAPS_API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
const libraries = ['places']; // Añade otras que necesites, como 'geometry', 'drawing'

// Hook useUserProfileStatus (sin cambios, asumiendo que está como lo teníamos)
const useUserProfileStatus = () => {
  const { user: clerkUser, isLoaded: isClerkLoaded, isSignedIn } = useUser();
  const { getToken } = useAuth();
  const profileContext = useContext(ProfileStatusContext); // Usa el contexto
  
  const [profileStatus, setProfileStatus] = useState({
    isLoading: true, isComplete: false, clerkUserId: null, userRole: null, userDataFromDB: null,
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
              setProfileStatus({ isLoading: false, isComplete: false, clerkUserId: clerkUser.id, userRole: null, userDataFromDB: null });
              return;
            }
            throw new Error(`Error del servidor: ${response.status}`);
          }
          const data = await response.json();
          const userFromOurDB = data.user || data; 
          if (userFromOurDB && userFromOurDB.rol) {
            setProfileStatus({ isLoading: false, isComplete: true, clerkUserId: clerkUser.id, userRole: userFromOurDB.rol, userDataFromDB: userFromOurDB });
          } else {
            setProfileStatus({ isLoading: false, isComplete: false, clerkUserId: clerkUser.id, userRole: null, userDataFromDB: userFromOurDB });
          }
        } catch (error) {
          console.error("(App.jsx) Error al obtener perfil:", error);
          setProfileStatus({ isLoading: false, isComplete: false, clerkUserId: clerkUser?.id, userRole: null, userDataFromDB: null });
        }
      };
      fetchUserProfile();
    } else if (isClerkLoaded && !isSignedIn) {
      setProfileStatus({ isLoading: false, isComplete: false, clerkUserId: null, userRole: null, userDataFromDB: null });
    }
  }, [isClerkLoaded, clerkUser, isSignedIn, getToken, profileContext?.profileLastUpdated]); 

  // La función refreshProfile ahora es manejada por el cambio en profileLastUpdated del contexto
  const refreshProfile = () => {
    if (profileContext && profileContext.setProfileLastUpdated) {
      profileContext.setProfileLastUpdated(Date.now());
    } else {
      console.warn("setProfileLastUpdated no está disponible en el contexto para refreshProfile");
    }
  };

  return { ...profileStatus, refreshProfile };
};

// Componente ProtectedRoute (sin cambios, asumiendo que está como lo teníamos)
const ProtectedRoute = ({ children }) => {
  const profileStatusContextValue = useContext(ProfileStatusContext);
  const location = useLocation();
  const { isLoadingUserProfile = true, isProfileComplete = false } = profileStatusContextValue || {};

  if (isLoadingUserProfile) {
    return <div className="flex justify-center items-center h-[calc(100vh-10rem)]"><p>Verificando tu perfil...</p></div>;
  }
  if (!isProfileComplete && location.pathname !== '/complete-profile') {
    return <Navigate to="/complete-profile" state={{ from: location }} replace />;
  }
  if (isProfileComplete && location.pathname === '/complete-profile') {
    return <Navigate to="/dashboard" replace />;
  }
  return children;
};

// Componente interno para el contenido de la aplicación, para envolverlo con LoadScript
const AppContent = () => {
  const userProfileData = useUserProfileStatus(); // El hook que obtiene los datos del perfil

  // Pasamos la función para actualizar el timestamp al Provider
  // Esta función ahora vendrá del estado local de App y se pasará a través de onProfileComplete
  // const { refreshProfile } = userProfileData; // No necesitamos extraerla si se pasa setProfileLastUpdated
  const { setProfileLastUpdated } = useContext(ProfileStatusContext);


  return (
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
                    <CompleteProfilePage onProfileComplete={() => {
                      console.log("(AppContent) onProfileComplete llamado. Actualizando timestamp.");
                      if (setProfileLastUpdated) setProfileLastUpdated(Date.now());
                    }} />
                  </ProtectedRoute>
                </SignedIn>
              }
            />
            <Route path="/perfil" element={<SignedIn><ProtectedRoute><UserProfilePage /></ProtectedRoute></SignedIn>} />
            <Route path="/publicar-donacion" element={<SignedIn><ProtectedRoute><NewDonationPage /></ProtectedRoute></SignedIn>} />
            {/* <Route path="/location-test" element={<Location />} /> Si tienes esta página */}
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
  );
};

// Componente App principal
function App() {
  const [profileLastUpdated, setProfileLastUpdated] = useState(null);

  // Verificar si la API key de Google Maps está presente
  if (!GOOGLE_MAPS_API_KEY) { // Solo un console.error si falta, la app sigue renderizando
    console.error("ADVERTENCIA: VITE_GOOGLE_MAPS_API_KEY no está definida. Las funciones de mapa podrían no estar disponibles o fallar.");
  }

  const profileContextValue = {
    // Estos valores vendrán del hook useUserProfileStatus que se consume DENTRO de AppContent
    // Por lo tanto, el Provider pasará las funciones para actualizar y el hook leerá el estado.
    // Lo que App necesita proveer es el estado y la función para actualizarlo.
    profileLastUpdated,
    setProfileLastUpdated,
    // Las propiedades de estado (isLoadingUserProfile, isProfileComplete, etc.)
    // serán obtenidas por useUserProfileStatus, que a su vez consume este contexto.
    // Esto crea un pequeño ciclo si el hook también depende de algo del contexto que él mismo actualiza.
    // Para evitar esto, useUserProfileStatus se queda como está, y App maneja el timestamp.
    // Y pasamos los datos del hook useUserProfileStatus que se ejecuta en App a los componentes
    // que lo necesiten directamente o a través del contexto si es más limpio.
  };

  // Obtenemos los datos del perfil aquí para pasarlos al contexto
  // Así, useUserProfileStatus puede usar el contexto para el trigger de actualización,
  // y los componentes hijos pueden usar el contexto para leer los datos.
  const userProfileDataForContext = useUserProfileStatus();
  
  const finalContextValue = {
    isLoadingUserProfile: userProfileDataForContext.isLoading,
    isProfileComplete: userProfileDataForContext.isComplete,
    currentUserRole: userProfileDataForContext.userRole,
    currentUserDataFromDB: userProfileDataForContext.userDataFromDB,
    currentClerkUserId: userProfileDataForContext.clerkUserId,
    profileLastUpdated: profileLastUpdated, // El timestamp que cambia
    setProfileLastUpdated: setProfileLastUpdated, // La función para cambiarlo
    refreshProfile: userProfileDataForContext.refreshProfile, // La función del hook
  };


  return (
    <ProfileStatusContext.Provider value={finalContextValue}>
      {GOOGLE_MAPS_API_KEY ? (
        <LoadScript
          googleMapsApiKey={GOOGLE_MAPS_API_KEY}
          libraries={libraries}
          loadingElement={<div className="text-center py-10">Cargando Google Maps API...</div>}
          // Opcional: un ID para el script tag si necesitas referenciarlo
          // id="google-maps-script" 
        >
          <AppContent />
        </LoadScript>
      ) : (
        <AppContent /> // Renderiza sin LoadScript si no hay API Key (mapas no funcionarán)
      )}
    </ProfileStatusContext.Provider>
  );
}

export default App;