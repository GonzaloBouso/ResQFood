import { SignUp } from "@clerk/clerk-react";
import React from 'react';

export default function SignUpPage() {
  return (
    <div className="flex justify-center items-center min-h-[calc(100vh-15rem)]">
      {/* 
        LA SOLUCIÓN FINAL:
        Redirigimos al Dashboard, que es la página principal para usuarios logueados.
        Una vez allí, nuestro componente <ProtectedRoute> (definido en App.jsx) detectará 
        que el perfil no está completo y realizará una redirección interna (client-side) 
        a /complete-profile, evitando el error 404 de Vercel.
      */}
      <SignUp 
        routing="virtual" 
        signInUrl="/sign-in" 
        fallbackRedirectUrl="/dashboard" 
      />
    </div>
  );
}