'use client';
import toast from 'react-hot-toast';

import { logOut } from '@/services/auth';
import { MdLogout } from 'react-icons/md';
import { useRouter } from 'next/navigation';

import { Button } from '@/components/ui/button';
import { useConfirm } from '@/components/use-confirm';
import { useAuthStore } from '@/services/auth-store';

interface User {
  _id: string;
  username: string;
  email: string;
}

interface DashboardHeaderProps {
  user: User;
}

export const DashboardHeader = ({ user }: DashboardHeaderProps) => {
  const router = useRouter();
  const setUser = useAuthStore((state) => state.setUser); // Zustand store to clear user
  const [ConfirmDialog, confirm] = useConfirm(
    'Do you want to log out?',
    'Please confirm, see you later 👋',
  );

  const handleLogOut = async () => {
    const confirmed = await confirm();
    if (!confirmed) return;
    try {
      await logOut();
      router.replace('/auth');
      setUser(null); // Clear user from Zustand store
    } catch (error) {
      toast.error('Something went wrong while logging out.');
      //console.error('Error while logging out:', error);
    }
  };

  if (!user) return null;

  return (
    <>
      <ConfirmDialog />
      <header className="flex items-center justify-between px-6 py-4 border-b shadow-md bg-white sticky top-0 z-10">
        <div>
          <h1 className="text-lg font-semibold">
            Hi! Welcome, <span className="text-sky-500">{user.username}</span>!
          </h1>
          <p className="text-sm text-muted-foreground">{user.email}</p>
        </div>
        <Button
          variant="outline"
          className="border-red-500 hover:bg-red-500 text-red-500 hover:text-white"
          onClick={handleLogOut}
        >
          <MdLogout className="w-6 h-6 " />
        </Button>
      </header>
    </>
  );
};