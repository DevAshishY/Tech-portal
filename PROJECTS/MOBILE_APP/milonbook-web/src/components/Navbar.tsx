"use client";

import React, { useState } from "react";
import { Search, User, Settings, LogOut, ChevronDown, Menu } from "lucide-react";
import { useRouter } from "next/navigation";

export default function Navbar({
  collapsed,
  setCollapsed,
}: {
  collapsed: boolean;
  setCollapsed: (v: boolean) => void;
}) {
  const [searchQuery, setSearchQuery] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);
  const router = useRouter();

  const handleLogout = () => {
    localStorage.removeItem("loggedIn");
    router.replace("/login");
  };

  return (
    <header
      className={`fixed top-0 right-0 transition-all duration-300
     ${collapsed ? "left-20" : "left-72"}

      /* LIGHT THEME */
      bg-white/70 border-b border-slate-300/70 backdrop-blur-xl

      /* DARK THEME */
      dark:bg-slate-950/40 dark:border-slate-800/50

      h-16 z-30`}
    >
      <div className="h-full px-4 flex items-center justify-between">
        
        {/* LEFT SIDE : Sidebar Toggle + Search */}
        <div className="flex items-center gap-4">
          
          {/* SINGLE BUTTON TO CONTROL SIDEBAR */}
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="p-2 rounded-lg 
            hover:bg-slate-200/60 
            dark:hover:bg-slate-800/50 transition"
          >
            <Menu size={20} className="dark:text-slate-300 text-slate-700" />
          </button>

          {/* SEARCH BAR */}
          <div
            className="hidden md:flex items-center gap-2 
          bg-slate-100/80 dark:bg-slate-900/60 backdrop-blur-sm
          border border-slate-300/70 dark:border-slate-800/50
          rounded-full px-4 py-2 w-[260px] lg:w-[350px]"
          >
            <Search
              size={16}
              className="text-slate-500 dark:text-slate-400"
            />
            <input
              type="text"
              placeholder="Search users, content, or reports..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-transparent border-none outline-none text-sm 
              text-slate-700 dark:text-slate-200 placeholder:text-slate-400 w-full"
            />
          </div>
        </div>

        {/* RIGHT SECTION  */}
        <div className="flex items-center gap-4">
          {/* Profile Dropdown */}
          <div className="relative">
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="flex items-center gap-2 px-3 py-2 rounded-full 
              bg-slate-100/80 dark:bg-slate-900/60 backdrop-blur-sm 
              border border-slate-300/70 dark:border-slate-800/50
              hover:bg-slate-200/60 dark:hover:bg-slate-800/60 transition-colors"
            >
              <div
                className="w-8 h-8 rounded-full 
              bg-linear-to-br from-violet-600 to-indigo-600
              flex items-center justify-center text-white text-xs font-bold"
              >
                AD
              </div>
              <ChevronDown
                size={16}
                className="text-slate-600 dark:text-slate-400"
              />
            </button>

            {menuOpen && (
              <div
                className="absolute right-0 mt-2 w-56 
              bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl 
              border border-slate-300/70 dark:border-slate-800/50 
              rounded-2xl shadow-2xl overflow-hidden"
              >
                <div className="px-4 py-3 border-b border-slate-300/70 dark:border-slate-800/50">
                  <div className="text-sm font-medium text-slate-700 dark:text-slate-200">
                    Admin User
                  </div>
                  <div className="text-xs text-slate-500 dark:text-slate-400">
                    admin@example.com
                  </div>
                </div>

                <button
                  onClick={() => router.push("/admin/profile")}
                  className="flex items-center gap-3 w-full px-4 py-3 text-sm 
                  text-slate-700 dark:text-slate-300 
                  hover:bg-slate-200/40 dark:hover:bg-slate-800/50"
                >
                  <User size={16} />
                  <span>My Profile</span>
                </button>

                <button
                  className="flex items-center gap-3 w-full px-4 py-3 text-sm 
                  text-slate-700 dark:text-slate-300 
                  hover:bg-slate-200/40 dark:hover:bg-slate-800/50"
                >
                  <Settings size={16} />
                  <span>Settings</span>
                </button>

                <div className="border-t border-slate-300/70 dark:border-slate-800/50"></div>

                <button
                  onClick={handleLogout}
                  className="flex items-center gap-3 w-full px-4 py-3 text-sm 
                  text-red-500 hover:bg-red-500/10"
                >
                  <LogOut size={16} />
                  <span>Logout</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
