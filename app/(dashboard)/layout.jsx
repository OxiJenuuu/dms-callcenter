import "../globals.css";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import SessionProviders from "@/providers/SessionProvider";
import Navbar from "@/components/Navbar";
import DashboardAccessProvider from "@/providers/DashboardAccessProvider";

export const metadata = {
    title: "D-CC | Dashboard",
    description: "Welcome to dashboard",
};

export default async function RootLayout({ children }) {
    const session = await auth();

    if (!session?.user) redirect("/");

    return (
        <html lang="en">
        <body className="antialiased flex">
        <SessionProviders session={session}>
            <DashboardAccessProvider>
                <Navbar />
                <div className="flex-1 w-full h-screen bg-base-300">
                    {children}
                </div>
            </DashboardAccessProvider>
        </SessionProviders>
        </body>
        </html>
    );
}
