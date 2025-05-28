// src/App.jsx
import React from 'react';
// Fusionando importaciones de ambas versiones:
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { SignedIn, SignedOut, useUser, ClerkLoaded, useAuth } from '@clerk/clerk-react'; // Manteniendo las de la versión avanzada

import Header from './components/layout/Header'; 
import BottomNavigationBar from './components/layout/BottomNavigationBar'; // De la versión avanzada
import Footer from './components/layout/footer'; // Del stash, decidir si se queda
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
import FormularioVoluntario from './pages/FormularioVoluntario'; // Del stash
// import Location from './pages/Location'; // ¿Es './pages/Location' o 'Location' de algún otro lado? Si no existe, comentar.

// Hook personalizado para verificar el estado del perfil del usuario en NUESTRA DB (de la versión avanzada)
const useUserProfileStatus = () => {
  const { user: clerkUser, isLoaded: isClerkLoaded, isSignedIn } = useUser();
  const { getToken } = useAuth();
  
  const [profileStatus, setProfileStatus] = React.useState({ 
    isLoading: true, 
    isComplete: false, 
    clerkUserId: null, 
    userRole: null,
    userDataFromDB: null,
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
          const response = await fetch(`/usuario/me`, { // Asegúrate que el prefijo /usuario/ o /api/usuario/ sea correcto
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
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
            console.log("Perfil completo encontrado en nuestra DB:", userFromOurDB);
            setProfileStatus({ 
              isLoading: false, 
              isComplete: true, 
              clerkUserId: clerkUser.id, 
              userRole: userFromOurDB.rol,
              userDataFromDB: userFromOurDB
            });
          } else {
            console.log("Perfil incompleto en nuestra DB o usuario no encontrado:", userFromOurDB);
            setProfileStatus({ 
              isLoading: false, 
              isComplete: false, 
              clerkUserId: clerkUser.id, 
              userRole: null,
              userDataFromDB: userFromOurDB
            });
          }
        } catch (error) {
          console.error("Error al obtener el perfil de usuario de nuestra DB:", error);
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

// Componente Wrapper para proteger rutas (de la versión avanzada)
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

// Eliminamos los placeholders para SignInPage y SignUpPage si ya tienes los componentes reales.
// DashboardPage también se usa directamente.

function App() {
  return (
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
            
            <Route
              path="/dashboard"
              element={
                <SignedIn>
                  <ProtectedRoute>
                    <DashboardPage />
                  </ProtectedRoute>
                </SignedIn>
              }
            />
            <Route
              path="/complete-profile"
              element={
                <SignedIn>
                  <ProtectedRoute>
                    <CompleteProfilePage />
                  </ProtectedRoute>
                </SignedIn>
              }
            />

            {/* Tus otras rutas */}
            <Route path="/perfilGeneral" element={
              <SignedIn>
                <ProtectedRoute> 
                  <PerfilUsuarioGeneral />
                </ProtectedRoute>
              </SignedIn>
            } />
            <Route path="/politicaPrivacidad" element={<PoliticaPrivacidad />} />
            <Route path="/formularioContacto" element={<FormularioContacto />} />
            <Route path="/politicaUsoDatos" element={<PoliticaUsoDatos />} />
            <Route path="/preguntasFrecuentes" element={<PreguntasFrecuentes />} />
            <Route path="/sobreNosotros" element={<SobreNosotros />} /> 
            <Route path="/terminosCondiciones" element={<TerminosCondiciones />} />
            {/* Rutas que venían del stash (tus cambios originales) */}
            {/* <Route path="/buscar-alimentos" element={<Location />}/>  // ¿Existe el componente Location? */}
            <Route path="/formulario-voluntario" element={<FormularioVoluntario />}/>
            
          </Routes>
        </ClerkLoaded>
      </main>
      <BottomNavigationBar /> {/* De la versión avanzada */}
      <Footer/>               {/* Del stash */}
    </div>
  );
}

export default App;