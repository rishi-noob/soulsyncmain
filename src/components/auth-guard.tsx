
"use client";

import { useAuth } from "@/context/auth-context";
import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";
import { Icons } from "./icons";

export function AuthGuard({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, user } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    // If we're checking auth and the user is not logged in, and they are not on the landing page,
    // redirect them to the login page.
    if (user === null && pathname !== '/') {
      router.push("/");
    }
  }, [user, router, pathname]);

  if (!isAuthenticated) {
    return (
        <div className="flex h-screen w-full flex-col items-center justify-center gap-4 bg-background">
            <Icons.logo className="h-8 w-8 animate-pulse text-primary" />
            <p className="text-muted-foreground">Loading...</p>
        </div>
    );
  }

  return <>{children}</>;
}
