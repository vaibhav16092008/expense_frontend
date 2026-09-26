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
      const rawUser = response.data?.data || response.data?.user || response.data;
      if (rawUser && rawUser.id) {
        setUser({
          id: rawUser.id,
          email: rawUser.email,
          fullName: rawUser.name || rawUser.fullName || rawUser.email,
          avatarUrl: rawUser.avatarUrl,
          createdAt: rawUser.createdAt,
        });
      } else {
        setUser(null);
      }
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
        const rawUser = response.data?.data || response.data?.user || response.data;
        if (isMounted && rawUser && rawUser.id) {
          setUser({
            id: rawUser.id,
            email: rawUser.email,
            fullName: rawUser.name || rawUser.fullName || rawUser.email,
            avatarUrl: rawUser.avatarUrl,
            createdAt: rawUser.createdAt,
          });
        }
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
      const payloadData = response.data?.data || response.data;
      const rawUser = payloadData?.user;
      const accessToken = payloadData?.accessToken;

      if (accessToken) {
        localStorage.setItem("expenseiq_access_token", accessToken);
      }

      if (rawUser) {
        setUser({
          id: rawUser.id,
          email: rawUser.email,
          fullName: rawUser.name || rawUser.fullName || rawUser.email,
          avatarUrl: rawUser.avatarUrl,
          createdAt: rawUser.createdAt,
        });
      } else {
        setUser({ id: "demo-user", email: payload.email, fullName: payload.email });
      }
    } catch (err) {
      throw normalizeApiError(err);
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (payload: RegisterPayload) => {
    try {
      setIsLoading(true);
      await apiClient.post("/auth/register", {
        name: payload.fullName,
        email: payload.email,
        password: payload.password,
      });

      // Auto-login after successful registration
      if (payload.password) {
        await login({ email: payload.email, password: payload.password });
      }
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
