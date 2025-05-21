import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { SignedIn, SignedOut } from '@clerk/clerk-react';

import Header from './components/layout/Header'; 
import HomePageUnregistered from './pages/HomePageUnregistered';

import DashboardPage from './pages/DashboardPage'; 
import SignInPage from './pages/SignInPage';     
import SignUpPage from './pages/SignUpPage';     
import BottomNavigationBar from './components/layout/BottomNavigationBar';
import PerfilUsuarioGeneral from './pages/PerfilUsuarioGeneral';
import PoliticaPrivacidad from './pages/PoliticaPrivacidad';
import FormularioContacto from './pages/FormularioContacto';
import PoliticaUsoDatos from './pages/PoliticaUsoDatos';
import PreguntasFrecuentes from './pages/PreguntasFrecuentes';
import SobreNosotros from './pages/SobreNosotros';
import TerminosCondiciones from './pages/TerminosCondiciones';
const PlaceholderDashboardPage = () => (
  <div className="text-center py-10">
    <h1 className="text-3xl font-bold">Dashboard (Usuario Logueado)</h1>
    <p>Contenido para usuarios registrados.</p>
  </div>
);


const PlaceholderSignInPage = () => {
  
    const { SignIn } = require('@clerk/clerk-react');
    return (
      <div className="flex justify-center items-center py-10">
        <SignIn routing="path" path="/sign-in" signUpUrl="/sign-up" />
      </div>
    );
};

const PlaceholderSignUpPage = () => {
    const { SignUp } = require('@clerk/clerk-react'); 
    return (
      <div className="flex justify-center items-center py-10">
        <SignUp routing="path" path="/sign-up" signInUrl="/sign-in" />
      </div>
    );
};


function App() {
  
  const ActualSignInPage = SignInPage || PlaceholderSignInPage;
  const ActualSignUpPage = SignUpPage || PlaceholderSignUpPage;
  const ActualDashboardPage = DashboardPage || PlaceholderDashboardPage;


  return (
    <div className="flex flex-col min-h-screen bg-gray-50"> 
      <Header />
      <main className="flex-grow container mx-auto px-4 sm:px-6 lg:px-8 py-12"> 
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
          
          <Route path="/sign-in/*" element={<ActualSignInPage />} />
          <Route path="/sign-up/*" element={<ActualSignUpPage />} />
          <Route
            path="/dashboard"
            element={
              <SignedIn> 
                <ActualDashboardPage />
              </SignedIn>
             
            }
          />

          <Route path="/perfilGeneral" element={<PerfilUsuarioGeneral />} />
          <Route path="/politicaPrivacidad" element={<PoliticaPrivacidad />} />
          <Route path="/formularioContacto" element={<FormularioContacto />} />
          <Route path="/politicaUsoDatos" element={<PoliticaUsoDatos />} />
          <Route path="/preguntasFrecuentes" element={<PreguntasFrecuentes />} />
          <Route path="/sobreNosotros" element={<SobreNosotros />} />
          <Route path="/terminosCondiciones" element={<TerminosCondiciones />} />

          
        </Routes>
      </main>
      <BottomNavigationBar></BottomNavigationBar>
    </div>
  );
}

export default App;