"use client";
/* eslint-disable @next/next/no-img-element */

import React, { useState, useMemo} from "react";
import { Eye, ArrowLeft, Search, Filter, Heart, MessageCircle, Share2, Bookmark, Trash2, Clock } from "lucide-react";

import { usePosts, useDeletePost, useInfinitePosts, usePostComments } from "@/hooks/usePosts";

type PostStatus = "pending" | "approved" | "rejected";

interface Post {
  _id: string;
  username: string;
  userId: {
    _id: string;
    name: string;
    profilePicture?: string;
  };
  caption: string;
  mediaUrl?: string;
  mediaType: "image" | "video" | "text";
  likesCount: number;
  commentsCount: number;
  sharesCount: number;
  savesCount: number;
  createdAt: string;
  status: PostStatus;
  category: string;
  isActive: boolean;
}

function StatusBadge({ status }: { status: PostStatus }) {
  const styles = {
    pending:
      "bg-yellow-100 text-yellow-800 border-yellow-200 dark:bg-yellow-900/30 dark:text-yellow-400 dark:border-yellow-700",
    approved:
      "bg-green-100 text-green-800 border-green-200 dark:bg-green-900/30 dark:text-green-400 dark:border-green-700",
    rejected:
      "bg-red-100 text-red-800 border-red-200 dark:bg-red-900/30 dark:text-red-400 dark:border-red-700",
  };

  const labels = {
    pending: "Pending",
    approved: "Approved",
    rejected: "Rejected",
  };

  return (
    <span
      className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${styles[status]}`}
    >
      {labels[status]}
    </span>
  );
}

export default function PostsModeration() {
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | PostStatus>("all");
  const [typeFilter, setTypeFilter] = useState<"all" | "image" | "video" | "text">("all");

  // Fetch posts using TanStack Query
  const { data, isLoading, isError, error } = usePosts({ limit: 100 });
  const deletePostMutation = useDeletePost();

  const posts = useMemo(() => data?.posts || [], [data]);

  const handleDelete = async (postId: string) => {
    if (window.confirm("Are you sure you want to delete this post?")) {
      try {
        await deletePostMutation.mutateAsync(postId);
        if (selectedPost?._id === postId) {
          setSelectedPost(null);
        }
      } catch (error) {
        console.error("Failed to delete post:", error);
        alert("Failed to delete post. Please try again.");
      }
    }
  };

  const filteredPosts = useMemo(() => {
    return posts.filter((post: Post) => {
      // Exclude video/reel posts from this moderation view
      if (post.mediaType === "video") return false;

      const matchesSearch = post.userId.name
        .toLowerCase()
        .includes(searchQuery.toLowerCase());
      const matchesStatus = statusFilter === "all" || post.status === statusFilter;
      const matchesType = typeFilter === "all" || post.mediaType === typeFilter;
      return matchesSearch && matchesStatus && matchesType;
    });
  }, [posts, searchQuery, statusFilter, typeFilter]);

  const stats = useMemo(
    () => ({
      total: posts.length,
      pending: posts.filter((p: Post) => p.status === "pending").length,
      approved: posts.filter((p: Post) => p.status === "approved").length,
      rejected: posts.filter((p: Post) => p.status === "rejected").length,
    }),
    [posts]
  );

  const postsByUser = useMemo(() => {
    const map = new Map<
      string,
      {
        userId: Post["userId"];
        posts: Post[];
      }
    >();

    filteredPosts.forEach((post: Post) => {
      const id = post.userId._id;
      if (!map.has(id)) {
        map.set(id, { userId: post.userId, posts: [] });
      }
      map.get(id)!.posts.push(post);
    });

    return Array.from(map.values()).sort((a, b) =>
      a.userId.name.localeCompare(b.userId.name)
    );
  }, [filteredPosts]);

  const selectedUserPosts = useMemo(() => {
    if (!selectedUserId) return [];
    return filteredPosts
      .filter((post: Post) => post.userId._id === selectedUserId)
      .slice()
      .sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
  }, [filteredPosts, selectedUserId]);

  if (selectedPost) {
    return (
      <PostDetailsView
        post={selectedPost}
        onBack={() => setSelectedPost(null)}
        onDelete={handleDelete}
        isDeleting={deletePostMutation.isPending}
      />
    );
  }

  if (selectedUserId) {
    const userInfo = selectedUserPosts[0]?.userId || postsByUser.find((u) => u.userId._id === selectedUserId)?.userId;

    return (
      <UserPostsView
        user={userInfo}
        onBack={() => setSelectedUserId(null)}
        onSelectPost={setSelectedPost}
        onDelete={handleDelete}
        isDeleting={deletePostMutation.isPending}
      />
    );
  }

  return (
    <main className="min-h-screen bg-linear-to-br from-indigo-50 via-purple-50 to-pink-50 dark:from-slate-950 dark:via-indigo-950 dark:to-slate-950 p-4 md:p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6 md:mb-8">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-slate-100">Posts Moderation</h1>
          <p className="text-sm text-gray-600 dark:text-slate-400 mt-1">Review and manage user posts</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-6 mb-6 md:mb-8">
          <div className="bg-white/80 dark:bg-slate-900/60 backdrop-blur-xl border border-gray-200 dark:border-slate-800/50 rounded-xl md:rounded-2xl p-4 md:p-6 hover:shadow-lg transition-all">
            <div className="text-xs md:text-sm text-gray-600 dark:text-slate-400 mb-1">Total Posts</div>
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
                placeholder="Search posts..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-gray-50 dark:bg-slate-800/50 border border-gray-300 dark:border-slate-700/50 rounded-lg text-sm text-gray-900 dark:text-slate-200 placeholder-gray-500 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all"
              />
            </div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as "all" | PostStatus)}
              className="px-4 py-2.5 bg-gray-50 dark:bg-slate-800/50 border border-gray-300 dark:border-slate-700/50 rounded-lg text-sm text-gray-900 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all"
            >
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="approved">Approved</option>
              <option value="rejected">Rejected</option>
            </select>
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value as "all" | "image" | "text")}
              className="px-4 py-2.5 bg-gray-50 dark:bg-slate-800/50 border border-gray-300 dark:border-slate-700/50 rounded-lg text-sm text-gray-900 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all"
            >
              <option value="all">All Types</option>
              <option value="image">Images</option>
              <option value="text">Text Only</option>
            </select>
          </div>
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="bg-white/80 dark:bg-slate-900/60 backdrop-blur-xl border border-gray-200 dark:border-slate-800/50 rounded-xl md:rounded-2xl p-12 text-center">
            <div className="text-gray-600 dark:text-slate-400">Loading posts...</div>
          </div>
        )}

        {/* Error State */}
        {isError && (
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl md:rounded-2xl p-6 text-center">
            <div className="text-red-600 dark:text-red-400">
              Failed to load posts: {error?.message || "Unknown error"}
            </div>
          </div>
        )}

        {/* Grouped by User - main users list only */}
        {!isLoading && !isError && (
          <>
            {filteredPosts.length === 0 ? (
              <div className="bg-white/80 dark:bg-slate-900/60 backdrop-blur-xl border border-gray-200 dark:border-slate-800/50 rounded-xl md:rounded-2xl p-12 text-center">
                <div className="text-gray-600 dark:text-slate-400">
                  No posts found matching your filters
                </div>
              </div>
            ) : (
              <div className="bg-white/80 dark:bg-slate-900/60 backdrop-blur-xl border border-gray-200 dark:border-slate-800/50 rounded-xl md:rounded-2xl p-4 md:p-5 mb-6">
                <h3 className="text-base md:text-lg font-semibold text-gray-900 dark:text-slate-100 mb-4">
                  Users
                </h3>
                <div className="space-y-3 max-h-[500px] overflow-y-auto pr-1">
                  {postsByUser.map(({ userId, posts }) => (
                    <button
                      key={userId._id}
                      onClick={() => setSelectedUserId(userId._id)}
                      className="w-full flex items-center justify-between gap-3 px-3 py-2.5 rounded-lg text-left transition-all bg-gray-50 dark:bg-slate-900/60 border border-gray-200 dark:border-slate-800/60 hover:bg-gray-100 dark:hover:bg-slate-800"
                    >
                      <div className="flex items-center gap-3">
                        <div className="h-8 w-8 rounded-full bg-linear-to-br from-indigo-600 to-purple-600 flex items-center justify-center text-white text-xs font-bold">
                          {userId.name.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <div className="text-sm font-medium text-gray-900 dark:text-slate-100">
                            {userId.name}
                          </div>
                          <div className="text-[11px] text-gray-500 dark:text-slate-500">
                            {posts.length} post{posts.length !== 1 ? "s" : ""}
                          </div>
                        </div>
                      </div>
                      <span className="text-xs font-medium text-indigo-600 dark:text-indigo-400">
                        See all posts
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

function UserPostsView({
  user,
  onBack,
  onSelectPost,
  onDelete,
  isDeleting,
}: {
  user?: Post["userId"];
  onBack: () => void;
  onSelectPost: (post: Post) => void;
  onDelete: (postId: string) => void;
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
  } = useInfinitePosts({ limit: 20, userId });

  const posts: Post[] = useMemo(
    () =>
      (data?.pages || []).flatMap((page) => (page.posts as Post[]) || []),
    [data]
  );

  return (
    <main className="min-h-screen bg-linear-to-br from-indigo-50 via-purple-50 to-pink-50 dark:from-slate-950 dark:via-indigo-950 dark:to-slate-950 p-4 md:p-6">
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
            {user ? user.name : "User"}&aops;s Posts
          </h1>
          {user && (
            <p className="text-sm text-gray-600 dark:text-slate-400 mt-1">User ID: {user._id}</p>
          )}
        </div>

        <div className="bg-white/80 dark:bg-slate-900/60 backdrop-blur-xl border border-gray-200 dark:border-slate-800/50 rounded-xl md:rounded-2xl p-4 md:p-6">
          {isLoading && (
            <div className="text-sm text-gray-600 dark:text-slate-400">Loading posts...</div>
          )}

          {isError && (
            <div className="text-sm text-red-600 dark:text-red-400">
              {(error as Error | undefined)?.message || "Failed to load posts"}
            </div>
          )}

          {!isLoading && !isError && posts.length === 0 ? (
            <div className="text-sm text-gray-600 dark:text-slate-400">
              No posts found for this user with the current filters.
            </div>
          ) : !isLoading && !isError ? (
            <div className="overflow-x-auto">
              <table className="min-w-full text-left text-sm">
                <thead>
                  <tr className="border-b border-gray-200 dark:border-slate-800 text-xs uppercase tracking-wide text-gray-500 dark:text-slate-400">
                    <th className="py-2 pr-4 font-medium">Media</th>
                    <th className="py-2 pr-4 font-medium">Caption</th>
                    <th className="py-2 pr-4 font-medium">Status</th>
                    <th className="py-2 pr-4 font-medium">Likes</th>
                    <th className="py-2 pr-4 font-medium">Comments</th>
                    <th className="py-2 pr-4 font-medium">Shares</th>
                    <th className="py-2 pr-4 font-medium">Created</th>
                    <th className="py-2 pl-2 font-medium text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {posts.map((post) => (
                    <tr
                      key={post._id}
                      className="border-b border-gray-100 dark:border-slate-800/70 hover:bg-gray-50/70 dark:hover:bg-slate-900/70 transition-colors"
                    >
                      <td className="py-3 pr-4 align-top">
                        {post.mediaUrl && post.mediaType === "image" ? (
                          <img
                            src={post.mediaUrl}
                            alt="Post"
                            className="w-14 h-14 rounded-md object-cover bg-gray-100 dark:bg-slate-950"
                          />
                        ) : (
                          <div className="w-14 h-14 rounded-md flex items-center justify-center bg-gray-100 dark:bg-slate-900 text-[11px] text-gray-500 dark:text-slate-400">
                            {post.mediaType === "text" ? "Text" : "No media"}
                          </div>
                        )}
                      </td>
                      <td className="py-3 pr-4 align-top max-w-xs">
                        <div className="text-sm font-medium text-gray-900 dark:text-slate-100 line-clamp-2">
                          {post.caption || "No caption"}
                        </div>
                      </td>
                      <td className="py-3 pr-4 align-top">
                        <StatusBadge status={post.status} />
                      </td>
                      <td className="py-3 pr-4 align-top text-gray-700 dark:text-slate-200">{post.likesCount}</td>
                      <td className="py-3 pr-4 align-top text-gray-700 dark:text-slate-200">{post.commentsCount}</td>
                      <td className="py-3 pr-4 align-top text-gray-700 dark:text-slate-200">{post.sharesCount}</td>
                      <td className="py-3 pr-4 align-top text-xs text-gray-500 dark:text-slate-400 whitespace-nowrap">
                        {new Date(post.createdAt).toLocaleString()}
                      </td>
                      <td className="py-3 pl-2 align-top">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => onSelectPost(post)}
                            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-gray-100 dark:bg-slate-800 hover:bg-gray-200 dark:hover:bg-slate-700 text-gray-700 dark:text-slate-300 text-xs font-medium transition-all"
                          >
                            <Eye size={14} />
                            View
                          </button>
                          <button
                            onClick={() => onDelete(post._id)}
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
                    className="px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-medium shadow-sm transition-all disabled:opacity-50 disabled:cursor-not-allowed"
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

function PostDetailsView({
  post,
  onBack,
  onDelete,
  isDeleting,
}: {
  post: Post;
  onBack: () => void;
  onDelete: (postId: string) => void;
  isDeleting: boolean;
}) {
  const [showComments, setShowComments] = useState(false);

  const {
    data: commentsData,
    isLoading: isCommentsLoading,
    isError: isCommentsError,
    error: commentsError,
    hasNextPage: hasMoreComments,
    fetchNextPage: fetchMoreComments,
    isFetchingNextPage: isFetchingMoreComments,
  } = usePostComments({ postId: post._id, limit: 10 });

  const comments = useMemo(
    () =>
      (commentsData?.pages || []).flatMap((page) =>
        (page.comments || []).map((comment) => comment)
      ),
    [commentsData]
  );

  return (
    <main className="min-h-screen bg-linear-to-br from-indigo-50 via-purple-50 to-pink-50 dark:from-slate-950 dark:via-indigo-950 dark:to-slate-950 p-4 md:p-6">
      <div className="max-w-5xl mx-auto">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-gray-600 dark:text-slate-400 hover:text-gray-900 dark:hover:text-slate-200 transition-colors mb-6 group"
        >
          <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
          <span className="text-sm font-medium">Back to Posts</span>
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            {post.mediaUrl && post.mediaType === "image" && (
              <div className="bg-white/80 dark:bg-slate-900/60 backdrop-blur-xl border border-gray-200 dark:border-slate-800/50 rounded-2xl overflow-hidden">
                <img
                  src={post.mediaUrl}
                  alt="Post content"
                  className="w-full h-auto max-h-[600px] object-contain bg-gray-100 dark:bg-slate-950"
                />
              </div>
            )}
            {post.mediaUrl && post.mediaType === "video" && (
              <div className="bg-white/80 dark:bg-slate-900/60 backdrop-blur-xl border border-gray-200 dark:border-slate-800/50 rounded-2xl overflow-hidden">
                <video
                  src={post.mediaUrl}
                  className="w-full h-auto max-h-[600px] object-contain bg-gray-100 dark:bg-slate-950"
                  controls
                />
              </div>
            )}
            <div className="bg-white/80 dark:bg-slate-900/60 backdrop-blur-xl border border-gray-200 dark:border-slate-800/50 rounded-2xl p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-slate-100 mb-4">Post Content</h3>
              <p className="text-gray-700 dark:text-slate-300 leading-relaxed whitespace-pre-wrap">{post.caption}</p>
            </div>

            {/* Instagram-style metrics row under content */}
            <div className="bg-white/80 dark:bg-slate-900/60 backdrop-blur-xl border border-gray-200 dark:border-slate-800/50 rounded-2xl p-4">
              <div className="flex items-center justify-around text-xs md:text-sm text-gray-700 dark:text-slate-200">
                <div className="flex items-center gap-1.5">
                  <Heart size={16} className="text-pink-500" />
                  <span>{Number(post.likesCount ?? 0).toLocaleString()}</span>
                </div>
                <button
                  type="button"
                  onClick={() => setShowComments((prev) => !prev)}
                  className="flex items-center gap-1.5 px-2 py-1 rounded-full bg-slate-100 dark:bg-slate-900/70 text-xs md:text-sm text-gray-700 dark:text-slate-100 hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors"
                >
                  <MessageCircle size={16} className="text-sky-500" />
                  <span>{Number(post.commentsCount ?? 0).toLocaleString()}</span>
                </button>
                <div className="flex items-center gap-1.5">
                  <Share2 size={16} className="text-emerald-500" />
                  <span>{Number(post.sharesCount ?? 0).toLocaleString()}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Bookmark size={16} className="text-indigo-500" />
                  <span>{Number(post.savesCount ?? 0).toLocaleString()}</span>
                </div>
              </div>
            </div>

            {/* Comments list (toggleable) */}
            {showComments && (
              <div
                className="bg-white/80 dark:bg-slate-900/60 backdrop-blur-xl border border-gray-200 dark:border-slate-800/50 rounded-2xl p-4 max-h-80 overflow-y-auto"
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
                  <div className="text-xs text-gray-600 dark:text-slate-400">No comments yet on this post.</div>
                )}

                <div className="space-y-3">
                  {comments.map((comment) => (
                    <div
                      key={comment._id}
                      className="flex items-start gap-3 rounded-lg bg-gray-50/80 dark:bg-slate-900/70 px-3 py-2.5"
                    >
                      <div className="h-8 w-8 rounded-full bg-linear-to-br from-indigo-600 to-purple-600 flex items-center justify-center text-white text-xs font-semibold overflow-hidden shrink-0">
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
                      className="px-3 py-1.5 rounded-full bg-indigo-600 hover:bg-indigo-700 text-white text-[11px] font-medium shadow-sm transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isFetchingMoreComments ? "Loading more..." : "Load more comments"}
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>

          <div className="space-y-6">
            <div className="bg-white/80 dark:bg-slate-900/60 backdrop-blur-xl border border-gray-200 dark:border-slate-800/50 rounded-2xl p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-slate-100 mb-4">User Info</h3>
              <div className="flex items-center gap-3 mb-4">
                <div className="h-12 w-12 rounded-full bg-linear-to-br from-indigo-600 to-purple-600 flex items-center justify-center text-white text-lg font-bold">
                  {post.userId.name.charAt(0).toUpperCase()}
                </div>
                <div>
                  <div className="text-gray-900 dark:text-slate-200 font-medium">{post.userId.name}</div>
                  <div className="text-gray-600 dark:text-slate-500 text-sm">{post.userId._id}</div>
                </div>
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
                  <div className="flex items-center justify-between gap-2 px-3 py-2 rounded-xl bg-linear-to-r from-slate-900/80 via-slate-800/80 to-indigo-900/70 border border-slate-700/60 shadow-sm">
                    <div className="flex flex-col">
                      <span className="text-xs text-slate-300 uppercase tracking-wide">Date</span>
                      <span className="text-sm font-semibold text-slate-50">
                        {new Date(post.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    <div className="h-8 w-px bg-slate-700/70" />
                    <div className="flex flex-col items-end">
                      <span className="text-xs text-slate-300 uppercase tracking-wide">Time</span>
                      <span className="text-sm font-semibold text-slate-50">
                        {new Date(post.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
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
                  onClick={() => onDelete(post._id)}
                  disabled={isDeleting}
                  className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-lg font-medium bg-red-500 hover:bg-red-600 text-white shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Trash2 size={18} />
                  {isDeleting ? "Deleting..." : "Delete Post"}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}