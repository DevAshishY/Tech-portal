"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";

export function useLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();
  
  const loginMutation = useMutation({
    mutationFn: async (variables: { username: string; password: string }) => {
      const response = await axios.post("/api/admin/login", variables, {
        headers: { "Content-Type": "application/json" },
        withCredentials: true,
      });
      return response.data as { success: boolean; token?: string; message?: string };
    },
    onMutate: () => {
      setError("");
    },
    onSuccess: (data) => {
      if (data.success && data.token) {
        localStorage.setItem("admin-token", data.token);
        localStorage.setItem("admin-auth", "true");
        localStorage.setItem("loggedIn", "true");
        router.push("/admin/dashboard");
      } else {
        setError(data.message || "Invalid Credentials");
      }
    },
    onError: (err: unknown) => {
      const axiosError = err as { response?: { data?: { message?: string } } };
      const message = axiosError.response?.data?.message || "Something went wrong";
      setError(message);
      console.error(err);
    },
  });

  const handleLogin = () => {
    if (!email || !password) return;
    loginMutation.mutate({ username: email, password });
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") handleLogin();
  };

  return {
    email,
    setEmail,
    password,
    setPassword,
    isLoading: loginMutation.isPending,
    error,
    handleLogin,
    handleKeyPress,
  };
}
