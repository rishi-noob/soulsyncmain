"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Icons } from "@/components/icons";
import { UserNav } from "@/components/user-nav";
import { cn } from "@/lib/utils";
import { useAuth } from "@/context/auth-context";
import { Button } from "./ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "./ui/sheet";
import { Menu } from "lucide-react";

export function Header() {
  const pathname = usePathname();
  const { isAuthenticated, user, role } = useAuth();
  const [isSheetOpen, setIsSheetOpen] = useState(false);

  // Define the base navigation items shared by all roles
  const studentNavItems = [
    { href: "/dashboard", label: "Student Dashboard" },
  ];
  
  // The primary navigation link now points to a role-based router page.
  const primaryNavItem = { href: "/home", label: "Home" };

  // For admin/management, add specific analytics/management links
  const managementNavItems =
    role === "admin" || role === "management"
      ? [
          { href: "/admin", label: "Analytics" },
          { href: "/admin/users", label: "Users" },
          { href: "/admin/moderation", label: "Moderation" },
        ]
      : [];

  const navItems = (role === 'admin' || role === 'management') 
    ? [primaryNavItem, ...managementNavItems, ...studentNavItems]
    : [
        primaryNavItem,
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
        <div className="mr-4 flex items-center">
          <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
            <SheetTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="md:hidden mr-2"
              >
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle Menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-[300px] sm:w-[400px]">
              <SheetHeader className="text-left">
                <SheetTitle className="sr-only">Main Menu</SheetTitle>
              </SheetHeader>
              <div className="flex flex-col h-full">
                <div className="flex items-center mb-8">
                    <Link href="/home" className="mr-6 flex items-center space-x-2" onClick={() => setIsSheetOpen(false)}>
                        <Icons.logo className="h-6 w-6 text-primary" />
                        <span className="font-bold font-headline tracking-wider">SOUL SYNC</span>
                    </Link>
                </div>
                <nav className="flex flex-col gap-4">
                  {isAuthenticated && navItems.map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setIsSheetOpen(false)}
                      className={cn(
                        "transition-colors hover:text-foreground text-lg",
                        pathname === item.href ? "text-foreground font-semibold" : "text-foreground/60"
                      )}
                    >
                      {item.label}
                    </Link>
                  ))}
                </nav>
                 <div className="mt-auto">
                    {isAuthenticated && (
                    <Button asChild className="w-full" onClick={() => setIsSheetOpen(false)}>
                        <Link href="/booking">Book a Session</Link>
                    </Button>
                    )}
                </div>
              </div>
            </SheetContent>
          </Sheet>

          <Link href="/home" className="mr-6 flex items-center space-x-2">
            <Icons.logo className="h-6 w-6 text-primary" />
            <span className="hidden sm:inline-block font-bold font-headline tracking-wider">SOUL SYNC</span>
          </Link>
          <nav className="hidden md:flex items-center gap-6 text-sm">
            {isAuthenticated && navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "transition-colors hover:text-foreground/80",
                  (pathname === item.href || (item.href === "/home" && (pathname === "/dashboard" || pathname === "/admin" || pathname === "/volunteer")))
                    ? "text-foreground"
                    : "text-foreground/60"
                )}
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </div>
        <div className="flex flex-1 items-center justify-end space-x-2 sm:space-x-4">
           {isAuthenticated && (
             <Button asChild className="hidden sm:inline-flex">
                <Link href="/booking">Book a Session</Link>
             </Button>
           )}
          {isAuthenticated && user ? (
            <UserNav />
          ) : (
             <Button asChild>
                <Link href="/">Login / Sign Up</Link>
             </Button>
          )}
        </div>
      </div>
    </header>
  );
}
