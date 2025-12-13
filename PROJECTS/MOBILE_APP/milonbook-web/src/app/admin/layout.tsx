"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Sidebar from "@/components/Sidebar";
import Navbar from "@/components/Navbar";
import QueryProvider from "../providers/QueryProvider";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();

  // ✅ FIX: compute initial collapsed state safely
  const [collapsed, setCollapsed] = useState<boolean | null>(() => {
    if (typeof window === "undefined") return null;
    return window.innerWidth < 768;
  });

  useEffect(() => {
    const handleCollapse = () => {
      setCollapsed(window.innerWidth < 768);
    };

    window.addEventListener("resize", handleCollapse);
    return () => window.removeEventListener("resize", handleCollapse);
  }, []);

  // -----------------------------------------
  // AUTH CHECK
  // -----------------------------------------

  const [isAuthorized, setIsAuthorized] = useState<boolean | null>(null);

  useEffect(() => {
    const adminFlag = localStorage.getItem("admin-auth");
    const token = localStorage.getItem("milon_token");

    if (adminFlag === "true" || (token && token.length > 10)) {
      setIsAuthorized(true);
    } else {
      setIsAuthorized(false);
    }
  }, []);

  useEffect(() => {
    if (isAuthorized === false) {
      router.replace("/login");
    }
  }, [isAuthorized, router]);

  // -----------------------------------------

  if (isAuthorized === null || collapsed === null) return null;

  return (
    <QueryProvider>
      <div className="flex">
        <Sidebar collapsed={collapsed} setCollapsed={setCollapsed} />

        <div
          className={`
            flex-1 min-h-screen transition-all duration-300
            ${collapsed ? "ml-20" : "ml-72"}
          `}
        >
          <Navbar collapsed={collapsed} setCollapsed={setCollapsed} />
          <main className="p-6 mt-16">{children}</main>
        </div>
      </div>
    </QueryProvider>
  );
}
