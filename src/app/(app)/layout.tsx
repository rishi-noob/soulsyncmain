import { Header } from "@/components/header";
import { useAuth } from "@/context/auth-context";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { Icons } from "@/components/icons";

interface AppLayoutProps {
  children: React.ReactNode;
}

// This is a client component because it uses hooks (useAuth, useRouter, useEffect)
"use client";

export default function AppLayout({ children }: AppLayoutProps) {
  const { isAuthenticated, user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // If the authentication check is complete (`user` is not undefined)
    // and the user is not authenticated, redirect them to the login page.
    if (user === null) {
      router.push("/");
    }
  }, [user, router]);

  // While the initial authentication check is running, `user` is `undefined`.
  // We show a loading screen to prevent a flicker of the page content.
  if (!isAuthenticated) {
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
