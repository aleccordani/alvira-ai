"use client";

import { createContext, useEffect, useState, ReactNode } from "react";
import { getMeRequest, loginRequest } from "@/services/auth";
import { getToken, removeToken, saveToken } from "@/lib/token";

type User = {
  id: string;
  name: string;
  email: string;
  avatar: string | null;
  planId: string | null;
  createdAt?: string;
};

type AuthContextValue = {
  user: User | null;
  token: string | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  refreshUser: () => Promise<void>;
};

export const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const refreshUser = async () => {
    const response = await getMeRequest();
    setUser(response.data);
  };

  const login = async (email: string, password: string) => {
    const response = await loginRequest(email, password);

    const accessToken = response.data.token;

    saveToken(accessToken);
    setToken(accessToken);
    setUser(response.data.user);
  };

  const logout = () => {
    removeToken();
    setToken(null);
    setUser(null);
    window.location.href = "/login";
  };

  useEffect(() => {
    const initAuth = async () => {
      try {
        const savedToken = getToken();

        if (!savedToken) {
          setLoading(false);
          return;
        }

        setToken(savedToken);
        await refreshUser();
      } catch {
        removeToken();
        setUser(null);
        setToken(null);
      } finally {
        setLoading(false);
      }
    };

    initAuth();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        login,
        logout,
        refreshUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
