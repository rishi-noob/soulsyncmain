
"use client";

import { BrainCircuit, Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/auth-context";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { User } from "@/context/auth-context";
import { useToast } from "@/hooks/use-toast";
import { Icons } from "@/components/icons";
import Link from "next/link";

const loginSchema = z.object({
  email: z.string().email({ message: "Invalid email address." }),
  password: z.string().min(1, { message: "Password is required." }),
});

const signupSchema = z.object({
    name: z.string().min(2, { message: "Name must be at least 2 characters." }),
    email: z.string().email({ message: "Invalid email address." }),
    password: z.string().min(8, { message: "Password must be at least 8 characters." }),
});

export default function LoginPage() {
  const { login, isAuthenticated, allUsers, addUser } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (isAuthenticated) {
      router.replace("/dashboard");
    }
  }, [isAuthenticated, router]);

  if (isAuthenticated) {
     return (
        <div className="flex h-screen w-full flex-col items-center justify-center gap-4 bg-background">
            <Icons.logo className="h-8 w-8 animate-pulse text-primary" />
            <p className="text-muted-foreground">Redirecting to dashboard...</p>
        </div>
    );
  }


  return (
    <div className="flex flex-col flex-1">
        {/* Hero Section */}
        <section className="container relative flex-grow flex items-center justify-center text-center py-24 sm:py-32 lg:py-40">
             <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 -top-20 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-40">
                <div
                    style={{
                        clipPath: 'polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)'
                    }}
                    className="relative left-[calc(50%-11rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-[#a855f7] to-[#6d28d9] opacity-30 sm:left-[calc(50%-30rem)] sm:w-[72.1875rem]"
                />
            </div>
            <div className="max-w-4xl">
                 <h1 className="text-4xl font-bold tracking-tighter font-headline sm:text-6xl md:text-7xl lg:text-8xl">
                    <span className="text-primary">Soul Sync</span><br />
                    Your Companion for <br />
                    Mental Wellness
                </h1>
                <p className="mt-6 text-lg max-w-prose mx-auto text-muted-foreground">
                    Accessible, stigma-free, and structured mental health support for students.
                </p>
                <div className="mt-10 flex items-center justify-center gap-x-6">
                    <Button asChild size="lg">
                        <Link href="#signup">Get Started</Link>
                    </Button>
                </div>
            </div>
        </section>

        {/* Features Section */}
        <section id="features" className="container py-16 scroll-mt-20">
             <div className="text-center mb-12">
                <h2 className="text-3xl font-bold font-headline sm:text-4xl">Features</h2>
                <p className="mt-4 text-muted-foreground max-w-2xl mx-auto">A comprehensive toolkit for your mental well-being journey.</p>
            </div>
            {/* You can add feature cards here if you wish */}
        </section>


        {/* Auth Section */}
        <section id="signup" className="container py-16 scroll-mt-20">
             <AuthTabs />
        </section>

        {/* Footer */}
        <footer id="contact" className="mt-auto bg-muted/20 scroll-mt-20">
            <div className="container py-24 sm:py-32">
                <div className="mx-auto max-w-4xl text-center">
                    <h2 className="text-3xl font-bold font-headline sm:text-4xl">Contact Us</h2>
                    <p className="mt-4 text-muted-foreground">
                        Have questions or feedback? We'd love to hear from you.
                    </p>
                    {/* Add a contact form here if needed */}
                     <div className="mt-10">
                        <p className="text-sm text-muted-foreground">&copy; {new Date().getFullYear()} SoulSync. All rights reserved.</p>
                    </div>
                </div>
            </div>
        </footer>
    </div>
  );
}


function AuthTabs() {
  const { login, allUsers, addUser } = useAuth();
  const router = useRouter();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [showLoginPassword, setShowLoginPassword] = useState(false);
  const [showSignupPassword, setShowSignupPassword] = useState(false);
  const [activeTab, setActiveTab] = useState("signup");
  
  const loginForm = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  });

  const signupForm = useForm<z.infer<typeof signupSchema>>({
    resolver: zodResolver(signupSchema),
    defaultValues: { name: "", email: "", password: "" },
  });

  const handleLogin = (values: z.infer<typeof loginSchema>) => {
    setIsLoading(true);
    
    setTimeout(() => {
        const loggedInUser = login(values.email, values.password);

        if (loggedInUser) {
            toast({ title: "Login Successful", description: "Redirecting to your dashboard..." });
            router.push('/dashboard');
        } else {
            loginForm.setError("root", { type: "manual", message: "Invalid email or password." });
            setIsLoading(false);
        }
    }, 500);
  };

  const handleSignup = (values: z.infer<typeof signupSchema>) => {
    setIsLoading(true);

    setTimeout(() => {
        const existingUser = Object.values(allUsers).find(u => u.email === values.email);
        if (existingUser) {
            signupForm.setError("email", { type: "manual", message: "An account with this email already exists." });
            setIsLoading(false);
            return;
        }

        const newUser: User = {
            id: `user-${Date.now()}`,
            name: values.name,
            email: values.email,
            avatarUrl: `https://picsum.photos/seed/${values.name}/100/100`,
            role: "student",
            streak: 0,
            focusPoints: 0,
            treesPlanted: 0,
        };
        
        addUser(newUser, values.password);

        toast({
            title: "Account created! You can now sign in.",
            description: "Your new account has been successfully created."
        });
        
        signupForm.reset();
        setActiveTab("login");
        loginForm.setValue("email", values.email);
        loginForm.setValue("password", values.password);
        setIsLoading(false);
    }, 500);
  };
    
  return (
    <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full max-w-md mx-auto">
        <div className="flex justify-center mb-4">
            <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="login">Sign In</TabsTrigger>
                <TabsTrigger value="signup">Sign Up</TabsTrigger>
            </TabsList>
        </div>
        <TabsContent value="login">
          <Card className="rounded-2xl bg-card p-2 shadow-2xl shadow-primary/10">
            <CardHeader className="text-center">
                <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-primary/10">
                    <BrainCircuit className="h-10 w-10 text-primary" />
                </div>
                <CardTitle className="text-3xl font-bold font-headline tracking-tight">Welcome Back</CardTitle>
                <CardDescription>Sign in to access your dashboard.</CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...loginForm}>
                <form onSubmit={loginForm.handleSubmit(handleLogin)} className="space-y-4">
                  {loginForm.formState.errors.root && (
                    <p className="text-sm font-medium text-destructive">{loginForm.formState.errors.root.message}</p>
                  )}
                  <FormField
                    control={loginForm.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input placeholder="name@example.com" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={loginForm.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Password</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Input
                              type={showLoginPassword ? "text" : "password"}
                              placeholder="••••••••"
                              {...field}
                            />
                            <Button
                              type="button"
                              variant="ghost"
                              size="icon"
                              className="absolute inset-y-0 right-0 h-full px-3"
                              onClick={() => setShowLoginPassword((prev) => !prev)}
                            >
                              {showLoginPassword ? (
                                <EyeOff className="h-4 w-4" />
                              ) : (
                                <Eye className="h-4 w-4" />
                              )}
                              <span className="sr-only">
                                {showLoginPassword ? "Hide password" : "Show password"}
                              </span>
                            </Button>
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button type="submit" className="w-full" disabled={isLoading}>
                    {isLoading ? "Signing In..." : "Sign In"}
                  </Button>
                </form>
              </Form>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="signup">
          <Card className="rounded-2xl bg-card p-2 shadow-2xl shadow-primary/10">
            <CardHeader className="text-center">
                 <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-primary/10">
                    <BrainCircuit className="h-10 w-10 text-primary" />
                </div>
              <CardTitle className="text-3xl font-bold font-headline tracking-tight">Create an Account</CardTitle>
              <CardDescription>Join SoulSync to take control of your well-being.</CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...signupForm}>
                <form onSubmit={signupForm.handleSubmit(handleSignup)} className="space-y-4">
                   <FormField
                    control={signupForm.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Full Name</FormLabel>
                        <FormControl>
                          <Input placeholder="Alex Doe" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={signupForm.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input placeholder="name@example.com" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={signupForm.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Password</FormLabel>
                        <FormControl>
                           <div className="relative">
                            <Input
                              type={showSignupPassword ? "text" : "password"}
                              placeholder="Must be 8+ characters"
                              {...field}
                            />
                            <Button
                              type="button"
                              variant="ghost"
                              size="icon"
                              className="absolute inset-y-0 right-0 h-full px-3"
                              onClick={() => setShowSignupPassword((prev) => !prev)}
                            >
                              {showSignupPassword ? (
                                <EyeOff className="h-4 w-4" />
                              ) : (
                                <Eye className="h-4 w-4" />
                              )}
                               <span className="sr-only">
                                {showSignupPassword ? "Hide password" : "Show password"}
                              </span>
                            </Button>
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button type="submit" className="w-full" disabled={isLoading}>
                    {isLoading ? "Creating Account..." : "Create Account"}
                  </Button>
                </form>
              </Form>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
  );
}

    