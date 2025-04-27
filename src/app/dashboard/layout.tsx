"use client";

import { ReactNode, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/services/auth-store";
import { DashboardHeader } from "@/features/dashboard/components/header";
import LoaderCustom from "@/components/loader-custom/loader-custom";

export default function DashboardLayout({ children }: { children: ReactNode }) {
  const router = useRouter();
  const user = useAuthStore((state) => state.user);

  useEffect(() => {
    if (!user) {
      const localUser = localStorage.getItem("auth-storage");
      if (!localUser || !JSON.parse(localUser).state.user) {
        router.push("/auth");
      }
    }
  }, [user, router]);

  if (!user) {
    return (
      <div className="h-full flex-1 flex items-center justify-center flex-col gap-4">
        <LoaderCustom />
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen">
      <DashboardHeader user={user} />
      <div className="flex-1">{children}</div>
    </div>
  );
}
