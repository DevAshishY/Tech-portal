"use client";

import { useMemo } from "react";
import { useUsers, type User } from "./useUsers";
import { usePosts } from "./usePosts";
import { useReels, type Reel } from "./useReels";
import { useStories, type Story as StoryType } from "./useStories";

interface UserAnalyticsPoint {
  month: string;
  activeUsers: number;
  newSignups: number;
  churnRate: number;
}

interface ContentTrendsPoint {
  week: string;
  posts: number;
  reels: number;
  stories: number;
}

interface EngagementRatesPoint {
  day: string;
  posts: number;
  reels: number;
  stories: number;
}

interface PeakUsagePoint {
  hour: string;
  users: number;
}

export interface AnalyticsData {
  userAnalytics: UserAnalyticsPoint[];
  contentTrends: ContentTrendsPoint[];
  engagementRates: EngagementRatesPoint[];
  peakUsageTimes: PeakUsagePoint[];
  avgSessionMinutes: number;
  contentPerDay: number;
  retentionRate: number;
  avgEngagementRate: number;
  loading: boolean;
}

const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

interface PostSummary {
  createdAt: string;
  likesCount?: number;
  commentsCount?: number;
  sharesCount?: number;
}

export const useAnalytics = (): AnalyticsData => {
  const { data: usersData, isLoading: usersLoading } = useUsers();
  const { data: postsData, isLoading: postsLoading } = usePosts({ limit: 1000 });
  const { data: reelsData, isLoading: reelsLoading } = useReels({ limit: 1000 });
  const { data: storiesData, isLoading: storiesLoading } = useStories({ limit: 1000 });

  const users = useMemo<User[]>(() => usersData ?? [], [usersData]);
  const posts = useMemo<PostSummary[]>(
    () => {
      const raw = (postsData?.posts ?? []) as Array<{
        createdAt: string;
        likesCount?: number;
        commentsCount?: number;
        sharesCount?: number;
      }>;

      return raw.map((p) => ({
        createdAt: p.createdAt,
        likesCount: p.likesCount,
        commentsCount: p.commentsCount,
        sharesCount: p.sharesCount,
      }));
    },
    [postsData]
  );
  const reels = useMemo<Reel[]>(() => reelsData?.reels ?? [], [reelsData]);
  const stories = useMemo<StoryType[]>(() => storiesData?.stories ?? [], [storiesData]);

  const loading = usersLoading || postsLoading || reelsLoading || storiesLoading;

  const userAnalytics: UserAnalyticsPoint[] = useMemo(() => {
    if (!users.length) {
      return [];
    }

    const now = new Date();
    const points: UserAnalyticsPoint[] = [];

    // last 7 months including current
    for (let i = 6; i >= 0; i--) {
      const d = new Date(now);
      d.setMonth(now.getMonth() - i);
      const monthLabel = d.toLocaleDateString(undefined, { month: "short" });

      const monthStart = new Date(d.getFullYear(), d.getMonth(), 1);
      const monthEnd = new Date(d.getFullYear(), d.getMonth() + 1, 0, 23, 59, 59, 999);

      let activeUsers = 0;
      let newSignups = 0;

      users.forEach((u: User) => {
        const created = new Date(u.createdAt);
        if (Number.isNaN(created.getTime())) return;

        if (created <= monthEnd) {
          activeUsers += 1;
        }
        if (created >= monthStart && created <= monthEnd) {
          newSignups += 1;
        }
      });

      points.push({
        month: monthLabel,
        activeUsers,
        newSignups,
        churnRate: 0,
      });
    }

    return points;
  }, [users]);

  const contentTrends: ContentTrendsPoint[] = useMemo(() => {
    const now = new Date();

    // last 4 weeks (7-day windows)
    const weeks: ContentTrendsPoint[] = [];
    for (let i = 3; i >= 0; i--) {
      const weekStart = new Date(now);
      weekStart.setDate(now.getDate() - (i + 1) * 7);
      const weekEnd = new Date(now);
      weekEnd.setDate(now.getDate() - i * 7);

      const label = `Week ${4 - i}`;

      let postsCount = 0;
      let reelsCount = 0;
      let storiesCount = 0;

      posts.forEach((p) => {
        const d = new Date(p.createdAt);
        if (!Number.isNaN(d.getTime()) && d >= weekStart && d <= weekEnd) {
          postsCount += 1;
        }
      });

      reels.forEach((r) => {
        const d = new Date(r.createdAt);
        if (!Number.isNaN(d.getTime()) && d >= weekStart && d <= weekEnd) {
          reelsCount += 1;
        }
      });

      stories.forEach((s) => {
        const d = new Date(s.createdAt ?? s.expiresAt ?? new Date());
        if (!Number.isNaN(d.getTime()) && d >= weekStart && d <= weekEnd) {
          storiesCount += 1;
        }
      });

      weeks.push({ week: label, posts: postsCount, reels: reelsCount, stories: storiesCount });
    }

    return weeks;
  }, [posts, reels, stories]);

  const engagementRates: EngagementRatesPoint[] = useMemo(() => {
    const now = new Date();
    const days: EngagementRatesPoint[] = [];

    for (let i = 6; i >= 0; i--) {
      const d = new Date(now);
      d.setDate(now.getDate() - i);
      const dayLabel = dayNames[d.getDay()];

      const dayStart = new Date(d.getFullYear(), d.getMonth(), d.getDate());
      const dayEnd = new Date(d.getFullYear(), d.getMonth(), d.getDate(), 23, 59, 59, 999);

      let postsRate = 0;
      let reelsRate = 0;
      let storiesRate = 0;
      let postsCount = 0;
      let reelsCount = 0;
      let storiesCount = 0;

      posts.forEach((p) => {
        const created = new Date(p.createdAt);
        if (Number.isNaN(created.getTime()) || created < dayStart || created > dayEnd) return;
        postsCount += 1;
        postsRate += (p.likesCount || 0) + (p.commentsCount || 0) + (p.sharesCount || 0);
      });

      reels.forEach((r) => {
        const created = new Date(r.createdAt);
        if (Number.isNaN(created.getTime()) || created < dayStart || created > dayEnd) return;
        reelsCount += 1;
        reelsRate += (r.likesCount || 0) + (r.commentsCount || 0) + (r.sharesCount || 0);
      });

      stories.forEach((s) => {
        const created = new Date(s.createdAt ?? s.expiresAt ?? new Date());
        if (Number.isNaN(created.getTime()) || created < dayStart || created > dayEnd) return;
        storiesCount += 1;
        storiesRate += (s.viewCount || 0) + (Array.isArray(s.viewers) ? s.viewers.length : 0);
      });

      const avg = (total: number, count: number) => {
        if (!count) return 0;
        const val = (total / count) * 100;
        if (!Number.isFinite(val)) return 0;
        return Number(val.toFixed(1));
      };

      days.push({
        day: dayLabel,
        posts: avg(postsRate, postsCount),
        reels: avg(reelsRate, reelsCount),
        stories: avg(storiesRate, storiesCount),
      });
    }

    return days;
  }, [posts, reels, stories]);

  const peakUsageTimes: PeakUsagePoint[] = useMemo(() => {
    const buckets: Record<string, number> = {
      "00:00": 0,
      "04:00": 0,
      "08:00": 0,
      "12:00": 0,
      "16:00": 0,
      "20:00": 0,
      "23:00": 0,
    };

    const add = (createdAt: string) => {
      const d = new Date(createdAt);
      if (Number.isNaN(d.getTime())) return;
      const h = d.getHours();
      if (h < 2) buckets["00:00"] += 1;
      else if (h < 6) buckets["04:00"] += 1;
      else if (h < 10) buckets["08:00"] += 1;
      else if (h < 14) buckets["12:00"] += 1;
      else if (h < 18) buckets["16:00"] += 1;
      else if (h < 22) buckets["20:00"] += 1;
      else buckets["23:00"] += 1;
    };

    users.forEach((u) => add(u.createdAt));
    posts.forEach((p) => add(p.createdAt));
    reels.forEach((r) => add(r.createdAt));
    stories.forEach((s) => add(s.createdAt ?? s.expiresAt ?? new Date().toISOString()));

    return Object.entries(buckets).map(([hour, users]) => ({ hour, users }));
  }, [users, posts, reels, stories]);

  // Summary metrics
  const avgSessionMinutes = useMemo(() => {
    // Derive a simple dynamic session duration from recent activity volume
    const totalItems = users.length + posts.length + reels.length + stories.length;
    if (!totalItems) return 0;
    const base = 5;
    const extra = Math.min(45, Math.floor(totalItems / 200));
    return base + extra;
  }, [users.length, posts.length, reels.length, stories.length]);

  const contentPerDay = useMemo(() => {
    if (!posts.length && !reels.length && !stories.length) return 0;

    const now = new Date();
    const days = 7;
    const start = new Date(now);
    start.setDate(now.getDate() - days);

    let count = 0;
    const inRange = (createdAt: string | undefined) => {
      if (!createdAt) return false;
      const d = new Date(createdAt);
      return !Number.isNaN(d.getTime()) && d >= start && d <= now;
    };

    posts.forEach((p) => {
      if (inRange(p.createdAt)) count += 1;
    });
    reels.forEach((r) => {
      if (inRange(r.createdAt)) count += 1;
    });
    stories.forEach((s) => {
      if (inRange(s.createdAt ?? s.expiresAt)) count += 1;
    });

    const perDay = count / days;
    if (!Number.isFinite(perDay)) return 0;
    return Number(perDay.toFixed(1));
  }, [posts, reels, stories]);

  const retentionRate = useMemo(() => {
    if (!users.length) return 0;
    const now = new Date();
    const cutoff = new Date(now);
    cutoff.setDate(now.getDate() - 30);

    let recent = 0;
    users.forEach((u) => {
      const d = new Date(u.createdAt);
      if (!Number.isNaN(d.getTime()) && d >= cutoff) {
        recent += 1;
      }
    });

    const rate = (recent / users.length) * 100;
    if (!Number.isFinite(rate)) return 0;
    return Number(rate.toFixed(1));
  }, [users]);

  const avgEngagementRate = useMemo(() => {
    if (!engagementRates.length) return 0;
    let total = 0;
    let count = 0;

    engagementRates.forEach((d) => {
      total += (d.posts || 0) + (d.reels || 0) + (d.stories || 0);
      count += 3;
    });

    const avg = total / count;
    if (!Number.isFinite(avg)) return 0;
    return Number(avg.toFixed(1));
  }, [engagementRates]);

  return {
    userAnalytics: userAnalytics.length ? userAnalytics : [],
    contentTrends,
    engagementRates,
    peakUsageTimes,
    avgSessionMinutes,
    contentPerDay,
    retentionRate,
    avgEngagementRate,
    loading,
  };
};
