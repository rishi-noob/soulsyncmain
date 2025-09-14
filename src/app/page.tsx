
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Icons } from "@/components/icons";

export default function LandingPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-14 max-w-screen-2xl items-center">
          <div className="mr-4 flex items-center">
            <Link href="/" className="mr-6 flex items-center space-x-2">
              <Icons.logo className="h-6 w-6 text-primary" />
              <span className="font-bold font-headline tracking-wider">SOUL SYNC</span>
            </Link>
            <nav className="hidden md:flex items-center gap-6 text-sm">
                <Link href="#" className="transition-colors hover:text-foreground/80 text-foreground/60">Home</Link>
                <Link href="#" className="transition-colors hover:text-foreground/80 text-foreground/60">Features</Link>
                <Link href="#" className="transition-colors hover:text-foreground/80 text-foreground/60">Resources</Link>
                <Link href="#" className="transition-colors hover:text-foreground/80 text-foreground/60">Contact Us</Link>
            </nav>
          </div>
          <div className="flex flex-1 items-center justify-end space-x-2 sm:space-x-4">
             <Button asChild>
                <Link href="/login">Sign Up</Link>
             </Button>
          </div>
        </div>
      </header>
      <main className="flex-1">
         <div className="container relative py-32 sm:py-48 lg:py-56">
             <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 -top-20 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-40">
                <div
                    style={{
                        clipPath: 'polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)'
                    }}
                    className="relative left-[calc(50%-11rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-[#a855f7] to-[#6d28d9] opacity-30 sm:left-[calc(50%-30rem)] sm:w-[72.1875rem]"
                />
            </div>

            <div className="mx-auto max-w-3xl text-center">
                <h1 className="text-4xl font-bold tracking-tight font-headline sm:text-6xl md:text-7xl">
                    <span className="text-primary">Soul Sync</span> Your Companion for <br /> Mental Wellness
                </h1>
                <p className="mt-6 text-lg max-w-prose mx-auto text-muted-foreground">
                    Accessible, stigma-free, and structured mental health support for students.
                </p>
                <div className="mt-10 flex items-center justify-center gap-x-6">
                    <Button asChild size="lg">
                        <Link href="/login">
                            Get Started
                        </Link>
                    </Button>
                </div>
            </div>
         </div>
      </main>
    </div>
  );
}
