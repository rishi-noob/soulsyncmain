
"use client";

import { User, mockUsers } from "@/lib/data";
import { createContext, useContext, useState, ReactNode, useEffect } from "react";
import { useRouter } from "next/navigation";

export type UserRole = "student" | "volunteer" | "admin" | "counsellor" | "management";

interface AuthContextType {
  user: User | null | undefined; // undefined means auth state is not yet known
  role: UserRole;
  isAuthenticated: boolean;
  allUsers: Record<string, User>;
  login: (email: string, password?: string) => User | null;
  logout: () => void;
  setRole: (role: UserRole) => void;
  updateUser: (data: Partial<User>) => void;
  addUser: (newUser: User, password?: string) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const USERS_STORAGE_KEY = 'soul-sync-users';
const SESSION_USER_KEY = 'soul-sync-session-user';


const getInitialUsers = (): Record<string, User> => {
    if (typeof window === 'undefined') {
        return mockUsers;
    }
    try {
        const storedUsersString = window.localStorage.getItem(USERS_STORAGE_KEY);
        let combinedUsers = { ...mockUsers };

        if (storedUsersString) {
            const storedUsers = JSON.parse(storedUsersString);
            combinedUsers = { ...combinedUsers, ...storedUsers };
        }
        
        window.localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(combinedUsers));
        return combinedUsers;
    } catch (error) {
        console.error("Failed to read/write from localStorage", error);
        return mockUsers;
    }
};


export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null | undefined>(undefined);
  const [allUsers, setAllUsers] = useState<Record<string, User>>(getInitialUsers);
  const router = useRouter();

  useEffect(() => {
    try {
      const sessionUserString = window.sessionStorage.getItem(SESSION_USER_KEY);
      if (sessionUserString) {
        const sessionUser = JSON.parse(sessionUserString);
        if (allUsers[sessionUser.id]) {
           setUser(allUsers[sessionUser.id]);
        } else {
           setUser(null); 
           window.sessionStorage.removeItem(SESSION_USER_KEY);
        }
      } else {
        setUser(null); 
      }
    } catch (e) {
      setUser(null);
    }
  }, [allUsers]);

  useEffect(() => {
    try {
        window.localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(allUsers));
    } catch (error) {
        console.error("Failed to write to localStorage", error);
    }
  }, [allUsers]);

  const addUser = (newUser: User, password?: string) => {
    const userWithPassword = password ? { ...newUser, password } : newUser;
    setAllUsers(prev => ({ ...prev, [newUser.id]: userWithPassword }));
  };

  const login = (email: string, password?: string): User | null => {
    const userToLogin = Object.values(allUsers).find(u => u.email === email);
    
    if (!userToLogin) {
      return null;
    }

    const isPasswordCorrect = userToLogin.password ? userToLogin.password === password : true;

    if (isPasswordCorrect) {
      setUser(userToLogin);
      window.sessionStorage.setItem(SESSION_USER_KEY, JSON.stringify(userToLogin));
      return userToLogin;
    }

    return null;
  };

  const logout = () => {
    setUser(null);
    window.sessionStorage.removeItem(SESSION_USER_KEY);
    router.push('/login');
  };
  
  const setRole = (role: UserRole) => {
    if (user) {
        const updatedUser = { ...user, role };
        setUser(updatedUser);
        setAllUsers(prev => ({...prev, [user.id]: updatedUser}));
        window.sessionStorage.setItem(SESSION_USER_KEY, JSON.stringify(updatedUser));
    }
  };

  const updateUser = (data: Partial<User>) => {
    if (user) {
        const updatedUser = { ...user, ...data };
        setUser(updatedUser);
        setAllUsers(prev => ({...prev, [user.id]: updatedUser}));
        window.sessionStorage.setItem(SESSION_USER_KEY, JSON.stringify(updatedUser));
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
