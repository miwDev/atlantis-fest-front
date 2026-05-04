import { create } from "zustand";

interface User {
  id: string;
  name: string;
  role: "CLIENT" | "ARTIST" | "STAFF" | "ADMIN";
}

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;

  login: (user: User, token: string) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => {
  const savedToken = localStorage.getItem("auth_token");
  const savedUser = localStorage.getItem("auth_user");
  
  return {
    user: savedUser ? JSON.parse(savedUser) : null,
    token: savedToken,
    isAuthenticated: !!savedToken,

    login: (user, token) => {
      localStorage.setItem("auth_token", token);
      localStorage.setItem("auth_user", JSON.stringify(user));

      set({
        user: user,
        token: token,
        isAuthenticated: true,
      });
    },

    logout: () => {
      localStorage.removeItem("auth_token");
      localStorage.removeItem("auth_user");

      set({
        user: null,
        token: null,
        isAuthenticated: false,
      });
    },
  };
});
