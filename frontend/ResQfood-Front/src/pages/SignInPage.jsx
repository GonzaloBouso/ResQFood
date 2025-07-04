// src/pages/SignInPage.jsx
import { SignIn } from "@clerk/clerk-react";
import React from 'react';

export default function SignInPage() {
  return (
    <div className="flex justify-center items-center min-h-[calc(100vh-15rem)]"> {/* Centrado vertical y padding */}
      <SignIn path="/sign-in" routing="path" signUpUrl="/sign-up"  afterSignOutUrl="/dashboard"/>
    </div>
  );
}