import { Toaster } from "@/components/ui/sonner";
import { QueryProvider } from "@/providers/query-provider";
import { SheetProvider } from "@/providers/sheet-provider";
import { ClerkProvider } from "@clerk/nextjs";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Finance Tracker",
  description:
    "Take control of your financial journey with Finance Tracker, your ultimate tool for managing, monitoring, and maximizing your money. Designed with simplicity and functionality in mind, Finance Tracker empowers you to stay on top of your finances effortlessly",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body className={inter.className}>
          <QueryProvider>
            <SheetProvider />
            <Toaster />

            {children}
          </QueryProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
