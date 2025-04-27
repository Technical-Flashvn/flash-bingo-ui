"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation"; // Nếu đang dùng Next.js
// import { useNavigate } from 'react-router-dom'; // Nếu dùng React Router

export const RequireAuthentication = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const router = useRouter();
  // const navigate = useNavigate(); // nếu là React Router thì bật dòng này

  useEffect(() => {
    const checkAuth = () => {
      const storedAuth = localStorage.getItem("auth-storage");
      if (!storedAuth) {
        router.push("/auth"); // hoặc navigate('/login')
        return;
      }

      try {
        const parsed = JSON.parse(storedAuth);
        if (!parsed?.state?.user) {
          router.push("/auth");
        }
      } catch (error) {
        console.error("Failed to parse auth-storage from localStorage", error);
        router.push("/auth");
      }
    };

    checkAuth(); // Check ngay khi load

    const handleStorageChange = () => {
      checkAuth(); // Re-check nếu localStorage thay đổi
    };

    window.addEventListener("storage", handleStorageChange);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, [router]);

  return <>{children}</>;
};
