import keyValue from "@/commons/key-value";
import {
  authLogout,
  IResponseAuthLogin,
  IUserInfo,
} from "@/services/apis/auth";
import create from "zustand";

interface AuthState {
  isAuthenticated: boolean;
  user: IUserInfo | null;
  login: (response: IResponseAuthLogin) => Promise<void>;
  logout: () => void;
  getWalletAddress: () => string;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  isAuthenticated: !!localStorage.getItem(keyValue.accessToken),
  ref_url: "",
  user: JSON.parse(localStorage.getItem(keyValue.user) || "null"),
  login: async (response: IResponseAuthLogin) => {
    try {
      localStorage.setItem(keyValue.accessToken, response.token);
      localStorage.setItem(
        keyValue.user,
        JSON.stringify({
          username: response.username,
          wallet_address: response.wallet_address,
          image: response.image,
          name: response.name,
        })
      );
      set({
        isAuthenticated: true,
        user: {
          username: response.username,
          wallet_address: response.wallet_address,
          image: response.image,
          name: response.name,
        },
      });
    } catch (error) {
      console.error("Login failed:", error);
      throw error;
    }
  },
  logout: () => {
    authLogout();
    localStorage.removeItem(keyValue.accessToken);
    localStorage.removeItem(keyValue.user);
    set({ isAuthenticated: false, user: null });
  },
  getWalletAddress: () => {
    const user = get().user;
    return user?.wallet_address || "Unknown";
  },
}));
