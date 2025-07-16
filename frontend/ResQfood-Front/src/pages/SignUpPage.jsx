import { SignUp } from "@clerk/clerk-react";
import React from 'react';

export default function SignUpPage() {
  return (
    <div className="flex justify-center items-center min-h-[calc(100vh-15rem)]">
      {/* 
        CORRECCIÓN FINAL:
        La propiedad 'afterSignUpUrl' está obsoleta (deprecated) en las nuevas versiones de Clerk.
        La propiedad recomendada ahora es 'fallbackRedirectUrl' para redirigir después de un registro exitoso.
      */}
      <SignUp 
        path="/sign-up" 
        routing="path" 
        signInUrl="/sign-in" 
        fallbackRedirectUrl="/complete-profile" 
      />
    </div>
  );
}