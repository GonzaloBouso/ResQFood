// src/App.jsx
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { SignedIn, SignedOut } from '@clerk/clerk-react';

import Header from './components/layout/Header'; // Importa el Header
import HomePageUnregistered from './pages/HomePageUnregistered';
// Necesitarás crear estas páginas más adelante si aún no existen:
import DashboardPage from './pages/DashboardPage'; // Placeholder por ahora
import SignInPage from './pages/SignInPage';     // Ya deberías tenerla de la config de Clerk
import SignUpPage from './pages/SignUpPage';     // Ya deberías tenerla de la config de Clerk
import BottomNavigationBar from './components/layout/BottomNavigationBar';
// Componente Placeholder para DashboardPage (si no lo tienes aún)
const PlaceholderDashboardPage = () => (
  <div className="text-center py-10">
    <h1 className="text-3xl font-bold">Dashboard (Usuario Logueado)</h1>
    <p>Contenido para usuarios registrados.</p>
  </div>
);

// Componente Placeholder para SignInPage (si no lo tienes aún y Clerk no lo crea automáticamente)
const PlaceholderSignInPage = () => {
    // En la configuración anterior, usábamos <SignIn /> de Clerk.
    // Si ya tienes SignInPage.jsx con <SignIn routing="path" path="/sign-in" />, úsala.
    // Esto es solo si necesitas un placeholder MUY básico.
    const { SignIn } = require('@clerk/clerk-react'); // Importación dinámica solo para este placeholder
    return (
      <div className="flex justify-center items-center py-10">
        <SignIn routing="path" path="/sign-in" signUpUrl="/sign-up" />
      </div>
    );
};

// Componente Placeholder para SignUpPage (similar a SignInPage)
const PlaceholderSignUpPage = () => {
    const { SignUp } = require('@clerk/clerk-react'); // Importación dinámica
    return (
      <div className="flex justify-center items-center py-10">
        <SignUp routing="path" path="/sign-up" signInUrl="/sign-in" />
      </div>
    );
};


function App() {
  // Si ya tienes SignInPage.jsx y SignUpPage.jsx de la configuración de Clerk, úsalas.
  // Estos son solo ejemplos si necesitaras crearlas desde cero.
  const ActualSignInPage = SignInPage || PlaceholderSignInPage;
  const ActualSignUpPage = SignUpPage || PlaceholderSignUpPage;
  const ActualDashboardPage = DashboardPage || PlaceholderDashboardPage;


  return (
    <div className="flex flex-col min-h-screen bg-gray-50"> {/* Fondo global suave */}
      <Header />
      <main className="flex-grow container mx-auto px-4 sm:px-6 lg:px-8 py-12"> {/* Aumenté padding vertical */}
        <Routes>
          <Route
            path="/"
            element={
              <>
                <SignedIn>
                  <ActualDashboardPage />
                </SignedIn>
                <SignedOut>
                  <HomePageUnregistered />
                </SignedOut>
              </>
            }
          />
          {/* Asegúrate de que tus SignInPage y SignUpPage usen los componentes de Clerk */}
          <Route path="/sign-in/*" element={<ActualSignInPage />} /> {/* Clerk necesita el /* */}
          <Route path="/sign-up/*" element={<ActualSignUpPage />} /> {/* Clerk necesita el /* */}
          <Route
            path="/dashboard"
            element={
              <SignedIn> {/* Protege la ruta */}
                <ActualDashboardPage />
              </SignedIn>
              // Si no está logueado, Clerk lo redirigirá a /sign-in basado en la configuración
              // de <ClerkProvider> y las variables de entorno de Clerk.
            }
          />
          {/* Puedes añadir más rutas aquí */}
        </Routes>
      </main>
      <BottomNavigationBar></BottomNavigationBar>
    </div>
  );
}

export default App;