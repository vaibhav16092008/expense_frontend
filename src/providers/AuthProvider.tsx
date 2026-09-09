"use client";

import React, { createContext, useContext, useEffect, useState, useCallback } from "react";
import { UserProfile, LoginPayload, RegisterPayload } from "@/types/auth";
import apiClient from "@/lib/api/client";
import { normalizeApiError } from "@/lib/api/errors";

interface AuthContextType {
  user: UserProfile | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (payload: LoginPayload) => Promise<void>;
  register: (payload: RegisterPayload) => Promise<void>;
  logout: () => Promise<void>;
  refreshSession: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const fetchCurrentUser = useCallback(async () => {
    try {
      setIsLoading(true);
      const response = await apiClient.get("/auth/me");
      const userData: UserProfile = response.data?.user || response.data;
      setUser(userData);
    } catch {
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const refreshSession = useCallback(async () => {
    await fetchCurrentUser();
  }, [fetchCurrentUser]);

  useEffect(() => {
    let isMounted = true;
    
    // Initial session restoration check
    const initAuth = async () => {
      try {
        const response = await apiClient.get("/auth/me");
        const userData: UserProfile = response.data?.user || response.data;
        if (isMounted) setUser(userData);
      } catch {
        if (isMounted) setUser(null);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };

    initAuth();

    // Event listener for session expiration triggered by Axios 401 refresh failure
    const handleSessionExpired = () => {
      if (isMounted) {
        setUser(null);
        setIsLoading(false);
      }
    };

    window.addEventListener("expenseiq:session_expired", handleSessionExpired);
    return () => {
      isMounted = false;
      window.removeEventListener("expenseiq:session_expired", handleSessionExpired);
    };
  }, []);

  const login = async (payload: LoginPayload) => {
    try {
      setIsLoading(true);
      const response = await apiClient.post("/auth/login", payload);
      const { user: userData, accessToken } = response.data;

      if (accessToken) {
        localStorage.setItem("expenseiq_access_token", accessToken);
      }

      setUser(userData || { id: "demo-user", email: payload.email, fullName: "Demo User" });
    } catch (err) {
      throw normalizeApiError(err);
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (payload: RegisterPayload) => {
    try {
      setIsLoading(true);
      const response = await apiClient.post("/auth/register", payload);
      const { user: userData, accessToken } = response.data;

      if (accessToken) {
        localStorage.setItem("expenseiq_access_token", accessToken);
      }

      setUser(userData || { id: "demo-user", email: payload.email, fullName: payload.fullName });
    } catch (err) {
      throw normalizeApiError(err);
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      setIsLoading(true);
      await apiClient.post("/auth/logout").catch(() => {});
    } finally {
      localStorage.removeItem("expenseiq_access_token");
      setUser(null);
      setIsLoading(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        register,
        logout,
        refreshSession,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
