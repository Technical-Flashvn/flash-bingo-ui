"use client";
import toast from "react-hot-toast";
import { logOut } from "@/services/auth";
import { MdLogout } from "react-icons/md";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { useConfirm } from "@/components/use-confirm";
import { useAuthStore } from "@/services/auth-store";

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
  const setUser = useAuthStore((state) => state.setUser);
  const [ConfirmDialog, confirm] = useConfirm(
    "Do you want to log out?",
    "Please confirm, see you later 👋"
  );

  const handleLogOut = async () => {
    const confirmed = await confirm();
    if (!confirmed) return;
    try {
      await logOut();
      router.replace("/auth");
      setUser(null);
    } catch (error) {
      toast.error("Something went wrong while logging out.");
    }
  };

  if (!user) return null;

  return (
    <>
      <ConfirmDialog />
      <header className="flex items-center justify-between px-6 py-4 shadow-md bg-[#1b1b62] text-white sticky top-0 z-10">
        {/* Logo + Welcome */}
        <div className="flex items-center gap-4">
          <img
            src="/FLASH_logo-white_yellow.png"
            alt="Flash Bingo Logo"
            className="w-14 h-14 object-contain"
          />

          <div className="flex flex-col leading-snug">
            <h1 className="text-lg font-semibold">
              Welcome, <span className="text-yellow-300">{user.username}</span>!
            </h1>
            <p className="text-sm text-white/70">{user.email}</p>
          </div>
        </div>

        {/* Log out button */}
        <Button
          className="bg-[#e65a00] hover:bg-orange-700 text-white cursor-pointer"
          onClick={handleLogOut}
        >
          <MdLogout className="w-6 h-6 mx-1" />
        </Button>
      </header>
    </>
  );
};
