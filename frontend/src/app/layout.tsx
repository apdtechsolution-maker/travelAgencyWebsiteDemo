import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import "./globals.css";
import { ThemeProvider } from "@/components/ThemeProvider";

export const metadata: Metadata = {
  title: "Aura Voyages — Experiential Holidays from Vadodara",
  description:
    "Domestic and international holidays designed in Vadodara. Preview routes, shape the stay, and hold a seat — with Jain kitchens and an in-house visa desk.",
};

export const viewport: Viewport = {
  themeColor: "#121816",
  width: "device-width",
  initialScale: 1,
};

const themeBoot = `try{if(localStorage.getItem("aura-atmosphere")==="night")document.documentElement.classList.add("dark")}catch(e){}`;

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeBoot }} />
      </head>
      <body className="min-h-screen antialiased">
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}
