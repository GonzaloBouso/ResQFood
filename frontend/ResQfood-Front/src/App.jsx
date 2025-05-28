// src/App.jsx
import React from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { SignedIn, SignedOut, useUser, ClerkLoaded, useAuth } from '@clerk/clerk-react';

import Header from './components/layout/Header'; 
import BottomNavigationBar from './components/layout/BottomNavigationBar'; // Visible solo en móvil
import Footer from './components/layout/Footer'; // Footer estándar
import HomePageUnregistered from './pages/HomePageUnregistered';
import DashboardPage from './pages/DashboardPage'; 
import SignInPage from './pages/SignInPage';     
import SignUpPage from './pages/SignUpPage';     
import CompleteProfilePage from './pages/CompleteProfilePage';

// Tus otras páginas
import PerfilUsuarioGeneral from './pages/PerfilUsuarioGeneral';
import PoliticaPrivacidad from './pages/PoliticaPrivacidad';
import FormularioContacto from './pages/FormularioContacto';
import PoliticaUsoDatos from './pages/PoliticaUsoDatos';
import PreguntasFrecuentes from './pages/PreguntasFrecuentes';
import SobreNosotros from './pages/SobreNosotros';
import TerminosCondiciones from './pages/TerminosCondiciones';
import FormularioVoluntario from './pages/FormularioVoluntario';
// import Location from './pages/Location'; // Asegúrate de que este componente exista o elimina la ruta

// Hook useUserProfileStatus (sin cambios respecto a la versión anterior completa que te di)
const useUserProfileStatus = () => {
  const { user: clerkUser, isLoaded: isClerkLoaded, isSignedIn } = useUser();
  const { getToken } = useAuth();
  const [profileStatus, setProfileStatus] = React.useState({ 
    isLoading: true, isComplete: false, clerkUserId: null, userRole: null, userDataFromDB: null,
  });

  React.useEffect(() => {
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
            headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json'},
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
          console.error("Error al obtener perfil:", error);
          setProfileStatus({ isLoading: false, isComplete: false, clerkUserId: clerkUser.id, userRole: null, userDataFromDB: null });
        }
      };
      fetchUserProfile();
    } else if (isClerkLoaded && !isSignedIn) {
      setProfileStatus({ isLoading: false, isComplete: false, clerkUserId: null, userRole: null, userDataFromDB: null });
    }
  }, [isClerkLoaded, clerkUser, isSignedIn, getToken]);
  return profileStatus;
};

// Componente ProtectedRoute (sin cambios)
const ProtectedRoute = ({ children }) => {
  const { isLoading, isComplete } = useUserProfileStatus();
  const location = useLocation();
  if (isLoading) {
    return <div className="flex justify-center items-center h-[calc(100vh-10rem)]"><p>Verificando tu perfil...</p></div>;
  }
  if (!isComplete && location.pathname !== '/complete-profile') {
    return <Navigate to="/complete-profile" state={{ from: location }} replace />;
  }
  if (isComplete && location.pathname === '/complete-profile') {
    return <Navigate to="/dashboard" replace />;
  }
  return children;
};

function App() {
  return (
    <div className="flex flex-col min-h-screen bg-gray-50"> 
      <Header />
      {/* 
        Ajuste del padding-bottom en <main>:
        - En pantallas pequeñas (donde BottomNavigationBar es visible y tiene ~h-16 o 64px),
          necesitamos un padding inferior mayor, ej. pb-20 (80px) o pb-24 (96px) para asegurar
          que el contenido no quede oculto.
        - En pantallas 'md' y superiores, BottomNavigationBar se oculta, por lo que
          el padding inferior puede ser el normal (ej. md:pb-12) o el que necesite el Footer.
      */}
      <main className="flex-grow container mx-auto px-4 sm:px-6 lg:px-8 py-12 pb-24 md:pb-12">
        <ClerkLoaded>
          <Routes>
            {/* ... (Todas tus rutas como las tenías, asegurándote de que los componentes existan) ... */}
            <Route
              path="/"
              element={
                <>
                  <SignedIn>
                    <ProtectedRoute>
                      <DashboardPage />
                    </ProtectedRoute>
                  </SignedIn>
                  <SignedOut>
                    <HomePageUnregistered />
                  </SignedOut>
                </>
              }
            />
            <Route path="/sign-in/*" element={<SignInPage />} />
            <Route path="/sign-up/*" element={<SignUpPage />} />
            <Route path="/dashboard" element={<SignedIn><ProtectedRoute><DashboardPage /></ProtectedRoute></SignedIn>} />
            <Route path="/complete-profile" element={<SignedIn><ProtectedRoute><CompleteProfilePage /></ProtectedRoute></SignedIn>} />
            <Route path="/perfilGeneral" element={<SignedIn><ProtectedRoute><PerfilUsuarioGeneral /></ProtectedRoute></SignedIn>} />
            <Route path="/politicaPrivacidad" element={<PoliticaPrivacidad />} />
            <Route path="/formularioContacto" element={<FormularioContacto />} />
            <Route path="/politicaUsoDatos" element={<PoliticaUsoDatos />} />
            <Route path="/preguntasFrecuentes" element={<PreguntasFrecuentes />} />
            <Route path="/sobreNosotros" element={<SobreNosotros />} /> 
            <Route path="/terminosCondiciones" element={<TerminosCondiciones />} />
            <Route path="/formulario-voluntario" element={<FormularioVoluntario />}/>
            {/* <Route path="/buscar-alimentos" element={<Location />}/> */}
          </Routes>
        </ClerkLoaded>
      </main>
      <BottomNavigationBar /> {/* Se mostrará/ocultará con md:hidden */}
      <Footer/> {/* El Footer estándar al final del flujo del documento */}
    </div>
  );
}

export default App;