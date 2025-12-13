"use client";

import React, { useState } from "react";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Activity,
  Users,
  Shield,
  BarChart3,
  MessageSquare,
  Bell,
  Settings,
  FileText,
  ChevronDown,
  ChevronRight,
  Image as ImageIcon,
  Video,
  Clock,
} from "lucide-react";

type IconComponent = React.ComponentType<React.SVGProps<SVGSVGElement>>;

type SidebarSubItem = {
  label: string;
  href: string;
  icon: IconComponent;
};

type SidebarItem = {
  label: string;
  href: string;
  icon: IconComponent;
  subItems?: SidebarSubItem[];
};

interface SidebarProps {
  collapsed: boolean;
  setCollapsed: React.Dispatch<React.SetStateAction<boolean | null>>;
}

export default function Sidebar(
{ collapsed, setCollapsed }: SidebarProps
) {


//   export default function Sidebar({
//   collapsed,
// }: {
//   collapsed: boolean;
// }) {

  const pathname = usePathname();
  const [moderationOpen, setModerationOpen] = useState(true);

  const menuItems: SidebarItem[] = [
    { label: "Dashboard", icon: Activity, href: "/admin/dashboard" },
    { label: "User Management", icon: Users, href: "/admin/users" },
    {
      label: "Content Moderation",
      icon: Shield,
      href: "/admin/moderation",
      subItems: [
        { label: "Posts", href: "/admin/moderation/posts", icon: ImageIcon },
        { label: "Reels", href: "/admin/moderation/reels", icon: Video },
        { label: "Stories", href: "/admin/moderation/stories", icon: Clock },
      ],
    },
    { label: "Analytics", icon: BarChart3, href: "/admin/analytics" },
    { label: "Messaging & Groups", icon: MessageSquare, href: "/admin/messaging" },
    { label: "Notifications", icon: Bell, href: "/admin/notifications" },
    { label: "Settings", icon: Settings, href: "/admin/settings" },
    { label: "System Logs", icon: FileText, href: "/admin/logs" },
  ];

  return (
    <aside
      className={`fixed left-0 top-0 h-screen bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 transition-all duration-300 ease-in-out z-30 flex flex-col overflow-hidden ${
        collapsed ? "w-20" : "w-72"
      }`}
    >
      {/* Header */}
      <div className="p-4 border-b border-slate-200 dark:border-slate-800 shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-linear-to-br from-violet-600 to-indigo-600 flex items-center justify-center shrink-0">
            <span className="text-white font-bold text-lg">M</span>
          </div>
          {!collapsed && (
            <div className="overflow-hidden">
              <h1 className="text-xl font-bold text-slate-800 dark:text-white truncate">
                Milonbook
              </h1>
              <p className="text-xs text-slate-500 dark:text-slate-400 truncate">
                Admin Panel
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Menu Items */}
      <nav 
        className="flex-1 p-4"
        style={{
          overflowY: 'auto',
          scrollbarWidth: 'none',
          msOverflowStyle: 'none',
          WebkitOverflowScrolling: 'touch'
        }}
      >
        <style dangerouslySetInnerHTML={{
          __html: `
            nav::-webkit-scrollbar {
              display: none;
            }
          `
        }} />
        {!collapsed && (
          <p className="text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-3 px-3">
            Main Menu
          </p>
        )}
        {menuItems.map((item) => {
          const isActive = pathname === item.href;
          const subItems = item.subItems ?? [];
          const hasSubItems = subItems.length > 0;
          const isParentActive = hasSubItems && subItems.some((sub) => pathname === sub.href);

          if (hasSubItems) {
            return (
              <div key={item.label} className="mb-1">
                {/* Parent Item */}
                <Link
                  href={item.href}
                  onClick={(e) => {
                    if (!collapsed) {
                      e.preventDefault();
                      setModerationOpen(!moderationOpen);
                    }
                  }}
                  className={`group w-full flex items-center gap-3 px-3 py-3 rounded-xl transition-all ${
                    isActive || isParentActive
                      ? "bg-linear-to-br from-violet-600 to-indigo-600 text-white shadow-lg shadow-violet-500/20"
                      : "text-slate-600 dark:text-slate-400 hover:bg-slate-200/60 dark:hover:bg-slate-800/40 hover:text-slate-900 dark:hover:text-slate-200"
                  } ${collapsed ? "justify-center" : ""}`}
                >
                  <item.icon className="w-5 h-5 shrink-0" />
                  {!collapsed && (
                    <>
                      <span className="font-medium flex-1 truncate">{item.label}</span>
                      {moderationOpen ? (
                        <ChevronDown className="w-4 h-4 shrink-0" />
                      ) : (
                        <ChevronRight className="w-4 h-4 shrink-0" />
                      )}
                    </>
                  )}
                </Link>

                {/* Sub Items */}
                {moderationOpen && (
                  <div
                    className={`space-y-1 mt-1 ${
                      collapsed ? "ml-0" : "ml-6"
                    } transition-all duration-200 ease-in-out`}
                  >
                    {subItems.map((subItem) => {
                      const isSubActive = pathname === subItem.href;
                      const SubIcon = subItem.icon;
                      return (
                        <Link
                          key={subItem.href}
                          href={subItem.href}
                          className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all ${
                            isSubActive
                              ? "bg-violet-100 dark:bg-violet-900/20 text-violet-600 dark:text-violet-400 font-medium"
                              : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800/40 hover:text-slate-900 dark:hover:text-slate-200"
                          } ${collapsed ? "justify-center" : ""}`}
                        >
                          <SubIcon className="w-4 h-4 shrink-0" />
                          {!collapsed && (
                            <span className="text-sm truncate">{subItem.label}</span>
                          )}
                        </Link>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          }

          return (
            <Link
              key={item.label}
              href={item.href}
              className={`group relative flex items-center gap-3 px-3 py-3 mb-1 rounded-xl transition-all ${
                isActive
                  ? "bg-linear-to-br from-violet-600 to-indigo-600 text-white shadow-lg shadow-violet-500/20"
                  : "text-slate-600 dark:text-slate-400 hover:bg-slate-200/60 dark:hover:bg-slate-800/40 hover:text-slate-900 dark:hover:text-slate-200"
              } ${collapsed ? "justify-center" : ""}`}
            >
              <item.icon className="w-5 h-5 shrink-0" />
              {!collapsed && <span className="font-medium truncate">{item.label}</span>}
              {isActive && !collapsed && (
                <div className="absolute right-3 w-1.5 h-6 bg-white rounded-full" />
              )}
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-slate-200 dark:border-slate-800 shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-linear-to-br from-violet-600 to-indigo-600 flex items-center justify-center text-white font-bold shrink-0">
            AD
          </div>
          {!collapsed && (
            <div className="flex-1 overflow-hidden">
              <p className="text-sm font-medium text-slate-800 dark:text-white truncate">
                Admin User
              </p>
              <p className="text-xs text-slate-500 dark:text-slate-400 truncate">
                Super Admin
              </p>
            </div>
          )}
        </div>
      </div>
    </aside>
  );
}
