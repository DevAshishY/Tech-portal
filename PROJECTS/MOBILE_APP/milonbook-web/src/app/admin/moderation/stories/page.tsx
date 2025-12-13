"use client";

import React, { useMemo, useState } from "react";
import Image from "next/image";

import {
  Eye,
  ArrowLeft,
  Search,
  Filter,
  Users,
  Clock,
  Image as ImageIcon,
  AlertCircle,
  Trash2,
} from "lucide-react";
import { useInfiniteStories, useDeleteStory, type Story as ApiStory } from "@/hooks/useStories";

type StoryStatus = "pending" | "approved" | "rejected";

interface Story {
  id: string;
  userId: {
    _id: string;
    name: string;
  };
  content?: string;
  image?: string;
  mediaType: "image" | "text";
  views: number;
  replies: number;
  postedDate: string;
  expiresIn: string;
  status: StoryStatus;
}

function StatusBadge({ status }: { status: StoryStatus }) {
  const styles = {
    pending:
      "bg-yellow-100 text-yellow-800 border-yellow-200 dark:bg-yellow-900/30 dark:text-yellow-400 dark:border-yellow-700",
    approved:
      "bg-green-100 text-green-800 border-green-200 dark:bg-green-900/30 dark:text-green-400 dark:border-green-700",
    rejected:
      "bg-red-100 text-red-800 border-red-200 dark:bg-red-900/30 dark:text-red-400 dark:border-red-700",
  };

  return (
    <span
      className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${styles[status]}`}
    >
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  );
}

function StoryDetailsView({
  story,
  onBack,
  onDelete,
  isDeleting,
}: {
  story: Story;
  onBack: () => void;
  onDelete: (storyId: string) => void;
  isDeleting: boolean;
}) {
  return (
    <main className="min-h-screen bg-linear-to-br from-blue-50 via-cyan-50 to-teal-50 dark:from-slate-950 dark:via-cyan-950 dark:to-slate-950 p-4 md:p-6">
      <div className="max-w-5xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-gray-600 dark:text-slate-400 hover:text-gray-900 dark:hover:text-slate-200 transition-colors group"
          >
            <ArrowLeft
              size={20}
              className="group-hover:-translate-x-1 transition-transform"
            />
            <span className="text-sm font-medium">Back to Stories</span>
          </button>
          <button
            onClick={() => onDelete(story.id)}
            disabled={isDeleting}
            className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-red-600 hover:bg-red-700 text-white text-xs font-medium shadow-sm transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Trash2 size={14} />
            Delete Story
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <div className="bg-white/80 dark:bg-slate-900/60 backdrop-blur-xl border border-gray-200 dark:border-slate-800/50 rounded-2xl overflow-hidden">
              <div className="relative aspect-9/16 max-h-[700px] mx-auto">
                {story.mediaType === "image" && story.image ? (
                  <Image
                    src={story.image}
                    alt="Story"
                    fill
                    sizes="(max-width: 1024px) 100vw, 50vw"
                    className="object-contain bg-gray-100 dark:bg-slate-950"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center p-8 bg-slate-900">
                    <p className="text-center font-bold text-2xl leading-relaxed text-slate-50">
                      {story.content}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-white/80 dark:bg-slate-900/60 backdrop-blur-xl border border-gray-200 dark:border-slate-800/50 rounded-2xl p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-slate-100 mb-4">
                Creator Info
              </h3>
              <div className="flex items-center gap-3 mb-4">
                <div className="h-12 w-12 rounded-full bg-linear-to-br from-cyan-600 to-blue-600 flex items-center justify-center text-white text-lg font-bold">
                  {story.userId.name.charAt(0).toUpperCase()}
                </div>
                <div>
                  <div className="text-gray-900 dark:text-slate-200 font-medium">
                    {story.userId.name}
                  </div>
                  <div className="text-gray-600 dark:text-slate-500 text-sm">
                    {story.userId._id}
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white/80 dark:bg-slate-900/60 backdrop-blur-xl border border-gray-200 dark:border-slate-800/50 rounded-2xl p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-slate-100 mb-4">
                Story Info
              </h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-gray-600 dark:text-slate-400">Status</span>
                  <StatusBadge status={story.status} />
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600 dark:text-slate-400">Type</span>
                  <span className="text-gray-900 dark:text-slate-200 font-medium flex items-center gap-1">
                    <ImageIcon size={14} />
                    Image
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600 dark:text-slate-400 flex items-center gap-1">
                    <Clock size={14} />
                    Expires In
                  </span>
                  <span className="text-gray-900 dark:text-slate-200 font-medium">
                    {story.expiresIn}
                  </span>
                </div>
                <div className="flex items-center justify-between pt-3 border-t border-gray-200 dark:border-slate-700">
                  <span className="text-gray-600 dark:text-slate-400">Posted</span>
                  <span className="text-gray-900 dark:text-slate-200 text-sm">
                    {story.postedDate}
                  </span>
                </div>
              </div>
            </div>

            <div className="bg-white/80 dark:bg-slate-900/60 backdrop-blur-xl border border-gray-200 dark:border-slate-800/50 rounded-2xl p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-slate-100 mb-4">
                Engagement
              </h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-gray-600 dark:text-slate-400 flex items-center gap-2">
                    <Eye size={16} />
                    Views
                  </span>
                  <span className="text-gray-900 dark:text-slate-200 font-medium">
                    {story.views.toLocaleString()}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600 dark:text-slate-400 flex items-center gap-2">
                    <Users size={16} />
                    Replies
                  </span>
                  <span className="text-gray-900 dark:text-slate-200 font-medium">
                    {story.replies}
                  </span>
                </div>
              </div>
            </div>

            <div className="bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800/50 rounded-2xl p-4">
              <div className="flex gap-3">
                <AlertCircle
                  className="text-orange-600 dark:text-orange-400 shrink-0 mt-0.5"
                  size={20}
                />
                <div>
                  <div className="text-sm font-medium text-orange-900 dark:text-orange-300 mb-1">
                    24-Hour Content
                  </div>
                  <div className="text-xs text-orange-700 dark:text-orange-400">
                    This story will automatically expire after 24 hours from
                    posting time.
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

function UserStoriesView({
  user,
  onBack,
  onSelectStory,
  onDelete,
  isDeleting,
}: {
  user?: Story["userId"];
  onBack: () => void;
  onSelectStory: (story: Story) => void;
  onDelete: (storyId: string) => void;
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
  } = useInfiniteStories({ limit: 20, userId });

  const stories: Story[] = useMemo(
    () =>
      (data?.pages || []).flatMap((page: { stories: ApiStory[] }) => {
        const items = page?.stories || [];
        return items.map((apiStory: ApiStory) => {
          const createdAt = apiStory?.createdAt ? new Date(apiStory.createdAt) : null;
          const expiresAt = apiStory?.expiresAt ? new Date(apiStory.expiresAt) : null;

          let expiresIn = "";
          if (expiresAt) {
            const now = new Date();
            const diffMs = expiresAt.getTime() - now.getTime();
            if (diffMs <= 0) {
              expiresIn = "Expired";
            } else {
              const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
              const diffMinutes = Math.floor(
                (diffMs % (1000 * 60 * 60)) / (1000 * 60)
              );
              if (diffHours > 0) {
                expiresIn = `${diffHours}h${diffMinutes > 0 ? ` ${diffMinutes}m` : ""}`;
              } else {
                expiresIn = `${diffMinutes}m`;
              }
            }
          }

          const u = apiStory?.userId ?? {};

          return {
            id: apiStory?._id ?? "",
            userId: { _id: u?._id || "", name: u?.name || "Unknown" },
            content: apiStory?.caption ?? "",
            image: apiStory?.mediaUrl ?? "",
            mediaType: "image" as const,
            views: apiStory?.viewCount ?? 0,
            replies: Array.isArray(apiStory?.viewers)
              ? apiStory.viewers.length
              : 0,
            postedDate: createdAt ? createdAt.toLocaleString() : "",
            expiresIn,
            status: "approved" as StoryStatus,
          } satisfies Story;
        });
      }),
    [data]
  );

  return (
    <main className="min-h-screen bg-linear-to-br from-blue-50 via-cyan-50 to-teal-50 dark:from-slate-950 dark:via-cyan-950 dark:to-slate-950 p-4 md:p-6">
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
            {user ? user.name : "User"}&apos;s Stories
          </h1>
          {user && (
            <p className="text-sm text-gray-600 dark:text-slate-400 mt-1">User ID: {user._id}</p>
          )}
        </div>

        <div className="bg-white/80 dark:bg-slate-900/60 backdrop-blur-xl border border-gray-200 dark:border-slate-800/50 rounded-xl md:rounded-2xl p-4 md:p-6">
          {isLoading && (
            <div className="text-sm text-gray-600 dark:text-slate-400">Loading stories...</div>
          )}

          {isError && (
            <div className="text-sm text-red-600 dark:text-red-400">
              {(error as Error | undefined)?.message || "Failed to load stories"}
            </div>
          )}

          {!isLoading && !isError && stories.length === 0 ? (
            <div className="text-sm text-gray-600 dark:text-slate-400">
              No stories found for this user.
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
                    <th className="py-2 pr-4 font-medium">Replies</th>
                    <th className="py-2 pr-4 font-medium">Expires In</th>
                    <th className="py-2 pr-4 font-medium">Posted</th>
                    <th className="py-2 pl-2 font-medium text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {stories.map((story) => (
                    <tr
                      key={story.id}
                      className="border-b border-gray-100 dark:border-slate-800/70 hover:bg-gray-50/70 dark:hover:bg-slate-900/70 transition-colors"
                    >
                      <td className="py-3 pr-4 align-top">
                        <div className="w-16 h-28 rounded-md overflow-hidden bg-gray-200 dark:bg-slate-800 flex items-center justify-center text-[10px] text-gray-500">
                          {story.image ? (
                            <Image
                              src={story.image}
                              alt="Story"
                              width={64}
                              height={112}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            "No media"
                          )}
                        </div>
                      </td>
                      <td className="py-3 pr-4 align-top max-w-xs">
                        <div className="text-sm font-medium text-gray-900 dark:text-slate-100 line-clamp-2">
                          {story.content || "No caption"}
                        </div>
                      </td>
                      <td className="py-3 pr-4 align-top">
                        <StatusBadge status={story.status} />
                      </td>
                      <td className="py-3 pr-4 align-top text-gray-700 dark:text-slate-200">
                        {story.views.toLocaleString()}
                      </td>
                      <td className="py-3 pr-4 align-top text-gray-700 dark:text-slate-200">
                        {story.replies}
                      </td>
                      <td className="py-3 pr-4 align-top text-xs text-gray-700 dark:text-slate-200">
                        {story.expiresIn}
                      </td>
                      <td className="py-3 pr-4 align-top text-xs text-gray-500 dark:text-slate-400 whitespace-nowrap">
                        {story.postedDate}
                      </td>
                      <td className="py-3 pl-2 align-top">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => onSelectStory(story)}
                            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-gray-100 dark:bg-slate-800 hover:bg-gray-200 dark:hover:bg-slate-700 text-gray-700 dark:text-slate-300 text-xs font-medium transition-all"
                          >
                            <Eye size={14} />
                            View
                          </button>
                          <button
                            onClick={() => onDelete(story.id)}
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
                    className="px-4 py-2 rounded-lg bg-cyan-600 hover:bg-cyan-700 text-white text-xs font-medium shadow-sm transition-all disabled:opacity-50 disabled:cursor-not-allowed"
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

export default function StoriesModeration() {
  const [selectedStory, setSelectedStory] = useState<Story | null>(null);
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  const {
    data,
    isLoading,
    isError,
    error,
  } = useInfiniteStories({ limit: 200 });

  const deleteStoryMutation = useDeleteStory();

  const stories: Story[] = useMemo(
    () =>
      (data?.pages || []).flatMap((page: { stories: ApiStory[] }) => {
        const items = page?.stories || [];
        return items.map((apiStory: ApiStory) => {
          const createdAt = apiStory?.createdAt ? new Date(apiStory.createdAt) : null;
          const expiresAt = apiStory?.expiresAt ? new Date(apiStory.expiresAt) : null;

          let expiresIn = "";
          if (expiresAt) {
            const now = new Date();
            const diffMs = expiresAt.getTime() - now.getTime();
            if (diffMs <= 0) {
              expiresIn = "Expired";
            } else {
              const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
              const diffMinutes = Math.floor(
                (diffMs % (1000 * 60 * 60)) / (1000 * 60)
              );
              if (diffHours > 0) {
                expiresIn = `${diffHours}h${diffMinutes > 0 ? ` ${diffMinutes}m` : ""}`;
              } else {
                expiresIn = `${diffMinutes}m`;
              }
            }
          }

          const user = apiStory?.userId ?? {};

          return {
            id: apiStory?._id ?? "",
            userId: { _id: user?._id || "", name: user?.name || "Unknown" },
            content: apiStory?.caption ?? "",
            image: apiStory?.mediaUrl ?? "",
            mediaType: "image" as const,
            views: apiStory?.viewCount ?? 0,
            replies: Array.isArray(apiStory?.viewers)
              ? apiStory.viewers.length
              : 0,
            postedDate: createdAt ? createdAt.toLocaleString() : "",
            expiresIn,
            status: "approved" as StoryStatus,
          } satisfies Story;
        });
      }),
    [data]
  );

  const filteredBySearch = useMemo(
    () =>
      stories.filter((story) =>
        story.userId.name.toLowerCase().includes(searchQuery.toLowerCase())
      ),
    [stories, searchQuery]
  );

  const storiesByUser = useMemo(() => {
    const map = new Map<
      string,
      {
        userId: Story["userId"];
        stories: Story[];
      }
    >();

    filteredBySearch.forEach((story) => {
      const id = story.userId._id;
      if (!map.has(id)) {
        map.set(id, { userId: story.userId, stories: [] });
      }
      map.get(id)!.stories.push(story);
    });

    return Array.from(map.values()).sort((a, b) =>
      a.userId.name.localeCompare(b.userId.name)
    );
  }, [filteredBySearch]);

  const stats = {
    total: stories.length,
    users: storiesByUser.length,
  };

  const handleDelete = async (storyId: string) => {
    if (
      typeof window !== "undefined" &&
      !window.confirm("Are you sure you want to delete this story?")
    ) {
      return;
    }

    try {
      await deleteStoryMutation.mutateAsync(storyId);
      if (selectedStory?.id === storyId) {
        setSelectedStory(null);
      }
    } catch (err) {
      console.error("Failed to delete story:", err);
      if (typeof window !== "undefined") {
        alert("Failed to delete story. Please try again.");
      }
    }
  };

  if (selectedStory) {
    return (
      <StoryDetailsView
        story={selectedStory}
        onBack={() => setSelectedStory(null)}
        onDelete={handleDelete}
        isDeleting={deleteStoryMutation.isPending}
      />
    );
  }

  if (selectedUserId) {
    const userInfo =
      storiesByUser.find((u) => u.userId._id === selectedUserId)?.userId ||
      undefined;

    return (
      <UserStoriesView
        user={userInfo}
        onBack={() => setSelectedUserId(null)}
        onSelectStory={setSelectedStory}
        onDelete={handleDelete}
        isDeleting={deleteStoryMutation.isPending}
      />
    );
  }

  return (
    <main className="min-h-screen bg-linear-to-br from-blue-50 via-cyan-50 to-teal-50 dark:from-slate-950 dark:via-cyan-950 dark:to-slate-950 p-4 md:p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-6 md:mb-8">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-slate-100">
            Stories Moderation
          </h1>
          <p className="text-sm text-gray-600 dark:text-slate-400 mt-1">
            Review and manage 24-hour stories
          </p>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 md:gap-6 mb-6 md:mb-8">
          <div className="bg-white/80 dark:bg-slate-900/60 backdrop-blur-xl border border-gray-200 dark:border-slate-800/50 rounded-xl md:rounded-2xl p-4 md:p-6 hover:shadow-lg transition-all">
            <div className="text-xs md:text-sm text-gray-600 dark:text-slate-400 mb-1">
              Total Stories
            </div>
            <div className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-slate-100">
              {stats.total}
            </div>
          </div>
          <div className="bg-white/80 dark:bg-slate-900/60 backdrop-blur-xl border border-gray-200 dark:border-slate-800/50 rounded-xl md:rounded-2xl p-4 md:p-6 hover:shadow-lg transition-all">
            <div className="text-xs md:text-sm text-gray-600 dark:text-slate-400 mb-1">
              Users with Stories
            </div>
            <div className="text-2xl md:text-3xl font-bold text-blue-600 dark:text-blue-400">
              {stats.users}
            </div>
          </div>
        </div>

        <div className="bg-white/80 dark:bg-slate-900/60 backdrop-blur-xl border border-gray-200 dark:border-slate-800/50 rounded-xl md:rounded-2xl p-4 md:p-6 mb-6">
          <div className="flex items-center gap-3 mb-4">
            <Filter className="text-gray-600 dark:text-slate-400" size={20} />
            <h3 className="text-base md:text-lg font-semibold text-gray-900 dark:text-slate-100">
              Filters
            </h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
            <div className="relative">
              <Search
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 dark:text-slate-400"
                size={18}
              />
              <input
                type="text"
                placeholder="Search users..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-gray-50 dark:bg-slate-800/50 border border-gray-300 dark:border-slate-700/50 rounded-lg text-sm text-gray-900 dark:text-slate-200 placeholder-gray-500 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 transition-all"
              />
            </div>
          </div>
        </div>

        {isLoading && (
          <div className="bg-white/80 dark:bg-slate-900/60 backdrop-blur-xl border border-gray-200 dark:border-slate-800/50 rounded-xl md:rounded-2xl p-12 text-center">
            <div className="text-gray-600 dark:text-slate-400">Loading stories...</div>
          </div>
        )}

        {isError && (
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl md:rounded-2xl p-6 text-center mb-6">
            <div className="text-red-600 dark:text-red-400">
              Failed to load stories: {(error as Error | undefined)?.message ||
                "Unknown error"}
            </div>
          </div>
        )}

        {!isLoading && !isError && (
          <div className="bg-white/80 dark:bg-slate-900/60 backdrop-blur-xl border border-gray-200 dark:border-slate-800/50 rounded-xl md:rounded-2xl p-4 md:p-5 mb-6">
            <h3 className="text-base md:text-lg font-semibold text-gray-900 dark:text-slate-100 mb-4">
              Users
            </h3>
            {storiesByUser.length === 0 ? (
              <div className="py-8 text-center text-gray-600 dark:text-slate-400 text-sm">
                No stories found for any users.
              </div>
            ) : (
              <div className="space-y-3 max-h-[500px] overflow-y-auto pr-1">
                {storiesByUser.map(({ userId, stories }) => (
                  <button
                    key={userId._id}
                    onClick={() => setSelectedUserId(userId._id)}
                    className="w-full flex items-center justify-between gap-3 px-3 py-2.5 rounded-lg text-left transition-all bg-gray-50 dark:bg-slate-900/60 border border-gray-200 dark:border-slate-800/60 hover:bg-gray-100 dark:hover:bg-slate-800"
                  >
                    <div className="flex items-center gap-3">
                      <div className="h-8 w-8 rounded-full bg-linear-to-br from-cyan-600 to-blue-600 flex items-center justify-center text-white text-xs font-bold">
                        {userId.name.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <div className="text-sm font-medium text-gray-900 dark:text-slate-100">
                          {userId.name}
                        </div>
                        <div className="text-[11px] text-gray-500 dark:text-slate-500">
                          {stories.length} {stories.length === 1 ? "story" : "stories"}
                        </div>
                      </div>
                    </div>
                    <span className="text-xs font-medium text-cyan-600 dark:text-cyan-400">
                      See all stories
                    </span>
                  </button>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </main>
  );
}