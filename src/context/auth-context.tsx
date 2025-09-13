"use client";

import { User, mockUsers } from "@/lib/data";
import { createContext, useContext, useState, ReactNode } from "react";
import { useRouter } from "next/navigation";

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
  const router = useRouter();

  const handleRedirect = (role: UserRole) => {
    switch (role) {
      case "management":
      case "admin":
        router.push('/admin');
        break;
      case "volunteer":
        router.push('/volunteer');
        break;
      default:
        router.push('/dashboard');
        break;
    }
  }

  const login = (role: UserRole, email?: string, name?: string) => {
    const mockUser = email ? Object.values(mockUsers).find(u => u.email === email) : null;

    if (mockUser) {
        setUser(mockUser);
        handleRedirect(mockUser.role);
        return;
    }
    
    if (name && email) {
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
      handleRedirect(newUser.role);
    } else {
      const fallbackUser = {...mockUsers['user-1'], role};
      setUser(fallbackUser);
      handleRedirect(fallbackUser.role);
    }
  };

  const logout = () => {
    setUser(null);
    router.push('/');
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
