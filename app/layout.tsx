import NavBar from "@/components/NavBar";
import "./globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { cn } from "@/lib/utils";
import TanstackProvider from "@/lib/providers/TanstackProvider";
import { Toaster } from "@/components/ui/toaster";
import { NextThemeProvider } from "@/lib/providers/NextThemeProvider";

const inter = Inter({ subsets: ["cyrillic-ext"] });

export const metadata: Metadata = {
  title: "Youtube chapters generator",
  description: "Generate Youtube chapters with AI",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={cn(inter.className, "min-h-screen")}>
        <NextThemeProvider>
          <TanstackProvider>
            <NavBar />
            <div className="container max-w-7xl">{children}</div>
          </TanstackProvider>
          <Toaster />
        </NextThemeProvider>
      </body>
    </html>
  );
}
