"use client";

import "./globals.css";
import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";
import QueryProvider from "./providers/QueryProvider";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    
    if (typeof window === "undefined") return;

    const loggedIn = localStorage.getItem("loggedIn") === "true";

    if (!loggedIn && pathname !== "/login") {
      router.replace("/login");
      return;
    }

    if (loggedIn && pathname === "/login") {
      router.replace("/admin/dashboard");
      return;
    }

    if (pathname === "/") {
      router.replace(loggedIn ? "/admin/dashboard" : "/login");
    }
  }, [pathname, router]);

  return (
    <html lang="en">
      <head>
        <title>MilonBook</title>
      </head>
      <body className="bg-gray-950 text-gray-100">
        <QueryProvider>{children}</QueryProvider>
      </body>
    </html>
  );
}
