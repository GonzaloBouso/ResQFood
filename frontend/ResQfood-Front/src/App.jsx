import React, { useState, useEffect, useContext, useMemo, useCallback } from 'react';
import { Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { SignedIn, ClerkLoaded, useAuth } from '@clerk/clerk-react';
import { useJsApiLoader } from '@react-google-maps/api';
import { Toaster } from 'react-hot-toast';

import Header from './components/layout/Header';
import BottomNavigationBar from './components/layout/BottomNavigationBar';
import Footer from './components/layout/Footer';
import HomePageUnregistered from './pages/HomePageUnregistered';
import DashboardPage from './pages/DashboardPage';
import SignInPage from './pages/SignInPage';
import SignUpPage from './pages/SignUpPage';
import CompleteProfilePage from './pages/CompleteProfilePage';
import UserProfilePage from './pages/UserProfilePage';
import MiPerfilPage from './pages/MiPerfilPage';
import NewDonationPage from './pages/NewDonationPage';
import MyDonationsPage from './pages/MyDonationsPage';
import MyRequestsPage from './pages/MyRequestsPage';
import PoliticaPrivacidad from './pages/PoliticaPrivacidad';
import FormularioContacto from './pages/FormularioContacto';
import PoliticaUsoDatos from './pages/PoliticaUsoDatos';
import PreguntasFrecuentes from './pages/PreguntasFrecuentes';
import SobreNosotros from './pages/SobreNosotros';
import TerminosCondiciones from './pages/TerminosCondiciones';
import FormularioVoluntario from './pages/FormularioVoluntario';
import AdminDashboardPage from './pages/AdminDashboardPage.jsx';

import { useSocket } from './hooks/useSocket';
import { ProfileStatusContext } from './context/ProfileStatusContext';
import API_BASE_URL from './api/config.js';

const GOOGLE_MAPS_API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
const libraries = ['places'];

const RootRedirector = () => {
  const { isSignedIn, isLoaded } = useAuth();
  if (!isLoaded) return <div className="text-center py-20">Cargando...</div>;
  if (isSignedIn) return <Navigate to="/dashboard" replace />;
  return <HomePageUnregistered />;
};

const useGlobalState = () => {
  const { isLoaded: isAuthLoaded, isSignedIn, getToken, userId } = useAuth();

  const [profileStatus, setProfileStatus] = useState({
    isLoadingUserProfile: true,
    isComplete: false,
    currentUserRole: null,
    currentUserDataFromDB: null,
  });

  const [activeSearchLocation, setActiveSearchLocation] = useState(null);
  const [donationCreationTimestamp, setDonationCreationTimestamp] = useState(Date.now());
  const [searchQuery, setSearchQuery] = useState('');
  const [notifications, setNotifications] = useState([]);

  const DONATION_NOTIFICATION_TYPES = useMemo(() => ['SOLICITUD', 'HORARIO_CONFIRMADO', 'HORARIO_RECHAZADO', 'GENERAL'], []);
  const REQUEST_NOTIFICATION_TYPES = useMemo(() => ['APROBACION', 'RECHAZO', 'ENTREGA'], []);

  const unreadCount = useMemo(() => notifications.filter(n => !n.leida).length, [notifications]);

  const hasNewDonationNotifications = useMemo(
    () => notifications.some(n => !n.leida && DONATION_NOTIFICATION_TYPES.includes(n.tipoNotificacion)),
    [notifications, DONATION_NOTIFICATION_TYPES]
  );

  const hasNewRequestNotifications = useMemo(
    () => notifications.some(n => !n.leida && REQUEST_NOTIFICATION_TYPES.includes(n.tipoNotificacion)),
    [notifications, REQUEST_NOTIFICATION_TYPES]
  );

  const updateProfileState = useCallback(userData => {
    setProfileStatus({
      isLoadingUserProfile: false,
      isComplete: !!userData?.rol,
      currentUserRole: userData?.rol || null,
      currentUserDataFromDB: userData,
    });
  }, []);

  const triggerDonationReFetch = () => {
    setDonationCreationTimestamp(Date.now());
  };

  const addNotification = useCallback(newNotification => {
    setNotifications(prev => {
      if (prev.some(n => n._id === newNotification._id)) return prev;
      return [newNotification, ...prev];
    });
  }, []);

  useEffect(() => {
    if (!isAuthLoaded) return;

    const resetUserState = () => {
      updateProfileState(null);
      setActiveSearchLocation(null);
      setNotifications([]);
    };

    const fetchUserProfileFunction = async () => {
      if (!isSignedIn) {
        resetUserState();
        return;
      }

      resetUserState();
      setProfileStatus(prev => ({ ...prev, isLoadingUserProfile: true }));

      try {
        const token = await getToken();

        const profileResponse = await fetch(`${API_BASE_URL}/api/usuario/me`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (profileResponse.status === 404) {
          setProfileStatus({
            isLoadingUserProfile: false,
            isComplete: false,
            currentUserRole: null,
            currentUserDataFromDB: null,
          });
          return;
        }

        if (!profileResponse.ok) {
          const errorData = await profileResponse.json();
          throw new Error(errorData.message || 'Error al obtener el perfil.');
        }

        const profileData = await profileResponse.json();
        updateProfileState(profileData.user);

        try {
          const notificationsResponse = await fetch(`${API_BASE_URL}/api/notificacion`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          if (notificationsResponse.ok) {
            const notificationsData = await notificationsResponse.json();
            setNotifications(notificationsData.notificaciones || []);
          } else {
            console.warn('No se pudieron cargar las notificaciones.');
          }
        } catch (notifError) {
          console.error('Error al obtener notificaciones:', notifError);
        }
      } catch (error) {
        console.error('Error crítico en fetchUserProfileFunction:', error.message);
        resetUserState();
      }
    };

    fetchUserProfileFunction();
  }, [isAuthLoaded, isSignedIn, getToken, updateProfileState]);

  return {
    ...profileStatus,
    updateProfileState,
    currentClerkUserId: userId,
    activeSearchLocation,
    setActiveSearchLocation,
    donationCreationTimestamp,
    triggerDonationReFetch,
    searchQuery,
    setSearchQuery,
    notifications,
    setNotifications,
    unreadCount,
    addNotification,
    hasNewRequestNotifications,
    hasNewDonationNotifications,
  };
};

const ProtectedLayout = ({ adminOnly = false }) => {
    const { isLoadingUserProfile, isComplete, currentUserRole, currentUserDataFromDB } = useContext(ProfileStatusContext);

    // 1. Muestra un loader mientras la petición del perfil está en curso.
    if (isLoadingUserProfile) {
        return <div className="flex justify-center items-center h-[calc(100vh-10rem)]"><p>Verificando tu perfil...</p></div>;
    }

    // 2. --- LA CORRECCIÓN CLAVE ---
    // Si la carga terminó pero NO hay datos de usuario, significa que algo falló.
    // NO intentamos renderizar la página hija. Esto detiene la "race condition".
    if (!currentUserDataFromDB) {
        return <div className="text-center py-20">Error al cargar datos de sesión. Por favor, refresca la página.</div>;
    }

    // 3. Si el perfil no está completo, SIEMPRE redirige a la página para completarlo.
    if (!isComplete) {
        return <CompleteProfilePage onProfileComplete={useContext(ProfileStatusContext).updateProfileState} />;
    }
    
    // 4. Lógica para el rol de admin
    if (adminOnly && currentUserRole !== 'ADMIN') {
        return <Navigate to="/dashboard" replace />;
    }

    // 5. Solo si TODAS las comprobaciones anteriores pasan, se permite el renderizado de la página hija.
    return <Outlet />;
};

const AppContent = () => {
  const appStateHook = useGlobalState();
  useSocket(appStateHook.addNotification);

  const contextValueForProvider = useMemo(() => appStateHook, [appStateHook]);

  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: GOOGLE_MAPS_API_KEY,
    libraries,
  });

  if (!isLoaded) {
    return <div className="text-center py-20">Cargando mapas...</div>;
  }

  return (
    <ProfileStatusContext.Provider value={contextValueForProvider}>
      <div className="flex flex-col min-h-screen bg-gray-50">
        <Toaster position="top-center" reverseOrder={false} />
        <Header />
        <main className="flex-grow container mx-auto px-4 sm:px-6 lg:px-8 py-12 pb-24 md:pb-12">
          <ClerkLoaded>
            <Routes>
              <Route path="/" element={<RootRedirector />} />
              <Route path="/sign-in/*" element={<SignInPage />} />
              <Route path="/sign-up/*" element={<SignUpPage />} />

              {/* Rutas protegidas */}
              <Route element={<SignedIn><ProtectedLayout /></SignedIn>}>
                <Route path="/dashboard" element={<DashboardPage />} />
                <Route path="/publicar-donacion" element={<NewDonationPage onDonationCreated={appStateHook.triggerDonationReFetch} />} />
                <Route path="/mis-donaciones" element={<MyDonationsPage />} />
                <Route path="/mis-solicitudes" element={<MyRequestsPage />} />
                <Route path="/mi-perfil" element={<MiPerfilPage />} />
                <Route path="/perfil/:id" element={<UserProfilePage />} />
              </Route>

              {/* Rutas de admin */}
              <Route element={<SignedIn><ProtectedLayout adminOnly={true} /></SignedIn>}>
                <Route path="/admin" element={<AdminDashboardPage />} />
              </Route>

              {/* Rutas públicas */}
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
    console.error('ADVERTENCIA: VITE_GOOGLE_MAPS_API_KEY no está definida.');
  }
  return <AppContent />;
}

export default App;
