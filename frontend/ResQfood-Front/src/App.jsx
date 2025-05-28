// src/App.jsx
import React, { useState, useEffect, createContext, useContext } from 'react'; // Añadido createContext, useContext, useState
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { SignedIn, SignedOut, useUser, ClerkLoaded, useAuth } from '@clerk/clerk-react';

import Header from './components/layout/Header'; 
import BottomNavigationBar from './components/layout/BottomNavigationBar';
import Footer from './components/layout/Footer'; // Asumiendo que tienes este componente
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
// import Location from './pages/Location';

// <<< 1. CREAR EL CONTEXTO >>>
const ProfileStatusContext = createContext(null);

// Hook personalizado para verificar el estado del perfil del usuario en NUESTRA DB
const useUserProfileStatus = () => {
  const { user: clerkUser, isLoaded: isClerkLoaded, isSignedIn } = useUser();
  const { getToken } = useAuth();
  const profileContext = useContext(ProfileStatusContext); // <<< USA EL CONTEXTO
  
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
            headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json'},
          });

          if (!response.ok) {
            if (response.status === 404) {
              console.warn(`Perfil de usuario para ${clerkUser.id} no encontrado en nuestra DB (rol aún no establecido).`);
              setProfileStatus({ isLoading: false, isComplete: false, clerkUserId: clerkUser.id, userRole: null, userDataFromDB: null });
              return;
            }
            throw new Error(`Error del servidor al obtener perfil: ${response.status} ${response.statusText}`);
          }

          const data = await response.json();
          const userFromOurDB = data.user || data; 

          if (userFromOurDB && userFromOurDB.rol) {
            console.log("(App.jsx) Perfil completo encontrado en nuestra DB:", userFromOurDB);
            setProfileStatus({ isLoading: false, isComplete: true, clerkUserId: clerkUser.id, userRole: userFromOurDB.rol, userDataFromDB: userFromOurDB });
          } else {
            console.log("(App.jsx) Perfil incompleto en nuestra DB o usuario no encontrado:", userFromOurDB);
            setProfileStatus({ isLoading: false, isComplete: false, clerkUserId: clerkUser.id, userRole: null, userDataFromDB: userFromOurDB });
          }
        } catch (error) {
          console.error("(App.jsx) Error al obtener el perfil de usuario de nuestra DB:", error);
          setProfileStatus({ isLoading: false, isComplete: false, clerkUserId: clerkUser.id, userRole: null, userDataFromDB: null });
        }
      };

      fetchUserProfile();

    } else if (isClerkLoaded && !isSignedIn) {
      setProfileStatus({ isLoading: false, isComplete: false, clerkUserId: null, userRole: null, userDataFromDB: null });
    }
    // <<< AÑADIDA DEPENDENCIA DEL CONTEXTO PARA FORZAR RE-FETCH >>>
  }, [isClerkLoaded, clerkUser, isSignedIn, getToken, profileContext?.profileLastUpdated]); 

  return profileStatus;
};

// Componente Wrapper para proteger rutas y manejar redirección a completar perfil
const ProtectedRoute = ({ children }) => {
  const { isLoading, isComplete } = useUserProfileStatus();
  const location = useLocation();

  if (isLoading) {
    return <div className="flex justify-center items-center h-[calc(100vh-10rem)]"><p>Verificando tu perfil...</p></div>;
  }

  if (!isComplete && location.pathname !== '/complete-profile') {
    console.log("(ProtectedRoute) Perfil no completo, redirigiendo a /complete-profile desde", location.pathname);
    return <Navigate to="/complete-profile" state={{ from: location }} replace />;
  }
  
  if (isComplete && location.pathname === '/complete-profile') {
    console.log("(ProtectedRoute) Perfil completo, redirigiendo desde /complete-profile a /dashboard");
    return <Navigate to="/dashboard" replace />;
  }
  return children;
};

function App() {
  // <<< 2. ESTADO PARA EL TIMESTAMP DE ACTUALIZACIÓN DEL PERFIL >>>
  const [profileLastUpdated, setProfileLastUpdated] = useState(null);

  return (
    // <<< 3. PROVEER EL CONTEXTO >>>
    <ProfileStatusContext.Provider value={{ profileLastUpdated, setProfileLastUpdated }}>
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
              <Route path="/dashboard" element={<SignedIn><ProtectedRoute><DashboardPage /></ProtectedRoute></SignedIn>} />
              <Route
                path="/complete-profile"
                element={
                  <SignedIn>
                    <ProtectedRoute>
                      {/* Pasamos la función para actualizar el timestamp al componente */}
                      <CompleteProfilePage onProfileComplete={() => setProfileLastUpdated(Date.now())} />
                    </ProtectedRoute>
                  </SignedIn>
                }
              />
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
        <BottomNavigationBar />
        <Footer/>
      </div>
    </ProfileStatusContext.Provider>
  );
}

export default App;