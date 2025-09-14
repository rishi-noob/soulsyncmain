
"use client";

import { Header } from "@/components/header";

export default function AuthLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <div className="min-h-screen bg-background flex flex-col">
            <Header />
            <main className="flex-1 flex flex-col">
              {children}
            </main>
        </div>
    )
}

    