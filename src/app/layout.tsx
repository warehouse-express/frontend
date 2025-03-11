import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navigation from "@/components/layout/Navigation";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Warehouse Management System",
  description: "Marketplace for buyers and sellers",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-foreground min-h-screen flex flex-col`}
      >
        <Navigation />
        <main className="flex-1 container mx-auto px-4 py-8">{children}</main>
        <footer className="py-6 border-t border-gray-200 dark:border-gray-800">
          <div className="container mx-auto px-4 text-center text-sm">
            &copy; {new Date().getFullYear()} Warehouse Management System
          </div>
        </footer>
      </body>
    </html>
  );
}
