"use client";

import React, { useEffect, useMemo, useState } from "react";
import ChartCard from "@/components/ChartCard";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  Legend,
  CartesianGrid,
  PieLabelRenderProps,
} from "recharts";
import { Users, Activity, Sparkles, TrendingUp } from "lucide-react";
import { useUserStats, useUsers } from "@/hooks/useUsers";
import { usePosts } from "@/hooks/usePosts";
import { useReels } from "@/hooks/useReels";
import { useStories } from "@/hooks/useStories";

/* ---------------- Dummy Data ---------------- */
const userGrowthData = Array.from({ length: 30 }).map((_, idx) => ({
  date: `Day ${idx + 1}`,
  users: Math.round(20000 + Math.sin(idx / 5) * 900 + idx * 150),
}));

const engagementWeekFallback = [
  { day: "Mon", posts: 0, comments: 0, shares: 0 },
  { day: "Tue", posts: 0, comments: 0, shares: 0 },
  { day: "Wed", posts: 0, comments: 0, shares: 0 },
  { day: "Thu", posts: 0, comments: 0, shares: 0 },
  { day: "Fri", posts: 0, comments: 0, shares: 0 },
  { day: "Sat", posts: 0, comments: 0, shares: 0 },
  { day: "Sun", posts: 0, comments: 0, shares: 0 },
];

const contentDistribution = [
  { name: "Posts", value: 45 },
  { name: "Stories", value: 25 },
  { name: "Reels", value: 18 },
];

const recentActivity = [
  { id: 1, text: "john_doe uploaded a new photo", time: "3m ago" },
  { id: 2, text: "new_user_91 registered", time: "10m ago" },
  { id: 3, text: "amelia reported a comment", time: "1h ago" },
  { id: 4, text: "mike started a new community", time: "2h ago" },
  { id: 5, text: "sara liked a post", time: "4h ago" },
];

const COLORS = ["#7C3AED", "#06B6D4", "#F97316"];

/* ---------------- Components ---------------- */
interface MetricCardProps {
  title: string;
  value: string | number;
  icon?: React.ComponentType<{ size?: number; className?: string }>;
  delta?: string;
  loading?: boolean;
  color?: string;
}

function MetricCard({ title, value, icon: Icon, delta, loading, color = "from-blue-500 to-cyan-500" }: MetricCardProps) {
  return (
    <div className="group relative bg-slate-900/40 backdrop-blur-xl border border-slate-800/50 rounded-2xl p-6 hover:bg-slate-900/60 transition-all duration-300 hover:shadow-2xl hover:shadow-violet-500/10 hover:border-slate-700/50">
      <div className="flex items-start justify-between mb-4">
        <div>
          <p className="text-sm text-slate-400 mb-1">{title}</p>
          <h3 className="text-3xl font-bold text-slate-100">
            {loading ? (
              <div className="h-9 w-32 animate-pulse bg-slate-700/50 rounded" />
            ) : (
              value
            )}
          </h3>
        </div>
        <div className={`w-12 h-12 rounded-xl bg-linear-to-br ${color} flex items-center justify-center shadow-lg`}>
          {Icon ? (
            <Icon size={24} className="text-white" />
          ) : (
            <Sparkles size={24} className="text-white" />
          )}
        </div>
      </div>
      {delta && (
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1 text-green-400 text-sm font-medium">
            <TrendingUp size={16} />
            <span>{delta}</span>
          </div>
          <span className="text-xs text-slate-500">vs last month</span>
        </div>
      )}
      {/* Sparkline placeholder */}
      <div className="absolute bottom-0 left-0 right-0 h-16 opacity-20">
        <svg className="w-full h-full" viewBox="0 0 100 40" preserveAspectRatio="none">
          <polyline
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            points="0,30 20,25 40,28 60,15 80,20 100,10"
            className="text-violet-400"
          />
        </svg>
      </div>
    </div>
  );
}

function RecentActivity({ items }: { items: typeof recentActivity }) {
  return (
    <div className="bg-slate-900/40 backdrop-blur-xl border border-slate-800/50 rounded-2xl p-6 h-full">
      <div className="text-xl font-bold text-slate-100 mb-4">
        Recent Activity
      </div>
      <ul className="space-y-3">
        {items.map((it) => (
          <li
            key={it.id}
            className="flex items-start gap-3 py-3 px-3 hover:bg-slate-800/30 rounded-lg transition-colors"
          >
            <div className="h-10 w-10 rounded-full bg-linear-to-br from-violet-600 to-indigo-600 flex items-center justify-center text-white text-sm font-bold shadow-lg shrink-0">
              {it.text.charAt(0).toUpperCase()}
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-sm font-medium text-slate-200 leading-snug">
                {it.text}
              </div>
              <div className="text-xs text-slate-500 mt-1">{it.time}</div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

/* ---------------- Label Renderer ---------------- */
const renderPieLabel = (props: PieLabelRenderProps): string => {
  const { name, percent } = props;
  const safeName = name ?? "";
  const safePercent = percent ?? 0;
  return `${safeName} ${Math.round(safePercent * 100)}%`;
};

/* ---------------- Page ---------------- */
export default function DashboardPage() {
  const { data: userStats, isLoading: userStatsLoading } = useUserStats();
  const { data: usersData, isLoading: usersLoading } = useUsers();
  const { data: postsData, isLoading: postsLoading } = usePosts({ limit: 500 });
  const { data: reelsData, isLoading: reelsLoading } = useReels({ limit: 500 });
  const { data: storiesData, isLoading: storiesLoading } = useStories({ limit: 500 });

  const loading =
    userStatsLoading ||
    usersLoading ||
    postsLoading ||
    reelsLoading ||
    storiesLoading;

  const users = usersData ?? [];
  const posts = postsData?.posts ?? [];
  const reels = reelsData?.reels ?? [];
  const stories = storiesData?.stories ?? [];

  const lineData = useMemo(() => {
    if (!users.length) {
      return userGrowthData;
    }

    const now = new Date();
    const createdDates = users
      .map((u: any) => new Date(u.createdAt))
      .filter((d) => !Number.isNaN(d.getTime()))
      .sort((a, b) => a.getTime() - b.getTime());

    const result: { date: string; users: number }[] = [];
    let index = 0;

    for (let i = 29; i >= 0; i--) {
      const day = new Date();
      day.setDate(now.getDate() - i);
      day.setHours(23, 59, 59, 999);

      while (index < createdDates.length && createdDates[index].getTime() <= day.getTime()) {
        index += 1;
      }

      result.push({
        date: day.toLocaleDateString(undefined, { month: "short", day: "numeric" }),
        users: index,
      });
    }

    return result;
  }, [users]);

  const barData = useMemo(() => {
    if (!posts.length && !reels.length) {
      return engagementWeekFallback;
    }

    const now = new Date();
    const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

    const buckets: Record<string, { day: string; posts: number; comments: number; shares: number }> = {};

    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(now.getDate() - i);
      const key = d.toISOString().slice(0, 10);
      const day = dayNames[d.getDay()];
      buckets[key] = { day, posts: 0, comments: 0, shares: 0 };
    }

    const addItem = (createdAt: string, isPost: boolean, commentsCount: number, sharesCount: number) => {
      const date = new Date(createdAt);
      const key = date.toISOString().slice(0, 10);
      const bucket = buckets[key];
      if (!bucket) return;

      if (isPost) {
        bucket.posts += 1;
      }

      bucket.comments += commentsCount || 0;
      bucket.shares += sharesCount || 0;
    };

    posts.forEach((p: any) => addItem(p.createdAt, true, p.commentsCount, p.sharesCount));
    reels.forEach((r: any) => addItem(r.createdAt, false, r.commentsCount, r.sharesCount));

    return Object.values(buckets);
  }, [posts, reels]);

  const pieData = useMemo(() => {
    const postsCount = posts.length;
    const reelsCount = reels.length;
    const storiesCount = stories.length;

    const total = postsCount + reelsCount + storiesCount;

    if (!total) {
      return contentDistribution;
    }

    return [
      { name: "Posts", value: postsCount },
      { name: "Stories", value: storiesCount },
      { name: "Reels", value: reelsCount },
    ];
  }, [posts, reels, stories]);

  const formatTimeAgo = (date: Date) => {
    const diffMs = Date.now() - date.getTime();
    const diffMinutes = Math.floor(diffMs / 60000);
    if (diffMinutes < 1) return "just now";
    if (diffMinutes < 60) return `${diffMinutes}m ago`;
    const diffHours = Math.floor(diffMinutes / 60);
    if (diffHours < 24) return `${diffHours}h ago`;
    const diffDays = Math.floor(diffHours / 24);
    return `${diffDays}d ago`;
  };

  const activityData = useMemo(() => {
    const items: { id: string; text: string; time: string; createdAt: Date }[] = [];

    users.forEach((u: any) => {
      const createdAt = new Date(u.createdAt);
      if (!Number.isNaN(createdAt.getTime())) {
        items.push({
          id: `user-${u._id}`,
          text: `${u.name} joined MilonBook`,
          time: formatTimeAgo(createdAt),
          createdAt,
        });
      }
    });

    posts.forEach((p: any) => {
      const createdAt = new Date(p.createdAt);
      if (!Number.isNaN(createdAt.getTime())) {
        const authorName = p.userId?.name || p.username || "A user";
        items.push({
          id: `post-${p._id}`,
          text: `${authorName} created a post`,
          time: formatTimeAgo(createdAt),
          createdAt,
        });
      }
    });

    reels.forEach((r: any) => {
      const createdAt = new Date(r.createdAt);
      if (!Number.isNaN(createdAt.getTime())) {
        const authorName = r.userId?.name || "A user";
        items.push({
          id: `reel-${r._id}`,
          text: `${authorName} uploaded a reel`,
          time: formatTimeAgo(createdAt),
          createdAt,
        });
      }
    });

    if (!items.length) {
      return recentActivity;
    }

    items.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());

    return items.slice(0, 5).map((it, index) => ({
      id: index + 1,
      text: it.text,
      time: it.time,
    }));
  }, [users, posts, reels]);

  const engagementRate = useMemo(() => {
    const last7DaysLimit = new Date();
    last7DaysLimit.setDate(last7DaysLimit.getDate() - 7);

    const recentPosts = posts.filter((p: any) => {
      const d = new Date(p.createdAt);
      return !Number.isNaN(d.getTime()) && d >= last7DaysLimit;
    });

    const recentReels = reels.filter((r: any) => {
      const d = new Date(r.createdAt);
      return !Number.isNaN(d.getTime()) && d >= last7DaysLimit;
    });

    const items = [...recentPosts, ...recentReels];
    if (!items.length) return 0;

    let totalInteractions = 0;
    items.forEach((item: any) => {
      totalInteractions += (item.likesCount || 0) + (item.commentsCount || 0) + (item.sharesCount || 0);
    });

    const rate = (totalInteractions / items.length) * 100;
    if (!Number.isFinite(rate)) return 0;
    return Number(rate.toFixed(1));
  }, [posts, reels]);

  return (
    <main className="min-h-screen bg-linear-to-br from-slate-950 via-slate-900 to-slate-950 p-6">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-100">
          Dashboard Overview (DO Test)
        </h1>
        <p className="text-sm text-slate-400 mt-1">
          Welcome back — here&apos;s what&apos;s happening today.
        </p>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <MetricCard
          title="Total Users"
          value={userStats ? userStats.totalUsers.toLocaleString() : "-"}
          icon={Users}
          delta="+4.5%"
          loading={loading}
          color="from-blue-500 to-cyan-500"
        />
        <MetricCard
          title="Active Today"
          value={userStats ? userStats.activeUsers.toLocaleString() : "-"}
          icon={Activity}
          delta="+1.2%"
          loading={loading}
          color="from-green-500 to-emerald-500"
        />
        <MetricCard
          title="Engagement Rate"
          value={`${engagementRate}%`}
          icon={Sparkles}
          delta="+0.4%"
          loading={loading}
          color="from-violet-500 to-purple-500"
        />
        <MetricCard
          title="Reported Content"
          value="0"
          icon={Activity}
          delta="-2%"
          loading={loading}
          color="from-orange-500 to-red-500"
        />
      </div>

      {/* Charts Row 1: Line Chart + Pie Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <div className="lg:col-span-2">
          <ChartCard title="User Growth (Last 30 Days)" loading={loading}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={lineData}>
                <CartesianGrid stroke="#334155" strokeDasharray="3 3" />
                <XAxis
                  dataKey="date"
                  tick={{ fontSize: 12, fill: "#94a3b8" }}
                  stroke="#475569"
                />
                <YAxis tick={{ fontSize: 12, fill: "#94a3b8" }} stroke="#475569" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#1e293b",
                    border: "1px solid #334155",
                    borderRadius: "8px",
                    color: "#e2e8f0"
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="users"
                  stroke="#7C3AED"
                  strokeWidth={3}
                  dot={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </ChartCard>
        </div>

        <div>
          <ChartCard title="Content Distribution" loading={loading}>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  dataKey="value"
                  innerRadius="55%"
                  outerRadius="80%"
                  labelLine={false}
                  label={renderPieLabel}
                >
                  {pieData.map((entry, i) => (
                    <Cell
                      key={entry.name}
                      fill={COLORS[i % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Legend
                  verticalAlign="bottom"
                  iconType="circle"
                  wrapperStyle={{ fontSize: "12px", color: "#94a3b8" }}
                />
              </PieChart>
            </ResponsiveContainer>
          </ChartCard>
        </div>
      </div>

      {/* Charts Row 2: Bar Chart + Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <ChartCard
            title="Engagement Metrics (This Week)"
            loading={loading}
          >
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={barData}>
                <CartesianGrid stroke="#334155" strokeDasharray="3 3" />
                <XAxis
                  dataKey="day"
                  tick={{ fontSize: 12, fill: "#94a3b8" }}
                  stroke="#475569"
                />
                <YAxis tick={{ fontSize: 12, fill: "#94a3b8" }} stroke="#475569" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#1e293b",
                    border: "1px solid #334155",
                    borderRadius: "8px",
                    color: "#e2e8f0"
                  }}
                />
                <Legend
                  wrapperStyle={{ fontSize: "12px" }}
                  iconType="circle"
                />
                <Bar
                  dataKey="posts"
                  stackId="a"
                  fill="#7C3AED"
                  radius={[6, 6, 0, 0]}
                />
                <Bar dataKey="comments" stackId="a" fill="#06B6D4" />
                <Bar dataKey="shares" stackId="a" fill="#F97316" />
              </BarChart>
            </ResponsiveContainer>
          </ChartCard>
        </div>

        <div>
          <RecentActivity items={activityData} />
        </div>
      </div>
    </main>
  );
}