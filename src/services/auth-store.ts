import { create } from 'zustand';
import { persist } from 'zustand/middleware';

type User = {
  _id: string;
  username: string;
  email: string;
};

type AuthState = {
  user: User | null;
  setUser: (user: User | null) => void;
};

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      setUser: (user) => set({ user }),
    }),
    {
      name: 'auth-storage', // tên key trong localStorage
    }
  )
);
