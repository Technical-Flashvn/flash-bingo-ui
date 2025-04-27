"use client";
import { AuthScreen } from "@/features/auth/components/auth-screen";
import React from "react";
import { useAuthStore } from "@/services/auth-store";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

const AuthPage = () => {
  const router = useRouter();
  const user = useAuthStore((state) => state.user);

  useEffect(() => {
    if (user) {
      router.push("/dashboard");
    } else {
      const localUser = localStorage.getItem("auth-storage");
      if (localUser && JSON.parse(localUser).state.user) {
        router.push("/dashboard");
      }
    }
  }, [user, router]);

  if (user) {
    return null;
  }
  return <AuthScreen />;
};
export default AuthPage;
