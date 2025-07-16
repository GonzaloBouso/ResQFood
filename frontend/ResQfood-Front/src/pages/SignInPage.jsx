import { SignIn } from "@clerk/clerk-react";
import React from 'react';

export default function SignInPage() {
  return (
    <div className="flex justify-center items-center min-h-[calc(100vh-15rem)]">
      {/* Aplicamos la misma estrategia "virtual" para el inicio de sesión */}
      <SignIn 
        routing="virtual"
        path="/sign-in" 
        signUpUrl="/sign-up"  
        fallbackRedirectUrl="/dashboard"
      />
    </div>
  );
}