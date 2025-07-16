import { SignUp } from "@clerk/clerk-react";
import React from 'react';

export default function SignUpPage() {
  return (
    <div className="flex justify-center items-center min-h-[calc(100vh-15rem)]">
      {/* 
        LA SOLUCIÓN FINAL:
        Cambiamos la estrategia de enrutamiento de "path" a "virtual".
        Esto evita que Clerk cambie la URL del navegador a rutas que Vercel no encuentra,
        resolviendo el error 404. Todos los pasos del registro ocurrirán en la misma URL /sign-up.
      */}
      <SignUp 
        routing="virtual" 
        path="/sign-up"
        signInUrl="/sign-in" 
        fallbackRedirectUrl="/complete-profile" 
      />
    </div>
  );
}