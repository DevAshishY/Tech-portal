"use client";
/* eslint-disable @next/next/no-img-element */

import React, { useState, useRef, useMemo } from "react";

import { Eye, Check, X, ArrowLeft, Search, Filter, Heart, MessageCircle, Play, Share2, Clock, TrendingUp, Trash2 } from "lucide-react";
import { useReels, useDeleteReel, useInfiniteReels, useReelComments } from "@/hooks/useReels";

type ReelStatus = "pending" | "approved" | "rejected";

interface Reel {
  _id: string;
  userId: {
    _id: string;
    name: string;
    profilePicture?: string;
  };
  caption: string;
  mediaUrl: string;
  mediaType: "video";
  likesCount: number;
  commentsCount: number;
  sharesCount: number;
  viewsCount: number;
  createdAt: string;
  category: string;
  isActive: boolean;
  // Local-only moderation status (not yet persisted in backend)
  status?: ReelStatus;
}

function StatusBadge({ status }: { status: ReelStatus }) {
  const styles = {
    pending: "bg-yellow-100 text-yellow-800 border-yellow-200 dark:bg-yellow-900/30 dark:text-yellow-400 dark:border-yellow-700",
    approved: "bg-green-100 text-green-800 border-green-200 dark:bg-green-900/30 dark:text-green-400 dark:border-green-700",
    rejected: "bg-red-100 text-red-800 border-red-200 dark:bg-red-900/30 dark:text-red-400 dark:border-red-700",
  };

  return (
    <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${styles[status]}`}>
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  );
}

export default function ReelsModeration() {
  const [selectedReel, setSelectedReel] = useState<Reel | null>(null);
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | ReelStatus>("all");
  const [trendingFilter, setTrendingFilter] = useState<"all" | "trending" | "normal">("all");

  const { data, isLoading, isError, error } = useReels({ limit: 100 });
  const deleteReelMutation = useDeleteReel();

  const reels: Reel[] = (data?.reels || []).map((r: unknown) => {
    const reel = r as Reel;
    return {
      ...reel,
      status: "approved",
    };
  });

  const handleStatusChange = (reelId: string, newStatus: ReelStatus) => {
    // Local-only status change for now
    if (selectedReel?._id === reelId) {
      setSelectedReel((prev) => (prev ? { ...prev, status: newStatus } : null));
    }
  };

  const handleDelete = async (reelId: string) => {
    if (typeof window !== "undefined" && !window.confirm("Are you sure you want to delete this reel?")) {
      return;
    }
    try {
      await deleteReelMutation.mutateAsync(reelId);
      if (selectedReel?._id === reelId) {
        setSelectedReel(null);
      }
    } catch (err) {
      console.error("Failed to delete reel:", err);
      if (typeof window !== "undefined") {
        alert("Failed to delete reel. Please try again.");
      }
    }
  };

  const filteredReels = useMemo(
    () =>
      reels.filter((reel) => {
        const isTrending = reel.viewsCount > 1000;
        const matchesSearch = reel.userId.name
          .toLowerCase()
          .includes(searchQuery.toLowerCase());
        const matchesStatus = statusFilter === "all" || reel.status === statusFilter;
        const matchesTrending =
          trendingFilter === "all" ||
          (trendingFilter === "trending" && isTrending) ||
          (trendingFilter === "normal" && !isTrending);
        return matchesSearch && matchesStatus && matchesTrending;
      }),
    [reels, searchQuery, statusFilter, trendingFilter]
  );

  const stats = {
    total: reels.length,
    pending: reels.filter((r) => r.status === "pending").length,
    approved: reels.filter((r) => r.status === "approved").length,
    rejected: reels.filter((r) => r.status === "rejected").length,
    trending: reels.filter((r) => r.viewsCount > 1000).length,
  };

  const reelsByUser = useMemo(() => {
    const map = new Map<
      string,
      {
        userId: Reel["userId"];
        reels: Reel[];
      }
    >();

    filteredReels.forEach((reel) => {
      const id = reel.userId._id;
      if (!map.has(id)) {
        map.set(id, { userId: reel.userId, reels: [] });
      }
      map.get(id)!.reels.push(reel);
    });

    return Array.from(map.values()).sort((a, b) =>
      a.userId.name.localeCompare(b.userId.name)
    );
  }, [filteredReels]);

  const selectedUserReels = useMemo(() => {
    if (!selectedUserId) return [];
    return filteredReels
      .filter((reel) => reel.userId._id === selectedUserId)
      .slice()
      .sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
  }, [filteredReels, selectedUserId]);

  // Details view takes priority so View always opens smoothly
  if (selectedReel) {
    return (
      <ReelDetailsView
        reel={selectedReel}
        onBack={() => setSelectedReel(null)}
        onStatusChange={handleStatusChange}
        onDelete={handleDelete}
        isDeleting={deleteReelMutation.isPending}
      />
    );
  }

  // Per-user reels table screen
  if (selectedUserId) {
    const userInfo =
      selectedUserReels[0]?.userId ||
      reelsByUser.find((u) => u.userId._id === selectedUserId)?.userId;

    return (
      <UserReelsView
        user={userInfo}
        onBack={() => setSelectedUserId(null)}
        onSelectReel={setSelectedReel}
        onDelete={handleDelete}
        isDeleting={deleteReelMutation.isPending}
      />
    );
  }

  return (
    <main className="min-h-screen bg-linear-to-br from-purple-50 via-pink-50 to-rose-50 dark:from-slate-950 dark:via-purple-950 dark:to-slate-950 p-4 md:p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6 md:mb-8">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-slate-100">Reels Moderation</h1>
          <p className="text-sm text-gray-600 dark:text-slate-400 mt-1">Review and manage video reels</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-3 md:gap-6 mb-6 md:mb-8">
          <div className="bg-white/80 dark:bg-slate-900/60 backdrop-blur-xl border border-gray-200 dark:border-slate-800/50 rounded-xl md:rounded-2xl p-4 md:p-6 hover:shadow-lg transition-all">
            <div className="text-xs md:text-sm text-gray-600 dark:text-slate-400 mb-1">Total Reels</div>
            <div className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-slate-100">{stats.total}</div>
          </div>
          <div className="bg-white/80 dark:bg-slate-900/60 backdrop-blur-xl border border-gray-200 dark:border-slate-800/50 rounded-xl md:rounded-2xl p-4 md:p-6 hover:shadow-lg transition-all">
            <div className="text-xs md:text-sm text-gray-600 dark:text-slate-400 mb-1">Pending</div>
            <div className="text-2xl md:text-3xl font-bold text-yellow-600 dark:text-yellow-400">{stats.pending}</div>
          </div>
          <div className="bg-white/80 dark:bg-slate-900/60 backdrop-blur-xl border border-gray-200 dark:border-slate-800/50 rounded-xl md:rounded-2xl p-4 md:p-6 hover:shadow-lg transition-all">
            <div className="text-xs md:text-sm text-gray-600 dark:text-slate-400 mb-1">Approved</div>
            <div className="text-2xl md:text-3xl font-bold text-green-600 dark:text-green-400">{stats.approved}</div>
          </div>
          <div className="bg-white/80 dark:bg-slate-900/60 backdrop-blur-xl border border-gray-200 dark:border-slate-800/50 rounded-xl md:rounded-2xl p-4 md:p-6 hover:shadow-lg transition-all">
            <div className="text-xs md:text-sm text-gray-600 dark:text-slate-400 mb-1">Rejected</div>
            <div className="text-2xl md:text-3xl font-bold text-red-600 dark:text-red-400">{stats.rejected}</div>
          </div>
          <div className="bg-white/80 dark:bg-slate-900/60 backdrop-blur-xl border border-gray-200 dark:border-slate-800/50 rounded-xl md:rounded-2xl p-4 md:p-6 hover:shadow-lg transition-all col-span-2 lg:col-span-1">
            <div className="text-xs md:text-sm text-gray-600 dark:text-slate-400 mb-1">Trending</div>
            <div className="text-2xl md:text-3xl font-bold bg-linear-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent">{stats.trending}</div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white/80 dark:bg-slate-900/60 backdrop-blur-xl border border-gray-200 dark:border-slate-800/50 rounded-xl md:rounded-2xl p-4 md:p-6 mb-6">
          <div className="flex items-center gap-3 mb-4">
            <Filter className="text-gray-600 dark:text-slate-400" size={20} />
            <h3 className="text-base md:text-lg font-semibold text-gray-900 dark:text-slate-100">Filters</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 dark:text-slate-400" size={18} />
              <input
                type="text"
                placeholder="Search reels..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-gray-50 dark:bg-slate-800/50 border border-gray-300 dark:border-slate-700/50 rounded-lg text-sm text-gray-900 dark:text-slate-200 placeholder-gray-500 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-purple-500/50 transition-all"
              />
            </div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as "all" | ReelStatus)}
              className="px-4 py-2.5 bg-gray-50 dark:bg-slate-800/50 border border-gray-300 dark:border-slate-700/50 rounded-lg text-sm text-gray-900 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-purple-500/50 transition-all"
            >
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="approved">Approved</option>
              <option value="rejected">Rejected</option>
            </select>
            <select
              value={trendingFilter}
              onChange={(e) => setTrendingFilter(e.target.value as "all" | "trending" | "normal")}
              className="px-4 py-2.5 bg-gray-50 dark:bg-slate-800/50 border border-gray-300 dark:border-slate-700/50 rounded-lg text-sm text-gray-900 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-purple-500/50 transition-all"
            >
              <option value="all">All Reels</option>
              <option value="trending">Trending Only</option>
              <option value="normal">Non-Trending</option>
            </select>
          </div>
        </div>

        {/* Loading / Error States */}
        {isLoading && (
          <div className="bg-white/80 dark:bg-slate-900/60 backdrop-blur-xl border border-gray-200 dark:border-slate-800/50 rounded-xl md:rounded-2xl p-12 text-center">
            <div className="text-gray-600 dark:text-slate-400">Loading reels...</div>
          </div>
        )}

        {isError && (
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl md:rounded-2xl p-6 text-center">
            <div className="text-red-600 dark:text-red-400">
              Failed to load reels: {(error as Error | undefined)?.message || "Unknown error"}
            </div>
          </div>
        )}

        {/* Users list only (grouped by user) */}
        {!isLoading && !isError && (
          <>
            {filteredReels.length === 0 ? (
              <div className="bg-white/80 dark:bg-slate-900/60 backdrop-blur-xl border border-gray-200 dark:border-slate-800/50 rounded-xl md:rounded-2xl p-12 text-center">
                <div className="text-gray-600 dark:text-slate-400">No reels found matching your filters</div>
              </div>
            ) : (
              <div className="bg-white/80 dark:bg-slate-900/60 backdrop-blur-xl border border-gray-200 dark:border-slate-800/50 rounded-xl md:rounded-2xl p-4 md:p-5 mb-6">
                <h3 className="text-base md:text-lg font-semibold text-gray-900 dark:text-slate-100 mb-4">
                  Users
                </h3>
                <div className="space-y-3 max-h-[500px] overflow-y-auto pr-1">
                  {reelsByUser.map(({ userId, reels }) => (
                    <button
                      key={userId._id}
                      onClick={() => setSelectedUserId(userId._id)}
                      className="w-full flex items-center justify-between gap-3 px-3 py-2.5 rounded-lg text-left transition-all bg-gray-50 dark:bg-slate-900/60 border border-gray-200 dark:border-slate-800/60 hover:bg-gray-100 dark:hover:bg-slate-800"
                    >
                      <div className="flex items-center gap-3">
                        <div className="h-8 w-8 rounded-full bg-linear-to-br from-purple-600 to-pink-600 flex items-center justify-center text-white text-xs font-bold">
                          {userId.name.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <div className="text-sm font-medium text-gray-900 dark:text-slate-100">
                            {userId.name}
                          </div>
                          <div className="text-[11px] text-gray-500 dark:text-slate-500">
                            {reels.length} reel{reels.length !== 1 ? "s" : ""}
                          </div>
                        </div>
                      </div>
                      <span className="text-xs font-medium text-purple-600 dark:text-purple-400">
                        See all reels
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </main>
  );
}

function UserReelsView({
  user,
  onBack,
  onSelectReel,
  onDelete,
  isDeleting,
}: {
  user?: Reel["userId"];
  onBack: () => void;
  onSelectReel: (reel: Reel) => void;
  onDelete: (reelId: string) => void;
  isDeleting: boolean;
}) {
  const userId = user?._id;

  const {
    data,
    isLoading,
    isError,
    error,
    hasNextPage,
    fetchNextPage,
    isFetchingNextPage,
  } = useInfiniteReels({ limit: 20, userId });

  const reels: Reel[] = useMemo(
    () =>
      (data?.pages || []).flatMap((page) => (page.reels as Reel[]) || []),
    [data]
  );

  return (
    <main className="min-h-screen bg-linear-to-br from-purple-50 via-pink-50 to-rose-50 dark:from-slate-950 dark:via-purple-950 dark:to-slate-950 p-4 md:p-6">
      <div className="max-w-7xl mx-auto">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-gray-600 dark:text-slate-400 hover:text-gray-900 dark:hover:text-slate-200 transition-colors mb-6 group"
        >
          <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
          <span className="text-sm font-medium">Back to Users</span>
        </button>

        <div className="mb-6">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-slate-100">
            {user ? user.name : "User"}&apos;s Reels
          </h1>
          {user && (
            <p className="text-sm text-gray-600 dark:text-slate-400 mt-1">User ID: {user._id}</p>
          )}
        </div>

        <div className="bg-white/80 dark:bg-slate-900/60 backdrop-blur-xl border border-gray-200 dark:border-slate-800/50 rounded-xl md:rounded-2xl p-4 md:p-6">
          {isLoading && (
            <div className="text-sm text-gray-600 dark:text-slate-400">Loading reels...</div>
          )}

          {isError && (
            <div className="text-sm text-red-600 dark:text-red-400">
              {(error as Error | undefined)?.message || "Failed to load reels"}
            </div>
          )}

          {!isLoading && !isError && reels.length === 0 ? (
            <div className="text-sm text-gray-600 dark:text-slate-400">
              No reels found for this user with the current filters.
            </div>
          ) : !isLoading && !isError ? (
            <div className="overflow-x-auto">
              <table className="min-w-full text-left text-sm">
                <thead>
                  <tr className="border-b border-gray-200 dark:border-slate-800 text-xs uppercase tracking-wide text-gray-500 dark:text-slate-400">
                    <th className="py-2 pr-4 font-medium">Preview</th>
                    <th className="py-2 pr-4 font-medium">Caption</th>
                    <th className="py-2 pr-4 font-medium">Status</th>
                    <th className="py-2 pr-4 font-medium">Views</th>
                    <th className="py-2 pr-4 font-medium">Likes</th>
                    <th className="py-2 pr-4 font-medium">Comments</th>
                    <th className="py-2 pr-4 font-medium">Created</th>
                    <th className="py-2 pl-2 font-medium text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {reels.map((reel) => (
                    <tr
                      key={reel._id}
                      className="border-b border-gray-100 dark:border-slate-800/70 hover:bg-gray-50/70 dark:hover:bg-slate-900/70 transition-colors"
                    >
                      <td className="py-3 pr-4 align-top">
                        <div className="w-16 h-28 rounded-md overflow-hidden bg-black">
                          <video
                            src={reel.mediaUrl}
                            className="w-full h-full object-cover"
                            muted
                            loop
                            playsInline
                          />
                        </div>
                      </td>
                      <td className="py-3 pr-4 align-top max-w-xs">
                        <div className="text-sm font-medium text-gray-900 dark:text-slate-100 line-clamp-2">
                          {reel.caption || "No caption"}
                        </div>
                      </td>
                      <td className="py-3 pr-4 align-top">
                        <StatusBadge status={reel.status || "approved"} />
                      </td>
                      <td className="py-3 pr-4 align-top text-gray-700 dark:text-slate-200">
                        {reel.viewsCount.toLocaleString()}
                      </td>
                      <td className="py-3 pr-4 align-top text-gray-700 dark:text-slate-200">
                        {reel.likesCount.toLocaleString()}
                      </td>
                      <td className="py-3 pr-4 align-top text-gray-700 dark:text-slate-200">
                        {reel.commentsCount.toLocaleString()}
                      </td>
                      <td className="py-3 pr-4 align-top text-xs text-gray-500 dark:text-slate-400 whitespace-nowrap">
                        {new Date(reel.createdAt).toLocaleString()}
                      </td>
                      <td className="py-3 pl-2 align-top">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => onSelectReel(reel)}
                            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-gray-100 dark:bg-slate-800 hover:bg-gray-200 dark:hover:bg-slate-700 text-gray-700 dark:text-slate-300 text-xs font-medium transition-all"
                          >
                            <Eye size={14} />
                            View
                          </button>
                          <button
                            onClick={() => onDelete(reel._id)}
                            disabled={isDeleting}
                            className="flex items-center justify-center px-2.5 py-1.5 rounded-lg bg-red-500 hover:bg-red-600 text-white text-xs font-medium shadow-sm transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                            title="Delete"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {hasNextPage && (
                <div className="mt-4 flex justify-center">
                  <button
                    onClick={() => fetchNextPage()}
                    disabled={isFetchingNextPage}
                    className="px-4 py-2 rounded-lg bg-purple-600 hover:bg-purple-700 text-white text-xs font-medium shadow-sm transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isFetchingNextPage ? "Loading more..." : "Load more"}
                  </button>
                </div>
              )}
            </div>
          ) : null}
        </div>
      </div>
    </main>
  );
}

function ReelDetailsView({
  reel,
  onBack,
  onStatusChange,
  onDelete,
  isDeleting,
}: {
  reel: Reel;
  onBack: () => void;
  onStatusChange: (reelId: string, status: ReelStatus) => void;
  onDelete: (reelId: string) => void;
  isDeleting: boolean;
}) {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [showComments, setShowComments] = useState(false);

  const {
    data: commentsData,
    isLoading: isCommentsLoading,
    isError: isCommentsError,
    error: commentsError,
    hasNextPage: hasMoreComments,
    fetchNextPage: fetchMoreComments,
    isFetchingNextPage: isFetchingMoreComments,
  } = useReelComments({ reelId: reel._id, limit: 10 });

  const comments = useMemo(
    () =>
      (commentsData?.pages || []).flatMap((page) =>
        (page.comments || []).map((comment) => comment)
      ),
    [commentsData]
  );

  return (
    <main className="min-h-screen bg-linear-to-br from-purple-50 via-pink-50 to-rose-50 dark:from-slate-950 dark:via-purple-950 dark:to-slate-950 p-4 md:p-6">
      <div className="max-w-5xl mx-auto">
        <button onClick={onBack} className="flex items-center gap-2 text-gray-600 dark:text-slate-400 hover:text-gray-900 dark:hover:text-slate-200 transition-colors mb-6 group">
          <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
          <span className="text-sm font-medium">Back to Reels</span>
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <div className="bg-white/80 dark:bg-slate-900/60 backdrop-blur-xl border border-gray-200 dark:border-slate-800/50 rounded-2xl overflow-hidden">
              <div className="relative aspect-9/16 max-h-[700px] mx-auto bg-black">
                <video
                  ref={videoRef}
                  src={reel.mediaUrl}
                  className="w-full h-full object-contain"
                  controls
                  onPlay={() => setIsPlaying(true)}
                  onPause={() => setIsPlaying(false)}
                  onEnded={() => setIsPlaying(false)}
                />
                {!isPlaying && (
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <button
                      type="button"
                      onClick={() => videoRef.current?.play()}
                      className="h-16 w-16 rounded-full bg-white/90 flex items-center justify-center cursor-pointer hover:scale-110 transition-transform pointer-events-auto"
                    >
                      <Play size={32} className="text-purple-600 ml-1" fill="currentColor" />
                    </button>
                  </div>
                )}

                <div className="absolute top-4 right-4 px-3 py-1.5 rounded-full bg-linear-to-br from-pink-500 to-purple-500 text-white text-sm font-bold flex items-center gap-1.5">
                  <TrendingUp size={16} />
                  Trending
                </div>
              </div>
              <div className="p-6 space-y-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-slate-100 mb-2">Caption</h3>
                  <p className="text-gray-700 dark:text-slate-300 leading-relaxed">{reel.caption}</p>
                </div>

                <div className="pt-4 border-t border-gray-200 dark:border-slate-800">
                  <div className="flex items-center justify-around text-xs md:text-sm text-gray-700 dark:text-slate-200">
                    <div className="flex items-center gap-1.5">
                      <Eye size={16} className="text-purple-500" />
                      <span>{reel.viewsCount.toLocaleString()}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Heart size={16} className="text-pink-500" />
                      <span>{reel.likesCount.toLocaleString()}</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => setShowComments((prev) => !prev)}
                      className="flex items-center gap-1.5 px-2 py-1 rounded-full bg-slate-100 dark:bg-slate-900/70 text-xs md:text-sm text-gray-700 dark:text-slate-100 hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors"
                    >
                      <MessageCircle size={16} className="text-sky-500" />
                      <span>{reel.commentsCount.toLocaleString()}</span>
                    </button>
                    <div className="flex items-center gap-1.5">
                      <Share2 size={16} className="text-emerald-500" />
                      <span>{reel.sharesCount.toLocaleString()}</span>
                    </div>
                  </div>
                </div>

                {/* Real comments list (toggleable) */}
                {showComments && (
                  <div
                    className="pt-4 border-t border-gray-200 dark:border-slate-800 max-h-80 overflow-y-auto"
                    style={{ scrollbarWidth: "none" as const }}
                  >
                    <h3 className="text-sm font-semibold text-gray-900 dark:text-slate-100 mb-3 flex items-center gap-2">
                      <MessageCircle size={16} className="text-sky-500" />
                      Comments
                    </h3>

                    {isCommentsLoading && (
                      <div className="text-xs text-gray-600 dark:text-slate-400">Loading comments...</div>
                    )}

                    {isCommentsError && (
                      <div className="text-xs text-red-600 dark:text-red-400">
                        {(commentsError as Error | undefined)?.message || "Failed to load comments"}
                      </div>
                    )}

                    {!isCommentsLoading && !isCommentsError && comments.length === 0 && (
                      <div className="text-xs text-gray-600 dark:text-slate-400">No comments yet on this reel.</div>
                    )}

                    <div className="space-y-3">
                      {comments.map((comment) => (
                        <div
                          key={comment._id}
                          className="flex items-start gap-3 rounded-lg bg-gray-50/80 dark:bg-slate-900/70 px-3 py-2.5"
                        >
                          <div className="h-8 w-8 rounded-full bg-linear-to-br from-purple-600 to-pink-600 flex items-center justify-center text-white text-xs font-semibold overflow-hidden shrink-0">
                            {comment.user.profilePicture ? (
                              <img
                                src={comment.user.profilePicture}
                                alt={comment.user.name}
                                className="h-full w-full object-cover"
                              />
                            ) : (
                              comment.user.name.charAt(0).toUpperCase()
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between gap-2">
                              <span className="text-xs font-semibold text-gray-900 dark:text-slate-100 truncate">
                                {comment.user.name}
                              </span>
                              <span className="text-[10px] text-gray-500 dark:text-slate-500 whitespace-nowrap">
                                {new Date(comment.createdAt).toLocaleString()}
                              </span>
                            </div>
                            <p className="mt-1 text-xs text-gray-700 dark:text-slate-200 wrap-break">
                              {comment.text}
                            </p>
                            <div className="mt-1 flex items-center gap-2 text-[10px] text-gray-500 dark:text-slate-400">
                              <div className="flex items-center gap-1">
                                <Heart
                                  size={12}
                                  className={comment.isLiked ? "text-pink-500" : "text-gray-400"}
                                  fill={comment.isLiked ? "currentColor" : "none"}
                                />
                                <span>{comment.likesCount}</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>

                    {hasMoreComments && (
                      <div className="mt-3 flex justify-center">
                        <button
                          type="button"
                          onClick={() => fetchMoreComments()}
                          disabled={isFetchingMoreComments}
                          className="px-3 py-1.5 rounded-full bg-purple-600 hover:bg-purple-700 text-white text-[11px] font-medium shadow-sm transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          {isFetchingMoreComments ? "Loading more..." : "Load more comments"}
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-white/80 dark:bg-slate-900/60 backdrop-blur-xl border border-gray-200 dark:border-slate-800/50 rounded-2xl p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-slate-100 mb-4">Creator Info</h3>
              <div className="flex items-center gap-3 mb-4">
                <div className="h-12 w-12 rounded-full bg-linear-to-br from-purple-600 to-pink-600 flex items-center justify-center text-white text-lg font-bold">
                  {reel.userId.name.charAt(0).toUpperCase()}
                </div>
                <div>
                  <div className="text-gray-900 dark:text-slate-200 font-medium">{reel.userId.name}</div>
                  <div className="text-gray-600 dark:text-slate-500 text-sm">{reel.userId._id}</div>
                </div>
              </div>
              <div className="pt-4 border-t border-gray-200 dark:border-slate-700">
                <div className="text-xs text-gray-600 dark:text-slate-500 uppercase tracking-wider mb-1">Category</div>
                <div className="text-gray-900 dark:text-slate-300 font-medium">{reel.category}</div>
              </div>
            </div>

            <div className="bg-white/80 dark:bg-slate-900/60 backdrop-blur-xl border border-gray-200 dark:border-slate-800/50 rounded-2xl p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-slate-100 mb-4">Performance</h3>
              <div className="space-y-3">
                <div className="pt-1 border-t border-gray-200 dark:border-slate-700/60">
                  <div className="text-xs text-gray-600 dark:text-slate-400 mb-2 flex items-center gap-2">
                    <Clock size={16} />
                    <span>Created At</span>
                  </div>
                  <div className="flex items-center justify-between gap-2 px-3 py-2 rounded-xl bg-linear-to-r from-slate-900/80 via-slate-800/80 to-purple-900/70 border border-slate-700/60 shadow-sm">
                    <div className="flex flex-col">
                      <span className="text-xs text-slate-300 uppercase tracking-wide">Date</span>
                      <span className="text-sm font-semibold text-slate-50">
                        {new Date(reel.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    <div className="h-8 w-px bg-slate-700/70" />
                    <div className="flex flex-col items-end">
                      <span className="text-xs text-slate-300 uppercase tracking-wide">Time</span>
                      <span className="text-sm font-semibold text-slate-50">
                        {new Date(reel.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white/80 dark:bg-slate-900/60 backdrop-blur-xl border border-gray-200 dark:border-slate-800/50 rounded-2xl p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-slate-100 mb-4">Actions</h3>
              <div className="space-y-3">
                <button
                  onClick={() => onStatusChange(reel._id, "approved")}
                  disabled={reel.status === "approved"}
                  className={`w-full flex items-center justify-center gap-2 px-4 py-3 rounded-lg font-medium transition-all ${
                    reel.status === "approved"
                      ? "bg-green-100 dark:bg-green-500/20 text-green-700 dark:text-green-300 cursor-not-allowed"
                      : "bg-green-500 hover:bg-green-600 text-white shadow-lg"
                  }`}
                >
                  <Check size={18} />
                  {reel.status === "approved" ? "Approved" : "Approve"}
                </button>
                <button
                  onClick={() => onStatusChange(reel._id, "rejected")}
                  disabled={reel.status === "rejected"}
                  className={`w-full flex items-center justify-center gap-2 px-4 py-3 rounded-lg font-medium transition-all ${
                    reel.status === "rejected"
                      ? "bg-red-100 dark:bg-red-500/20 text-red-700 dark:text-red-300 cursor-not-allowed"
                      : "bg-red-500 hover:bg-red-600 text-white shadow-lg"
                  }`}
                >
                  <X size={18} />
                  {reel.status === "rejected" ? "Rejected" : "Reject"}
                </button>
                {reel.status !== "pending" && (
                  <button
                    onClick={() => onStatusChange(reel._id, "pending")}
                    className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-lg font-medium bg-yellow-500 hover:bg-yellow-600 text-white shadow-lg transition-all"
                  >
                    Reset to Pending
                  </button>
                )}
                <button
                  onClick={() => onDelete(reel._id)}
                  disabled={isDeleting}
                  className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-lg font-medium bg-red-500 hover:bg-red-600 text-white shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Trash2 size={18} />
                  {isDeleting ? "Deleting..." : "Delete Reel"}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}