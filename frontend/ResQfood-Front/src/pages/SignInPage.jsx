import { SignIn } from "@clerk/clerk-react";
import React from 'react';

export default function SignInPage() {
  return (
    <div className="flex justify-center items-center min-h-[calc(100vh-15rem)]">
      <SignIn 
        routing="virtual"
        signUpUrl="/sign-up"  
        fallbackRedirectUrl="/dashboard"
      />
    </div>
  );
}