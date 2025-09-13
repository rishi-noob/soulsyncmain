
"use client";

import { User, mockUsers } from "@/lib/data";
import { createContext, useContext, useState, ReactNode, useEffect } from "react";
import { useRouter } from "next/navigation";

export type UserRole = "student" | "volunteer" | "admin" | "counsellor" | "management";

interface AuthContextType {
  user: User | null;
  role: UserRole;
  isAuthenticated: boolean;
  allUsers: Record<string, User>;
  login: (email: string, password?: string) => User | null;
  logout: () => void;
  setRole: (role: UserRole) => void;
  updateUser: (data: Partial<User>) => void;
  addUser: (newUser: User) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const USERS_STORAGE_KEY = 'soul-sync-users';

// This function now correctly merges the base mockUsers with users from localStorage
const getInitialUsers = (): Record<string, User> => {
    if (typeof window === 'undefined') {
        return mockUsers;
    }
    try {
        const storedUsersString = window.localStorage.getItem(USERS_STORAGE_KEY);
        // Start with the base mock users to ensure privileged accounts are always present
        let combinedUsers = { ...mockUsers };

        if (storedUsersString) {
            const storedUsers = JSON.parse(storedUsersString);
            // Merge stored users, giving precedence to stored data for non-privileged accounts
            for (const userId in storedUsers) {
                if (!mockUsers[userId] || mockUsers[userId].role === 'student') {
                    combinedUsers[userId] = storedUsers[userId];
                }
            }
        }
        
        // Persist the potentially merged list back to localStorage
        window.localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(combinedUsers));
        return combinedUsers;
    } catch (error) {
        console.error("Failed to read/write from localStorage", error);
        return mockUsers;
    }
};


export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [allUsers, setAllUsers] = useState<Record<string, User>>(getInitialUsers);
  const router = useRouter();

  useEffect(() => {
    try {
        window.localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(allUsers));
    } catch (error) {
        console.error("Failed to write to localStorage", error);
    }
  }, [allUsers]);

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

  const addUser = (newUser: User) => {
    setAllUsers(prev => ({ ...prev, [newUser.id]: newUser }));
  };

  const login = (email: string, password?: string) => {
    const userToLogin = Object.values(allUsers).find(u => u.email === email);

    if (!userToLogin) {
        return null;
    }

    // For student roles, no password check is needed for this demo app
    if (userToLogin.role === 'student') {
        setUser(userToLogin);
        handleRedirect(userToLogin.role);
        return userToLogin;
    }

    // For privileged roles, we must check the password
    if (userToLogin.password === password) {
        setUser(userToLogin);
        handleRedirect(userToLogin.role);
        return userToLogin;
    }

    return null;
  };

  const logout = () => {
    setUser(null);
    router.push('/');
  };
  
  const setRole = (role: UserRole) => {
    if (user) {
        const updatedUser = { ...user, role };
        setUser(updatedUser);
        setAllUsers(prev => ({...prev, [user.id]: updatedUser}));
    }
  };

  const updateUser = (data: Partial<User>) => {
    if (user) {
        const updatedUser = { ...user, ...data };
        setUser(updatedUser);
        setAllUsers(prev => ({...prev, [user.id]: updatedUser}));
    }
  };

  const isAuthenticated = !!user;
  const role = user?.role || 'student';

  return (
    <AuthContext.Provider value={{ user, role, isAuthenticated, login, logout, setRole, updateUser, allUsers, addUser }}>
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
