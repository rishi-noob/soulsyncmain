
"use client";

import { Header } from "@/components/header";
import { useAuth } from "@/context/auth-context";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { Icons } from "@/components/icons";

interface AppLayoutProps {
  children: React.ReactNode;
}

export default function AppLayout({ children }: AppLayoutProps) {
  const { user, isAuthenticated } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // If the auth state is resolved and the user is null (not logged in),
    // redirect them to the login page.
    if (isAuthenticated === false) {
      router.replace("/login");
    }
  }, [isAuthenticated, router]);

  // While the initial authentication check is running, `user` is `undefined`.
  // We show a loading screen to prevent a flicker of protected content.
  if (isAuthenticated === undefined || isAuthenticated === false) {
     return (
        <div className="flex h-screen w-full flex-col items-center justify-center gap-4 bg-background">
            <Icons.logo className="h-8 w-8 animate-pulse text-primary" />
            <p className="text-muted-foreground">Loading...</p>
        </div>
    );
  }
  
  // Once authenticated, render the main app layout.
  return (
      <div className="flex min-h-screen flex-col">
        <Header />
        <main className="flex-1 flex flex-col">
          {children}
        </main>
      </div>
  );
}
