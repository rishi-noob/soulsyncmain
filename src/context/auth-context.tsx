"use client";

import { User, mockUsers } from "@/lib/data";
import { createContext, useContext, useState, ReactNode } from "react";

export type UserRole = "student" | "volunteer" | "admin" | "counsellor" | "management";

interface AuthContextType {
  user: User | null;
  role: UserRole;
  isAuthenticated: boolean;
  login: (role: UserRole) => void;
  logout: () => void;
  setRole: (role: UserRole) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  const login = (role: UserRole) => {
    // In a real app, you'd get user data from your backend
    const mockUser = Object.values(mockUsers).find(u => u.role === role) || mockUsers['user-1'];
    setUser({...mockUser, role});
  };

  const logout = () => {
    setUser(null);
  };
  
  const setRole = (role: UserRole) => {
    if (user) {
      setUser({ ...user, role });
    }
  }

  const isAuthenticated = !!user;
  const role = user?.role || 'student';

  return (
    <AuthContext.Provider value={{ user, role, isAuthenticated, login, logout, setRole }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
