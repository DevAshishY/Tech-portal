"use client";

import React, { useState } from "react";
import { TrendingUp, Users, FileText, Activity } from "lucide-react";

import { LineChart, Line, BarChart, Bar, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { useAnalytics } from "@/hooks/useAnalytics";

export default function Analytics() {
  const [activeTab, setActiveTab] = useState("users");

  const {
    userAnalytics,
    contentTrends,
    engagementRates,
    peakUsageTimes,
    avgSessionMinutes,
    contentPerDay,
    retentionRate,
    avgEngagementRate,
  } = useAnalytics();

  return (
    <main className="min-h-screen bg-linear-to-br from-indigo-50 via-purple-50 to-pink-50 dark:from-slate-950 dark:via-indigo-950 dark:to-slate-950 p-4 md:p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6 md:mb-8">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-slate-100">Analytics & Reports</h1>
          <p className="text-sm text-gray-600 dark:text-slate-400 mt-1">Comprehensive insights and data analysis</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-6 mb-6 md:mb-8">
          <div className="bg-white/80 dark:bg-slate-900/60 backdrop-blur-xl border border-gray-200 dark:border-slate-800/50 rounded-xl md:rounded-2xl p-4 md:p-6 hover:shadow-lg transition-all">
            <div className="flex items-center justify-between mb-2">
              <div className="text-xs md:text-sm text-gray-600 dark:text-slate-400">Avg Session Duration</div>
              <Activity className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
            </div>
            <div className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-slate-100">
              {avgSessionMinutes ? `${avgSessionMinutes}m` : "-"}
            </div>
            <div className="flex items-center gap-1 mt-1 text-xs text-green-600 dark:text-green-400">
              <TrendingUp className="h-3 w-3" />
              +5.2% from last week
            </div>
          </div>

          <div className="bg-white/80 dark:bg-slate-900/60 backdrop-blur-xl border border-gray-200 dark:border-slate-800/50 rounded-xl md:rounded-2xl p-4 md:p-6 hover:shadow-lg transition-all">
            <div className="flex items-center justify-between mb-2">
              <div className="text-xs md:text-sm text-gray-600 dark:text-slate-400">Content Creation Rate</div>
              <FileText className="h-4 w-4 text-purple-600 dark:text-purple-400" />
            </div>
            <div className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-slate-100">
              {contentPerDay ? `${contentPerDay.toLocaleString()}/day` : "-"}
            </div>
            <div className="flex items-center gap-1 mt-1 text-xs text-green-600 dark:text-green-400">
              <TrendingUp className="h-3 w-3" />
              +12.8% from last week
            </div>
          </div>

          <div className="bg-white/80 dark:bg-slate-900/60 backdrop-blur-xl border border-gray-200 dark:border-slate-800/50 rounded-xl md:rounded-2xl p-4 md:p-6 hover:shadow-lg transition-all">
            <div className="flex items-center justify-between mb-2">
              <div className="text-xs md:text-sm text-gray-600 dark:text-slate-400">User Retention Rate</div>
              <Users className="h-4 w-4 text-green-600 dark:text-green-400" />
            </div>
            <div className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-slate-100">
              {retentionRate ? `${retentionRate}%` : "-"}
            </div>
            <div className="flex items-center gap-1 mt-1 text-xs text-green-600 dark:text-green-400">
              <TrendingUp className="h-3 w-3" />
              +2.1% from last month
            </div>
          </div>

          <div className="bg-white/80 dark:bg-slate-900/60 backdrop-blur-xl border border-gray-200 dark:border-slate-800/50 rounded-xl md:rounded-2xl p-4 md:p-6 hover:shadow-lg transition-all">
            <div className="flex items-center justify-between mb-2">
              <div className="text-xs md:text-sm text-gray-600 dark:text-slate-400">Avg Engagement Rate</div>
              <TrendingUp className="h-4 w-4 text-yellow-600 dark:text-yellow-400" />
            </div>
            <div className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-slate-100">
              {avgEngagementRate ? `${avgEngagementRate}%` : "-"}
            </div>
            <div className="flex items-center gap-1 mt-1 text-xs text-green-600 dark:text-green-400">
              <TrendingUp className="h-3 w-3" />
              +8.3% from last week
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white/80 dark:bg-slate-900/60 backdrop-blur-xl border border-gray-200 dark:border-slate-800/50 rounded-xl md:rounded-2xl p-4 md:p-6 mb-6">
          <div className="flex flex-wrap gap-2 mb-6">
            <button
              onClick={() => setActiveTab("users")}
              className={`px-4 py-2.5 rounded-lg text-sm font-medium transition-all ${
                activeTab === "users"
                  ? "bg-indigo-600 text-white shadow-md"
                  : "bg-gray-100 dark:bg-slate-800/50 text-gray-700 dark:text-slate-300 hover:bg-gray-200 dark:hover:bg-slate-700"
              }`}
            >
              User Analytics
            </button>
            <button
              onClick={() => setActiveTab("content")}
              className={`px-4 py-2.5 rounded-lg text-sm font-medium transition-all ${
                activeTab === "content"
                  ? "bg-indigo-600 text-white shadow-md"
                  : "bg-gray-100 dark:bg-slate-800/50 text-gray-700 dark:text-slate-300 hover:bg-gray-200 dark:hover:bg-slate-700"
              }`}
            >
              Content Analytics
            </button>
            <button
              onClick={() => setActiveTab("engagement")}
              className={`px-4 py-2.5 rounded-lg text-sm font-medium transition-all ${
                activeTab === "engagement"
                  ? "bg-indigo-600 text-white shadow-md"
                  : "bg-gray-100 dark:bg-slate-800/50 text-gray-700 dark:text-slate-300 hover:bg-gray-200 dark:hover:bg-slate-700"
              }`}
            >
              Engagement Metrics
            </button>
            <button
              onClick={() => setActiveTab("usage")}
              className={`px-4 py-2.5 rounded-lg text-sm font-medium transition-all ${
                activeTab === "usage"
                  ? "bg-indigo-600 text-white shadow-md"
                  : "bg-gray-100 dark:bg-slate-800/50 text-gray-700 dark:text-slate-300 hover:bg-gray-200 dark:hover:bg-slate-700"
              }`}
            >
              Usage Patterns
            </button>
          </div>

          {/* Tab Content */}
          {activeTab === "users" && (
            <div>
              <h3 className="text-base md:text-lg font-semibold text-gray-900 dark:text-slate-100 mb-4">
                User Growth & Retention (Last 6 Months)
              </h3>
              <div className="w-full h-[300px] md:h-[350px]">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={userAnalytics}>
                    <defs>
                      <linearGradient id="colorActive" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                      </linearGradient>
                      <linearGradient id="colorSignups" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#a855f7" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="#a855f7" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" className="dark:stroke-slate-700" />
                    <XAxis dataKey="month" stroke="#6b7280" className="dark:stroke-slate-400" style={{ fontSize: '12px' }} />
                    <YAxis stroke="#6b7280" className="dark:stroke-slate-400" style={{ fontSize: '12px' }} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: 'rgba(255, 255, 255, 0.95)',
                        border: '1px solid #e5e7eb',
                        borderRadius: '8px',
                        fontSize: '12px'
                      }}
                    />
                    <Legend wrapperStyle={{ fontSize: '12px' }} />
                    <Area type="monotone" dataKey="activeUsers" stroke="#6366f1" fillOpacity={1} fill="url(#colorActive)" />
                    <Area type="monotone" dataKey="newSignups" stroke="#a855f7" fillOpacity={1} fill="url(#colorSignups)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>
          )}

          {activeTab === "content" && (
            <div>
              <h3 className="text-base md:text-lg font-semibold text-gray-900 dark:text-slate-100 mb-4">
                Content Creation Trends (This Month)
              </h3>
              <div className="w-full h-[300px] md:h-[350px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={contentTrends}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" className="dark:stroke-slate-700" />
                    <XAxis dataKey="week" stroke="#6b7280" className="dark:stroke-slate-400" style={{ fontSize: '12px' }} />
                    <YAxis stroke="#6b7280" className="dark:stroke-slate-400" style={{ fontSize: '12px' }} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: 'rgba(255, 255, 255, 0.95)',
                        border: '1px solid #e5e7eb',
                        borderRadius: '8px',
                        fontSize: '12px'
                      }}
                    />
                    <Legend wrapperStyle={{ fontSize: '12px' }} />
                    <Bar dataKey="posts" fill="#6366f1" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="reels" fill="#a855f7" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="stories" fill="#eab308" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          )}

          {activeTab === "engagement" && (
            <div>
              <h3 className="text-base md:text-lg font-semibold text-gray-900 dark:text-slate-100 mb-4">
                Engagement Rate by Content Type (This Week)
              </h3>
              <div className="w-full h-[300px] md:h-[350px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={engagementRates}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" className="dark:stroke-slate-700" />
                    <XAxis dataKey="day" stroke="#6b7280" className="dark:stroke-slate-400" style={{ fontSize: '12px' }} />
                    <YAxis stroke="#6b7280" className="dark:stroke-slate-400" style={{ fontSize: '12px' }} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: 'rgba(255, 255, 255, 0.95)',
                        border: '1px solid #e5e7eb',
                        borderRadius: '8px',
                        fontSize: '12px'
                      }}
                    />
                    <Legend wrapperStyle={{ fontSize: '12px' }} />
                    <Line type="monotone" dataKey="posts" stroke="#6366f1" strokeWidth={2} dot={{ fill: '#6366f1' }} />
                    <Line type="monotone" dataKey="reels" stroke="#a855f7" strokeWidth={2} dot={{ fill: '#a855f7' }} />
                    <Line type="monotone" dataKey="stories" stroke="#eab308" strokeWidth={2} dot={{ fill: '#eab308' }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          )}

          {activeTab === "usage" && (
            <div>
              <h3 className="text-base md:text-lg font-semibold text-gray-900 dark:text-slate-100 mb-4">
                Peak Usage Times (24 Hours)
              </h3>
              <div className="w-full h-[300px] md:h-[350px]">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={peakUsageTimes}>
                    <defs>
                      <linearGradient id="colorUsers" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#6366f1" stopOpacity={0.5} />
                        <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" className="dark:stroke-slate-700" />
                    <XAxis dataKey="hour" stroke="#6b7280" className="dark:stroke-slate-400" style={{ fontSize: '12px' }} />
                    <YAxis stroke="#6b7280" className="dark:stroke-slate-400" style={{ fontSize: '12px' }} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: 'rgba(255, 255, 255, 0.95)',
                        border: '1px solid #e5e7eb',
                        borderRadius: '8px',
                        fontSize: '12px'
                      }}
                    />
                    <Area type="monotone" dataKey="users" stroke="#6366f1" strokeWidth={2} fillOpacity={1} fill="url(#colorUsers)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}