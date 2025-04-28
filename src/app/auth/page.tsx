"use client";
import React from "react";
import { useAuthRedirect } from "@/hooks/auth-require";
import { AuthScreen } from "@/features/auth/components/auth-screen";

const AuthPage = () => {
  const { user, hasHydrated } = useAuthRedirect({
    redirectIfFound: true,
    redirectTo: '/dashboard',
  });

  if (!hasHydrated) {
    return null;
  }

  if (user) {
    return null;
  }
  return <AuthScreen />;
};
export default AuthPage;
