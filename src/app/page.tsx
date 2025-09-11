"use client";

import { BrainCircuit, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/auth-context";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function LoginPage() {
  const { login, isAuthenticated } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (isAuthenticated) {
      router.push("/dashboard");
    }
  }, [isAuthenticated, router]);

  const handleLogin = () => {
    // For now, we'll log in as a student. The role selector will appear after.
    login("student");
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-background to-purple-900/10 p-4">
      <div className="w-full max-w-md rounded-2xl bg-card p-8 shadow-2xl shadow-purple-900/10">
        <div className="flex flex-col items-center">
          <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-primary/10">
            <BrainCircuit className="h-10 w-10 text-primary" />
          </div>
          <h1 className="mb-2 text-3xl font-bold font-headline tracking-tight">
            Soul Sync
          </h1>
          <p className="mb-8 text-muted-foreground">
            Your mental health companion
          </p>

          <ul className="mb-8 w-full space-y-3 text-left text-sm">
            <li className="flex items-center gap-3">
              <CheckCircle className="h-5 w-5 text-primary" />
              <span>AI-powered mental health support</span>
            </li>
            <li className="flex items-center gap-3">
              <CheckCircle className="h-5 w-5 text-primary" />
              <span>Mood tracking & wellness tools</span>
            </li>
            <li className="flex items-center gap-3">
              <CheckCircle className="h-5 w-5 text-primary" />
              <span>Anonymous peer support forum</span>
            </li>
          </ul>

          <Button onClick={handleLogin} size="lg" className="w-full">
            Continue with Google
          </Button>

          <p className="mt-6 text-center text-xs text-muted-foreground">
            By continuing, you agree to our terms of service and privacy
            policy.
          </p>
        </div>
      </div>
    </div>
  );
}
