"use client";

import { post } from "@/config/api";
import {
  createContext,
  useContext,
  useState,
  ReactNode,
  useCallback,
  useEffect,
} from "react";

interface User {
  password?: string;
  username?: string;
}

interface AuthContextData {
  signIn: (userData: User) => Promise<any>;
  logOut: () => Promise<void>;
  setCookies: (token: string) => Promise<any>;
  token: string | null;
}

interface AuthProviderProps {
  children: ReactNode;
}

const AuthContext = createContext<AuthContextData>({} as AuthContextData);

export function AuthProvider({ children }: AuthProviderProps) {
  const [token, setToken] = useState<string | null>(null);

  const signIn = useCallback(async (userData: User): Promise<any> => {
    try {
      const response = await post("auth/login", userData);
      return response;
    } catch (error) {
      console.error("Error authenticating user:", error);
      throw error;
    }
  }, []);

  const setCookies = useCallback(async (token: string): Promise<any> => {
    try {
      const response = await fetch("/api/cookies", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ token }),
      });
      await getCookies(); // Atualiza o token local
      return response;
    } catch (error) {
      console.error("Error setting cookies:", error);
      throw error;
    }
  }, []);

  const getCookies = useCallback(async (): Promise<void> => {
    try {
      const response = await fetch("/api/cookies", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const { token } = await response.json();
      if (token) {
        setToken(token);
      } else {
        setToken(null);
      }
    } catch (error) {
      console.error("Error fetching user cookie:", error);
      setToken(null);
    }
  }, []);

  const logOut = useCallback(async (): Promise<void> => {
    try {
      await fetch("/api/cookies", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      });
      setToken(null); // Limpa o token no estado local
    } catch (error) {
      console.error("Error during logout:", error);
    }
  }, []);

  useEffect(() => {
    getCookies();
  }, [getCookies]);

  return (
    <AuthContext.Provider value={{ signIn, token, logOut, setCookies }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextData {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
