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

  const login = (role: UserRole, email?: string, name?: string) => {
    // In a real app, you'd get user data from your backend
    const mockUser = email ? Object.values(mockUsers).find(u => u.email === email) : null;

    if (mockUser) {
        setUser(mockUser);
        if (mockUser.role === 'management') {
          router.push('/admin');
        } else if (mockUser.role === 'volunteer') {
          router.push('/volunteer');
        } else {
          router.push('/dashboard');
        }
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
      if (role === 'management') {
          router.push('/admin');
        } else if (role === 'volunteer') {
          router.push('/volunteer');
        } else {
          router.push('/dashboard');
        }
    } else {
      // Fallback for generic login without email (e.g. from header button)
      const fallbackUser = {...mockUsers['user-1'], role};
      setUser(fallbackUser);
      if (fallbackUser.role === 'management') {
        router.push('/admin');
      } else if (fallbackUser.role === 'volunteer') {
        router.push('/volunteer');
      } else {
        router.push('/dashboard');
      }
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
