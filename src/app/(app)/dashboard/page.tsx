
"use client";

import { useAuth } from "@/context/auth-context";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight, BookCopy, Calendar, HeartPulse, MessageCircle, ShieldCheck, Sparkles, Users, Wind } from "lucide-react";
import Link from "next/link";
import { Icons } from "@/components/icons";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function DashboardPage() {
  const { user, isAuthenticated, role } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // Redirect non-students to their respective dashboards
    if (isAuthenticated && role && role !== 'student') {
      if (role === 'admin' || role === 'management') {
        router.replace('/admin');
      } else if (role === 'volunteer') {
        router.replace('/volunteer');
      }
    }
  }, [isAuthenticated, role, router]);

  const mainFeatures = [
    {
        id: "ai-companion",
        icon: <Sparkles className="h-8 w-8 text-primary" />,
        title: "AI Companion",
        description: "Chat with an AI assistant for personalized advice and coping strategies, available 24/7.",
        href: "/chatbot",
        cta: "Chat Now"
    },
    {
        id: "community",
        icon: <Users className="h-8 w-8 text-primary" />,
        title: "Community & Peer Support",
        description: "Connect with fellow students in a safe, moderated forum to share experiences and feel less alone.",
        href: "/forum",
        cta: "Visit Forum"
    },
    {
        id: "resources",
        icon: <BookCopy className="h-8 w-8 text-primary" />,
        title: "Self-Help Resources",
        description: "Access a curated library of articles, videos, and tools to learn about mental wellness at your own pace.",
        href: "/resources",
        cta: "Browse Resources"
    },
    {
        id: "consultation",
        icon: <ShieldCheck className="h-8 w-8 text-primary" />,
        title: "Expert Consultation",
        description: "Schedule a confidential one-on-one session with a licensed professional to get expert guidance.",
        href: "/booking",
        cta: "Book a Session"
    }
  ];

  const wellnessTools = [
      {
        icon: <HeartPulse className="h-8 w-8 text-primary" />,
        title: "Mood Tracker",
        description: "Log your daily mood to recognize patterns and understand your emotional landscape over time.",
        href: "/mood-tracker",
        cta: "Log Mood"
      },
      {
        icon: <Calendar className="h-8 w-8 text-primary" />,
        title: "Calendar",
        description: "Manage your academic deadlines and get AI-powered wellness tips to prevent burnout.",
        href: "/calendar",
        cta: "View Calendar"
      },
      {
        icon: <MessageCircle className="h-8 w-8 text-primary" />,
        title: "Journal",
        description: "Use guided templates or a free-form editor for private reflection and self-discovery.",
        href: "/journal",
        cta: "Open Journal"
      },
      {
        icon: <Wind className="h-8 w-8 text-primary" />,
        title: "Focus Tool",
        description: "Use the Pomodoro technique to enhance productivity and reduce study-related stress.",
        href: "/focus-tool",
        cta: "Start Focus"
      },
  ];

  // If the user is not a student, they will be redirected by the useEffect hook.
  // Show a loading state while the redirect is happening.
  if (!user || role !== 'student') {
     return (
        <div className="flex h-screen w-full flex-col items-center justify-center gap-4 bg-background">
            <Icons.logo className="h-8 w-8 animate-pulse text-primary" />
            <p className="text-muted-foreground">Loading dashboard...</p>
        </div>
    );
  }

  return (
    <div className="flex flex-col flex-1">
        {/* Hero Section */}
        <section className="container relative py-24 sm:py-32 lg:py-40 text-center">
             <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 -top-20 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-40">
                <div
                    style={{
                        clipPath: 'polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)'
                    }}
                    className="relative left-[calc(50%-11rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-[#a855f7] to-[#6d28d9] opacity-30 sm:left-[calc(50%-30rem)] sm:w-[72.1875rem]"
                />
            </div>
             <h1 className="text-4xl font-bold tracking-tight font-headline sm:text-6xl md:text-7xl">
                Hello, {user.name.split(' ')[0]}!
            </h1>
            <p className="mt-6 text-lg max-w-prose mx-auto text-muted-foreground">
                Ready to start your day with a clear mind? Here are the tools and resources available for you.
            </p>
        </section>

        {/* Main Features Section */}
        <section id="features" className="container py-16 scroll-mt-20">
            <div className="text-center mb-12">
                <h2 className="text-3xl font-bold font-headline sm:text-4xl">Main Features</h2>
                <p className="mt-4 text-muted-foreground max-w-2xl mx-auto">Your primary tools for support and connection.</p>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                {mainFeatures.map(feature => (
                     <Card key={feature.title} className="h-full flex flex-col">
                        <CardHeader className="flex-grow">
                            <div className="mb-4">{feature.icon}</div>
                            <CardTitle>{feature.title}</CardTitle>
                            <CardDescription>{feature.description}</CardDescription>
                        </CardHeader>
                        <CardFooter>
                            <Button asChild variant="outline" className="w-full">
                                <Link href={feature.href}>{feature.cta} <ArrowRight className="ml-2 h-4 w-4" /></Link>
                            </Button>
                        </CardFooter>
                    </Card>
                ))}
            </div>
        </section>

        {/* Wellness Tools Section */}
        <section className="container py-16">
            <div className="text-center mb-12">
                <h2 className="text-3xl font-bold font-headline sm:text-4xl">Wellness Tools</h2>
                <p className="mt-4 text-muted-foreground max-w-2xl mx-auto">A suite of features designed to help you build healthy habits, manage stress, and stay organized.</p>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                {wellnessTools.map(tool => (
                     <Card key={tool.title} className="h-full flex flex-col">
                        <CardHeader className="flex-grow">
                            <div className="mb-4">{tool.icon}</div>
                            <CardTitle>{tool.title}</CardTitle>
                            <CardDescription>{tool.description}</CardDescription>
                        </CardHeader>
                         <CardFooter>
                            <Button asChild variant="secondary" className="w-full">
                                <Link href={tool.href}>{tool.cta}</Link>
                            </Button>
                        </CardFooter>
                    </Card>
                ))}
            </div>
        </section>

        {/* Footer */}
        <footer id="contact" className="mt-auto bg-muted/20 scroll-mt-20">
            <div className="container py-12">
                 <div className="flex flex-col md:flex-row justify-between items-center gap-8">
                     <div className="flex items-center space-x-2">
                        <Icons.logo className="h-6 w-6 text-primary" />
                        <span className="font-bold font-headline tracking-wider">SOUL SYNC</span>
                    </div>
                     <nav className="flex flex-wrap justify-center gap-x-6 gap-y-2 text-sm text-muted-foreground">
                        <Link href="/resources" className="hover:text-foreground">Resources</Link>
                        <Link href="/forum" className="hover:text-foreground">Community</Link>
                        <Link href="/booking" className="hover:text-foreground">Book a Session</Link>
                        <Link href="#" className="hover:text-foreground">Privacy Policy</Link>
                    </nav>
                    <p className="text-sm text-muted-foreground">&copy; {new Date().getFullYear()} SoulSync. All rights reserved.</p>
                 </div>
            </div>
        </footer>
    </div>
  );
}
