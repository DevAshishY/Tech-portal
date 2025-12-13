"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function HomePage() {
  const router = useRouter();

  useEffect(() => {
    const loggedIn = localStorage.getItem("loggedIn") === "true";
    if (loggedIn) router.replace("/admin/dashboard");
    else router.replace("/admin/login");
  }, [router]);

  return null;
}
