"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, ShieldCheck, User, CheckCircle } from "lucide-react";
import Link from "next/link";

export default function BookingPage() {
    // In a real app, this would link to your actual booking system (e.g., Calendly, Google Calendar, custom backend)
    const bookingLink = "https://calendar.google.com/calendar/appointments/schedules/your-mock-schedule-link";

    const features = [
        {
            icon: <ShieldCheck className="h-6 w-6 text-primary" />,
            title: "100% Confidential",
            description: "Your privacy is our top priority. All sessions are completely private and secure."
        },
        {
            icon: <User className="h-6 w-6 text-primary" />,
            title: "Professional Counsellors",
            description: "Speak with licensed and experienced mental health professionals."
        },
        {
            icon: <Calendar className="h-6 w-6 text-primary" />,
            title: "Flexible Scheduling",
            description: "Find a time that works for you. Sessions are available online."
        }
    ]

    return (
        <div className="container mx-auto p-4 md:p-8">
             <div className="mx-auto max-w-3xl text-center">
                <h1 className="text-4xl font-bold tracking-tight font-headline sm:text-5xl">Book a Confidential Session</h1>
                <p className="mt-4 text-lg text-muted-foreground">
                    Taking the first step is a sign of strength. Our professional counsellors are here to support you in a safe and private environment.
                </p>
            </div>

            <div className="mt-12 grid gap-8 md:grid-cols-3">
                {features.map((feature, index) => (
                    <div key={index} className="flex flex-col items-center text-center">
                        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                           {feature.icon}
                        </div>
                        <h3 className="mt-4 text-lg font-semibold">{feature.title}</h3>
                        <p className="mt-1 text-sm text-muted-foreground">{feature.description}</p>
                    </div>
                ))}
            </div>
            
            <div className="mt-12 flex justify-center">
                <Card className="w-full max-w-lg text-center">
                    <CardHeader>
                        <CardTitle>Ready to Talk?</CardTitle>
                        <CardDescription>Click the button below to open our secure booking form and schedule your session.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Button asChild size="lg">
                            <Link href={bookingLink} target="_blank">
                                <CheckCircle className="mr-2"/>
                                Schedule Your Appointment
                            </Link>
                        </Button>
                        <p className="text-xs text-muted-foreground mt-4">You will be redirected to our secure booking partner to choose a time.</p>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
