"use client";

import { useAuth } from "@/context/auth-context";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { Icons } from "@/components/icons";

/**
 * A client component that redirects the user to the correct dashboard based on their role.
 * This acts as a router to ensure the user's default view is appropriate for their permissions.
 */
export default function HomePage() {
  const { role, isAuthenticated } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/");
      return;
    }

    switch (role) {
      case "management":
      case "admin":
        router.replace("/admin");
        break;
      case "volunteer":
        router.replace("/volunteer");
        break;
      case "student":
      default:
        router.replace("/dashboard");
        break;
    }
  }, [role, isAuthenticated, router]);

  // Return a loading state while the redirect is happening
  return (
    <div className="flex h-full flex-grow items-center justify-center">
        <div className="flex flex-col items-center gap-4">
            <Icons.logo className="h-8 w-8 animate-pulse text-primary" />
            <p className="text-muted-foreground">Loading your dashboard...</p>
        </div>
    </div>
  );
}
