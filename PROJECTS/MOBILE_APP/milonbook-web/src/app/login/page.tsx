"use client";

import Image from "next/image";
import { useLogin } from "@/hooks/useLogin";

export default function AdminLoginPage() {
  const {
    email,
    setEmail,
    password,
    setPassword,
    isLoading,
    error,
    handleLogin,
    handleKeyPress,
  } = useLogin();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-slate-100 px-4 py-8">
      <div className="flex flex-col items-center mb-8">
        <div className="relative w-28 h-28 mb-4">
          <Image
            src="/logo/logo.webp"
            alt="MilonBook Logo"
            width={112}
            height={112}
            className="w-full h-full object-contain"
          />
        </div>
        <h1 className="text-2xl font-semibold text-slate-800 mb-1">
          Welcome Back to <span className="text-purple-600">MilonBook</span>
        </h1>
      </div>

      <div className="w-full max-w-lg">
        <div className="mx-auto max-w-md rounded-4xl bg-white p-0.5 shadow-2xl shadow-purple-300/40">
          <div className="rounded-4xl bg-white p-8 sm:p-10 border border-slate-100">
            <div className="space-y-5">
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-slate-700">Email or Phone</label>
                <input
                  type="email"
                  placeholder="admin@milonbook.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onKeyPress={handleKeyPress}
                  className="w-full px-4 py-4 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent"
                />
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-semibold text-slate-700">Password</label>
                <input
                  type="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onKeyPress={handleKeyPress}
                  className="w-full px-4 py-4 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent"
                />
              </div>

              {error && <p className="text-red-500 text-sm mt-1">{error}</p>}

              <button
                onClick={handleLogin}
                disabled={isLoading || !email || !password}
                className="w-full py-3.5 mt-4 rounded-xl bg-linear-to-r from-cyan-400 via-purple-500 to-pink-500 text-white font-semibold text-sm shadow-md disabled:opacity-60 disabled:cursor-not-allowed hover:shadow-lg transition-all"
              >
                {isLoading ? "Authenticating..." : "Log In"}
              </button>

              <div className="pt-6 text-center text-xs text-slate-400">
                <p>© 2025 MilonBook Command Center. All rights reserved.</p>
                <p className="mt-2 text-[11px]">Secure Admin Access</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
