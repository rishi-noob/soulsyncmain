import { Header } from "@/components/header";
import { AuthGuard } from "@/components/auth-guard";

interface AppLayoutProps {
  children: React.ReactNode;
}

export default function AppLayout({ children }: AppLayoutProps) {
  // Since we can't use hooks in Server Components,
  // we would handle auth state differently in a real app (e.g., via session cookie).
  // For this mock, we'll assume a client-side check.
  // A proper implementation would use middleware.
  
  return (
    <AuthGuard>
      <div className="flex min-h-screen flex-col">
        <Header />
        <main className="flex-1">
          {children}
        </main>
      </div>
    </AuthGuard>
  );
}
