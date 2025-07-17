import { SignUp } from "@clerk/clerk-react";
import React from 'react';

export default function SignUpPage() {
  return (
    <div className="flex justify-center items-center min-h-[calc(100vh-15rem)]">
      {/* 
        LA SOLUCIÓN REAL:
        Cuando se usa routing="virtual", la propiedad "path" debe ser eliminada.
        Son mutuamente excluyentes.
      */}
      <SignUp 
        routing="virtual" 
        signInUrl="/sign-in" 
        fallbackRedirectUrl="/dashboard" 
      />
    </div>
  );
}