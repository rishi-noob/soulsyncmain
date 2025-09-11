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
import { UserRole } from "@/context/auth-context";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { mockUsers } from "@/lib/data";
import { useToast } from "@/hooks/use-toast";

const loginSchema = z.object({
  email: z.string().email({ message: "Invalid email address." }),
  password: z.string().min(1, { message: "Password is required." }),
});

const signupSchema = z.object({
    name: z.string().min(2, { message: "Name must be at least 2 characters." }),
    email: z.string().email({ message: "Invalid email address." }),
    password: z.string().min(8, { message: "Password must be at least 8 characters." }),
    role: z.enum(["student", "volunteer", "counsellor", "management"]),
});


export default function AuthPage() {
  const { login, isAuthenticated } = useAuth();
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
    defaultValues: { name: "", email: "", password: "", role: "student" },
  });

  useEffect(() => {
    if (isAuthenticated) {
      router.push("/dashboard");
    }
  }, [isAuthenticated, router]);

  const handleLogin = async (values: z.infer<typeof loginSchema>) => {
    setIsLoading(true);
    // In a real app, you would verify credentials against a database.
    console.log("Logging in with:", values);
    setTimeout(() => {
        const user = Object.values(mockUsers).find(u => u.email === values.email);
        
        // This is a simplified mock login. In a real app, you'd check hashed passwords.
        if (user) {
            login(user.role, user.email, user.name);
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

  const handleSignup = async (values: z.infer<typeof signupSchema>) => {
    setIsLoading(true);
    // In a real app, you would create a new user in your database.
    console.log("Signing up with:", values);
    setTimeout(() => {
        login(values.role as UserRole, values.email, values.name);
        setIsLoading(false);
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
          <Card className="rounded-2xl bg-card p-2 shadow-2xl shadow-purple-900/10">
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
                   <FormField
                    control={signupForm.control}
                    name="role"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>I am a...</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select your role" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="student">Student</SelectItem>
                            <SelectItem value="volunteer">Volunteer</SelectItem>
                            <SelectItem value="counsellor">Counsellor</SelectItem>
                            <SelectItem value="management">Management</SelectItem>
                          </SelectContent>
                        </Select>
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
