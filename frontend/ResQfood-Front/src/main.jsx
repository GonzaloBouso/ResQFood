import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './index.css';
import { ClerkProvider } from '@clerk/clerk-react';
import { BrowserRouter, useNavigate } from 'react-router-dom';

const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

if (!PUBLISHABLE_KEY) {
  throw new Error("Missing Publishable Key. Please set VITE_CLERK_PUBLISHABLE_KEY in your .env file.");
}

// ==================================================================
// LA SOLUCIÓN FINAL ESTÁ AQUÍ
// ==================================================================

// 1. Creamos un componente que envuelve todo y tiene acceso al hook useNavigate.
const ClerkWithRouter = () => {
  const navigate = useNavigate();

  return (
    <ClerkProvider
      publishableKey={PUBLISHABLE_KEY}
      // 2. Le pasamos explícitamente la función de navegación a Clerk.
      //    Esto resuelve cualquier conflicto de dependencias y asegura que Clerk y tu Router
      //    siempre usen la misma instancia para navegar.
      navigate={(to) => navigate(to)}
    >
      <App />
    </ClerkProvider>
  );
};


// 3. Renderizamos la aplicación envolviéndola primero en BrowserRouter
//    y luego en nuestro nuevo componente ClerkWithRouter.
ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <ClerkWithRouter />
    </BrowserRouter>
  </React.StrictMode>
);