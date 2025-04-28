'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/services/auth-store';

export const useAuthRedirect = ({
  redirectIfFound = false,
  redirectTo = '/dashboard',
}: {
  redirectIfFound?: boolean;
  redirectTo?: string;
}) => {
  const router = useRouter();
  const user = useAuthStore((state) => state.user);
  const hasHydrated = useAuthStore((state) => state.hasHydrated);

  useEffect(() => {
    if (!hasHydrated) return;

    if (redirectIfFound && user) {
      // Nếu đã login mà đang ở trang login => chuyển hướng vào dashboard
      router.push(redirectTo);
    }

    if (!redirectIfFound && !user) {
      // Nếu chưa login mà vào dashboard => chuyển hướng ra login
      router.push('/auth');
    }
  }, [user, hasHydrated, router, redirectIfFound, redirectTo]);

  return { user, hasHydrated };
};
