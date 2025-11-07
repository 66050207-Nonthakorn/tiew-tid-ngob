import { googleSignIn, passwordSignIn, passwordSignUp, refreshAccessToken } from "@/lib/auth";
import { SecureStorage } from "@/lib/store";
import { create } from "zustand"
import { createJSONStorage, persist } from 'zustand/middleware'

interface AuthStore {
  accessToken: string | null,
  refreshToken: string | null,
  passwordSignUp: (email: string, name: string, password: string) => Promise<void>,
  passwordSignIn: (emailOrName: string, password: string) => Promise<void>,
  googleSignIn: () => Promise<void>,
  refreshAccessToken: () => Promise<void>
  signOut: () => void
}

export const useAuthStore = create(persist<AuthStore>(
  (set, get) => ({
    accessToken: null,
    refreshToken: null,
    refreshAccessToken: async () => {
      const token = get().refreshToken;
      if (!token) return;

      const newAccessToken = await refreshAccessToken(token);
      if (newAccessToken) {
        set({ accessToken: newAccessToken });
      }
      else {
        get().signOut();
      }
    },
    passwordSignUp: passwordSignUp,
    passwordSignIn: async (emailOrName: string, password: string) => {
      const token = await passwordSignIn(emailOrName, password);
      if (token) {
        const { accessToken, refreshToken } = token;
        set({ accessToken, refreshToken });
      }
    },
    googleSignIn: async () => {
      const token = await googleSignIn();
      if (token) {
        const { accessToken, refreshToken } = token;
        set({ accessToken, refreshToken });
      }
    },
    signOut: () => {
      set({ accessToken: null, refreshToken: null });
    }
  }), {
    name: "auth",
    storage: createJSONStorage(() => SecureStorage)
  }
));