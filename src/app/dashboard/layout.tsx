// flash-bingo-ui/src/app/dashboard/layout.tsx
"use client";

import { ReactNode } from "react";
import { useAuthStore } from "@/services/auth-store";
import { DashboardHeader } from "@/features/dashboard/components/header";

export default function DashboardLayout({ children }: { children: ReactNode }) {
  const user = useAuthStore((state) => state.user);

  if (!user) return null;

  return (
    <div className="flex flex-col min-h-screen">
      <DashboardHeader user={user} />
      <div className="flex-1">{children}</div>
    </div>
  );
}
