"use client";

import { BrainCircuit, Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/auth-context";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { UserRole, User } from "@/context/auth-context";
import { useToast } from "@/hooks/use-toast";

const loginSchema = z.object({
  email: z.string().email({ message: "Invalid email address." }),
  password: z.string().min(1, { message: "Password is required." }),
});

const signupSchema = z.object({
    name: z.string().min(2, { message: "Name must be at least 2 characters." }),
    email: z.string().email({ message: "Invalid email address." }),
    password: z.string().min(8, { message: "Password must be at least 8 characters." }),
});


export default function AuthPage() {
  const { login, isAuthenticated, allUsers, addUser } = useAuth();
  const router = useRouter();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [showLoginPassword, setShowLoginPassword] = useState(false);
  const [showSignupPassword, setShowSignupPassword] = useState(false);
  
  const loginForm = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  });

  const signupForm = useForm<z.infer<typeof signupSchema>>({
    resolver: zodResolver(signupSchema),
    defaultValues: { name: "", email: "", password: "" },
  });

  useEffect(() => {
    if (isAuthenticated) {
      router.push("/home");
    }
  }, [isAuthenticated, router]);

  const handleLogin = (values: z.infer<typeof loginSchema>) => {
    setIsLoading(true);
    // This is a simplified mock login. In a real app, you'd also check hashed passwords.
    setTimeout(() => {
        const userExists = Object.values(allUsers).find(u => u.email === values.email);
        
        if (userExists) {
            login(values.email);
        } else {
            loginForm.setError("email", { type: "manual", message: "No account found with this email." });
            toast({
                variant: "destructive",
                title: "Login Failed",
                description: "Invalid credentials. Please try again.",
            });
        }
      setIsLoading(false);
    }, 1000);
  };

  const handleSignup = (values: z.infer<typeof signupSchema>) => {
    setIsLoading(true);
    
    // Check if user already exists in our persistent list from the context
    setTimeout(() => {
        const existingUser = Object.values(allUsers).find(u => u.email === values.email);
        if (existingUser) {
            signupForm.setError("email", { type: "manual", message: "An account with this email already exists." });
            toast({
                variant: "destructive",
                title: "Sign-up Failed",
                description: "This email is already registered. Please sign in instead.",
            });
            setIsLoading(false);
            return;
        }

        const newUser: User = {
            id: `user-${Date.now()}`,
            name: values.name,
            email: values.email,
            avatarUrl: `https://picsum.photos/seed/${values.name}/100/100`,
            role: "student", // All signups are students by default
            streak: 0,
            focusPoints: 0,
            treesPlanted: 0,
        };
        
        // Add new user to our context, which saves it to localStorage
        addUser(newUser);
        
        // Log the user in automatically
        login(newUser.email);
        
        toast({
            title: "Account Created!",
            description: "Welcome to SoulSync. We're glad you're here.",
        });

        // The loading state will be handled by the redirect
        // setIsLoading(false);

    }, 1000);
  };


  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-background to-purple-900/10 p-4">
      <Tabs defaultValue="login" className="w-full max-w-md">
        <div className="flex justify-center mb-4">
            <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="login">Sign In</TabsTrigger>
                <TabsTrigger value="signup">Sign Up</TabsTrigger>
            </TabsList>
        </div>
        <TabsContent value="login">
          <Card className="rounded-2xl bg-card p-2 shadow-2xl shadow-purple-900/10">
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
                  <FormField
                    control={loginForm.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input placeholder="name@example.com" {...field} autoComplete="off" />
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
                              autoComplete="new-password"
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
          <Card className="rounded-2xl bg-card p-2 shadow-2xl shadow-purple-900/10">
            <CardHeader className="text-center">
                 <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-primary/10">
                    <BrainCircuit className="h-10 w-10 text-primary" />
                </div>
              <CardTitle className="text-3xl font-bold font-headline tracking-tight">Create a Student Account</CardTitle>
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
    </div>
  );
}
