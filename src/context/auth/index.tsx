"use client";

import { post } from "@/config/api";
import { createContext, useContext, useState, ReactNode, useCallback, useEffect } from "react";
interface User {
  password?: string;
  username?: string;
}

interface AuthContextData {
  signIn: (userData: User) => void;
  logOut: () => void;
  setCookies: (token: string) => Promise<any>;
  token: string;

}

interface AuthProviderProps {
  children: ReactNode;
}

const AuthContext = createContext<AuthContextData>({} as AuthContextData);

export function AuthProvider({ children }: AuthProviderProps) {
  const [token, setToken] = useState<any>(null);
  const signIn = useCallback(async (userData: User): Promise<any> => {
    try {
      const response = await post('auth/login', userData);
      return response;
    } catch (error) {
      console.error('Error authenticating user:', error);
      throw error;
    }
  }, []);

  const setCookies = useCallback(async (token: string): Promise<any> => {
    try {
      const response = await fetch('/api/cookies', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ token: token }),
      });
      await getCookies()
      return response;
    } catch (error) {
      console.error('Error setting cookies:', error);
      throw error;
    }
  }, []);

  const getCookies = useCallback(async (): Promise<void> => {
    try {
      const response = await fetch('/api/cookies', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const { token } = await response.json();
      if (token) {
        setToken(token);
      }

    } catch (error) {
      console.error('Error fetching user cookie:', error);
      setToken(null);
    }
  }, [setToken, token]);

  const logOut = useCallback(async () => {
    try {
      await fetch('/api/cookies', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      setToken(null);
    } catch (error) {
      console.error('Error during logout:', error);
    }
  }, [getCookies]);

  useEffect(() => {
    getCookies();
  }, [token])
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
