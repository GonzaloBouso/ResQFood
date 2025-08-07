import React, { useState, useEffect, useContext, useMemo } from 'react';
import { Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { SignedIn, SignedOut, ClerkLoaded, useAuth } from '@clerk/clerk-react';
import { LoadScript } from '@react-google-maps/api';

// --- Tus componentes y páginas ---
import Header from './components/layout/Header';
import BottomNavigationBar from './components/layout/BottomNavigationBar';
import Footer from './components/layout/Footer';
import HomePageUnregistered from './pages/HomePageUnregistered';
import DashboardPage from './pages/DashboardPage';
import SignInPage from './pages/SignInPage';
import SignUpPage from './pages/SignUpPage';
import CompleteProfilePage from './pages/CompleteProfilePage';
import UserProfilePage from './pages/UserProfilePage';
import MiPerfilPage from './pages/MiPerfilPage'; // <-- Asegúrate de que esta importación exista
import NewDonationPage from './pages/NewDonationPage';
import PoliticaPrivacidad from './pages/PoliticaPrivacidad';
import FormularioContacto from './pages/FormularioContacto';
import PoliticaUsoDatos from './pages/PoliticaUsoDatos';
import PreguntasFrecuentes from './pages/PreguntasFrecuentes';
import SobreNosotros from './pages/SobreNosotros';
import TerminosCondiciones from './pages/TerminosCondiciones';
import FormularioVoluntario from './pages/FormularioVoluntario';

// --- Contexto y Configuración ---
import { ProfileStatusContext } from './context/ProfileStatusContext';
import API_BASE_URL from './api/config.js';

const GOOGLE_MAPS_API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
const libraries = ['places'];

// --- Componente para gestionar la ruta raíz de forma segura ---
const RootRedirector = () => {
  const { isSignedIn, isLoaded } = useAuth();
  if (!isLoaded) { return <div className="text-center py-20">Cargando...</div>; }
  if (isSignedIn) { return <Navigate to="/dashboard" replace />; }
  return <HomePageUnregistered />;
};

// --- Tu hook y ProtectedLayout (ya son correctos) ---
const useUserProfileAndLocation = () => {
    // ... tu lógica de hook (sin cambios) ...
};
const ProtectedLayout = () => {
    // ... tu lógica de layout (sin cambios) ...
};

const AppContent = () => {
  const appStateHook = useUserProfileAndLocation();
  
  const contextValueForProvider = useMemo(() => ({
    // ... tu lógica de contexto (sin cambios) ...
  }), [appStateHook]);

  return (
    <ProfileStatusContext.Provider value={contextValueForProvider}>
        <div className="flex flex-col min-h-screen bg-gray-50">
            <Header />
            <main className="flex-grow container mx-auto px-4 sm:px-6 lg:px-8 py-12 pb-24 md:pb-12">
            <ClerkLoaded>
                <Routes>
                    {/* --- Ruta Raíz --- */}
                    <Route path="/" element={<RootRedirector />} />
                    
                    {/* --- Rutas de Autenticación --- */}
                    <Route path="/sign-in/*" element={<SignInPage />} />
                    <Route path="/sign-up/*" element={<SignUpPage />} />

                    {/* --- Grupo de Rutas Protegidas --- */}
                    <Route element={<SignedIn><ProtectedLayout /></SignedIn>}>
                        <Route path="/dashboard" element={<DashboardPage />} />

                        {/* ================================================================== */}
                        {/* LA SOLUCIÓN FINAL ESTÁ AQUÍ */}
                        {/* ================================================================== */}
                        {/* La ruta específica "/perfil" para el usuario actual va PRIMERO. */}
                        <Route path="/perfil" element={<MiPerfilPage />} />
                        
                        {/* La ruta dinámica "/perfil/:id" para otros usuarios va DESPUÉS. */}
                        <Route path="/perfil/:id" element={<UserProfilePage />} />
                        
                        <Route path="/publicar-donacion" element={<NewDonationPage onDonationCreated={() => appStateHook.triggerDonationReFetch()} />} />
                    </Route>

                    {/* --- Ruta para Completar Perfil (fuera del ProtectedLayout) --- */}
                    <Route 
                        path="/complete-profile" 
                        element={<SignedIn><CompleteProfilePage onProfileComplete={appStateHook.updateProfileState} /></SignedIn>}
                    />

                    {/* --- Rutas Públicas de Contenido Estático --- */}
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
    if (!GOOGLE_MAPS_API_KEY) { console.error("ADVERTENCIA: VITE_GOOGLE_MAPS_API_KEY no está definida."); }
    return (<LoadScript googleMapsApiKey={GOOGLE_MAPS_API_KEY} libraries={libraries}><AppContent /></LoadScript>);
}

export default App;