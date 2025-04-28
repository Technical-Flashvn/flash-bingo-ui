"use client";

import { useAuthRedirect } from "@/hooks/auth-require";
import { DashboardHeader } from "@/features/dashboard/components/header";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, hasHydrated } = useAuthRedirect({ redirectIfFound: false });

  if (!hasHydrated || !user) {
    return null;
  }

  return (
    <div>
      <DashboardHeader user={user} />
      {children}
    </div>
  );
}
