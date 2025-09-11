"use client";

import { User, mockUsers } from "@/lib/data";
import { createContext, useContext, useState, ReactNode } from "react";

export type UserRole = "student" | "volunteer" | "admin" | "counsellor" | "management";

interface AuthContextType {
  user: User | null;
  role: UserRole;
  isAuthenticated: boolean;
  login: (role: UserRole, email?: string, name?: string) => void;
  logout: () => void;
  setRole: (role: UserRole) => void;
  updateUser: (data: Partial<User>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  const login = (role: UserRole, email?: string, name?: string) => {
    // In a real app, you'd get user data from your backend
    if (email === 'rishisahab@gmail.com') {
        setUser(mockUsers['user-rishabh']);
        return;
    }
    
    if (name && email) {
      // This is a new user signing up
      const newUser: User = {
        id: `user-${Date.now()}`,
        name,
        email,
        avatarUrl: `https://picsum.photos/seed/${name}/100/100`,
        role,
        streak: 0,
        focusPoints: 0,
        treesPlanted: 0,
      };
      setUser(newUser);
    } else {
      // This is a mock login for existing users
      const mockUser = Object.values(mockUsers).find(u => u.email === email) || mockUsers['user-1'];
      setUser({...mockUser, role});
    }
  };

  const logout = () => {
    setUser(null);
  };
  
  const setRole = (role: UserRole) => {
    if (user) {
      setUser({ ...user, role });
    }
  };

  const updateUser = (data: Partial<User>) => {
    if (user) {
        setUser({ ...user, ...data });
    }
  };

  const isAuthenticated = !!user;
  const role = user?.role || 'student';

  return (
    <AuthContext.Provider value={{ user, role, isAuthenticated, login, logout, setRole, updateUser }}>
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
