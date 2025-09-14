"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/auth-context';
import { Icons } from '@/components/icons';

export default function RootPage() {
  const { isAuthenticated, user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // Wait until the authentication status is known
    if (user === undefined) {
      return; // Still loading, do nothing.
    }

    if (isAuthenticated) {
      router.replace('/dashboard');
    } else {
      router.replace('/login');
    }
  }, [isAuthenticated, user, router]);

  // Render a loading state while the redirect is happening
  // This is what users will see for a brief moment when they first visit the site.
  return (
    <div className="flex h-screen w-full flex-col items-center justify-center gap-4 bg-background">
      <Icons.logo className="h-8 w-8 animate-pulse text-primary" />
      <p className="text-muted-foreground">Loading...</p>
    </div>
  );
}
