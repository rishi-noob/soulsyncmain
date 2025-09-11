"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Icons } from "@/components/icons";
import { UserNav } from "@/components/user-nav";
import { cn } from "@/lib/utils";
import { useAuth } from "@/context/auth-context";
import { Button } from "./ui/button";

export function Header() {
  const pathname = usePathname();
  const { isAuthenticated, login } = useAuth();

  const navItems = [
    { href: "/dashboard", label: "Home" },
    { href: "/mood-tracker", label: "Mood Tracker" },
    { href: "/calendar", label: "Calendar" },
    { href: "/journal", label: "Journal" },
    { href: "/forum", label: "Peer Forum" },
    { href: "/focus-tool", label: "Focus" },
    { href: "/resources", label: "Resources" },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 max-w-screen-2xl items-center">
        <div className="mr-4 flex">
          <Link href="/" className="mr-6 flex items-center space-x-2">
            <Icons.logo className="h-6 w-6 text-primary" />
            <span className="font-bold font-headline tracking-wider">SOUL SYNC</span>
          </Link>
          <nav className="hidden md:flex items-center gap-6 text-sm">
            {isAuthenticated && navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "transition-colors hover:text-foreground/80",
                  pathname === item.href ? "text-foreground" : "text-foreground/60"
                )}
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </div>
        <div className="flex flex-1 items-center justify-end space-x-4">
           {isAuthenticated && (
             <Button asChild>
                <Link href="/booking">Book a Session</Link>
             </Button>
           )}
          {isAuthenticated ? (
            <UserNav />
          ) : (
            <Button onClick={() => login('student')}>Login/Profile</Button>
          )}
        </div>
      </div>
    </header>
  );
}
