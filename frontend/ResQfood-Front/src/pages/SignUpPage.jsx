// src/pages/SignUpPage.jsx
import { SignUp } from "@clerk/clerk-react";
import React from 'react';

export default function SignUpPage() {
  return (
    <div className="flex justify-center items-center min-h-[calc(100vh-15rem)]"> {/* Centrado vertical y padding */}
      <SignUp path="/sign-up" routing="path" signInUrl="/sign-in" afterSignOutUrl="/complete-profile" />
    </div>
  );
}