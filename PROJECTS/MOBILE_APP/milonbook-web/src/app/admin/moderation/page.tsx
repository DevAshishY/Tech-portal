"use client";

import React, { useState } from "react";
import { Eye, Check, X, ArrowLeft, Search, Filter, Heart, MessageCircle, Image, Video, FileText } from "lucide-react";

/* ============= TYPES ============= */
type PostStatus = "pending" | "approved" | "rejected";

interface Post {
  id: string;
  username: string;
  userId: string;
  content: string;
  image?: string;
  mediaType: "image" | "video" | "text";
  likes: number;
  comments: number;
  postedDate: string;
  status: PostStatus;
}

/* ============= DUMMY DATA ============= */
const dummyPosts: Post[] = [
  {
    id: "P001",
    username: "john_doe",
    userId: "U123",
    content: "Beautiful sunset today! 🌅",
    image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400",
    mediaType: "image",
    likes: 1234,
    comments: 56,
    postedDate: "2024-02-20",
    status: "pending",
  },
  {
    id: "P002",
    username: "jane_smith",
    userId: "U124",
    content: "Dance challenge 💃",
    image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400",
    mediaType: "video",
    likes: 5678,
    comments: 234,
    postedDate: "2024-02-20",
    status: "approved",
  },
  {
    id: "P003",
    username: "mike_wilson",
    userId: "U125",
    content: "My new artwork - abstract painting exploring themes of isolation and connection in the digital age",
    image: "https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=400",
    mediaType: "image",
    likes: 890,
    comments: 45,
    postedDate: "2024-02-19",
    status: "approved",
  },
  {
    id: "P004",
    username: "sarah_jones",
    userId: "U126",
    content: "Travel vlog - Paris highlights",
    image: "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=400",
    mediaType: "video",
    likes: 3456,
    comments: 178,
    postedDate: "2024-02-19",
    status: "pending",
  },
  {
    id: "P005",
    username: "alex_brown",
    userId: "U127",
    content: "Good morning everyone!",
    mediaType: "text",
    likes: 234,
    comments: 12,
    postedDate: "2024-02-20",
    status: "approved",
  },
  {
    id: "P006",
    username: "emily_davis",
    userId: "U128",
    content: "Food photography session 📸",
    image: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=400",
    mediaType: "image",
    likes: 1890,
    comments: 89,
    postedDate: "2024-02-18",
    status: "rejected",
  },
  {
    id: "P007",
    username: "david_lee",
    userId: "U129",
    content: "Fitness motivation 💪",
    image: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=400",
    mediaType: "video",
    likes: 4567,
    comments: 156,
    postedDate: "2024-02-18",
    status: "pending",
  },
  {
    id: "P008",
    username: "lisa_taylor",
    userId: "U130",
    content: "Homemade pasta recipe",
    image: "https://images.unsplash.com/photo-1473093295043-cdd812d0e601?w=400",
    mediaType: "image",
    likes: 2345,
    comments: 123,
    postedDate: "2024-02-17",
    status: "approved",
  },
];

/* ============= COMPONENTS ============= */

function StatusBadge({ status }: { status: PostStatus }) {
  const styles = {
    pending: "bg-yellow-100 text-yellow-800 border-yellow-200 dark:bg-yellow-900/30 dark:text-yellow-400 dark:border-yellow-700",
    approved: "bg-green-100 text-green-800 border-green-200 dark:bg-green-900/30 dark:text-green-400 dark:border-green-700",
    rejected: "bg-red-100 text-red-800 border-red-200 dark:bg-red-900/30 dark:text-red-400 dark:border-red-700",
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

function MediaBadge({ type }: { type: "image" | "video" | "text" }) {
  const config = {
    image: { 
      bg: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400",
      icon: Image
    },
    video: { 
      bg: "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400",
      icon: Video
    },
    text: { 
      bg: "bg-gray-100 text-gray-800 dark:bg-gray-700/30 dark:text-gray-400",
      icon: FileText
    },
  };

  const Icon = config[type].icon;

  return (
    <span className={`inline-flex items-center gap-1.5 px-2 py-1 rounded text-xs font-medium ${config[type].bg}`}>
      <Icon size={12} />
      {type.charAt(0).toUpperCase() + type.slice(1)}
    </span>
  );
}

/* ============= MAIN APP ============= */
export default function ContentModerationApp() {
  const [posts, setPosts] = useState<Post[]>(dummyPosts);
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | PostStatus>("all");
  const [typeFilter, setTypeFilter] = useState<"all" | "image" | "video" | "text">("all");

  const handleStatusChange = (postId: string, newStatus: PostStatus) => {
    setPosts((prev) =>
      prev.map((post) =>
        post.id === postId ? { ...post, status: newStatus } : post
      )
    );
    if (selectedPost?.id === postId) {
      setSelectedPost((prev) => prev ? { ...prev, status: newStatus } : null);
    }
  };

  const filteredPosts = posts.filter((post) => {
    const matchesSearch =
      post.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.id.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "all" || post.status === statusFilter;
    const matchesType = typeFilter === "all" || post.mediaType === typeFilter;
    return matchesSearch && matchesStatus && matchesType;
  });

  const stats = {
    total: posts.length,
    pending: posts.filter((p) => p.status === "pending").length,
    approved: posts.filter((p) => p.status === "approved").length,
    rejected: posts.filter((p) => p.status === "rejected").length,
  };

  if (selectedPost) {
    return (
      <PostDetailsView
        post={selectedPost}
        onBack={() => setSelectedPost(null)}
        onStatusChange={handleStatusChange}
      />
    );
  }

  return (
    <main className="min-h-screen bg-linear-to-br from-gray-50 via-gray-100 to-gray-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 p-6 overflow-x-hidden">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-slate-100">Content Moderation</h1>
        <p className="text-sm text-gray-600 dark:text-slate-400 mt-1">
          View and manage all user posts
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white dark:bg-slate-900/40 backdrop-blur-xl border border-gray-200 dark:border-slate-800/50 rounded-2xl p-6 hover:shadow-lg dark:hover:bg-slate-900/60 transition-all">
          <div className="text-sm text-gray-600 dark:text-slate-400 mb-1">Total Posts</div>
          <div className="text-3xl font-bold text-gray-900 dark:text-slate-100">{stats.total}</div>
        </div>
        <div className="bg-white dark:bg-slate-900/40 backdrop-blur-xl border border-gray-200 dark:border-slate-800/50 rounded-2xl p-6 hover:shadow-lg dark:hover:bg-slate-900/60 transition-all">
          <div className="text-sm text-gray-600 dark:text-slate-400 mb-1">Pending Review</div>
          <div className="text-3xl font-bold text-yellow-600 dark:text-yellow-400">{stats.pending}</div>
        </div>
        <div className="bg-white dark:bg-slate-900/40 backdrop-blur-xl border border-gray-200 dark:border-slate-800/50 rounded-2xl p-6 hover:shadow-lg dark:hover:bg-slate-900/60 transition-all">
          <div className="text-sm text-gray-600 dark:text-slate-400 mb-1">Approved</div>
          <div className="text-3xl font-bold text-green-600 dark:text-green-400">{stats.approved}</div>
        </div>
        <div className="bg-white dark:bg-slate-900/40 backdrop-blur-xl border border-gray-200 dark:border-slate-800/50 rounded-2xl p-6 hover:shadow-lg dark:hover:bg-slate-900/60 transition-all">
          <div className="text-sm text-gray-600 dark:text-slate-400 mb-1">Rejected</div>
          <div className="text-3xl font-bold text-red-600 dark:text-red-400">{stats.rejected}</div>
        </div>
      </div>

      {/* Filters & Search */}
      <div className="bg-white dark:bg-slate-900/40 backdrop-blur-xl border border-gray-200 dark:border-slate-800/50 rounded-2xl p-6 mb-6">
        <div className="flex items-center gap-3 mb-4">
          <Filter className="text-gray-600 dark:text-slate-400" size={20} />
          <h3 className="text-lg font-semibold text-gray-900 dark:text-slate-100">Filters & Search</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 dark:text-slate-400" size={18} />
            <input
              type="text"
              placeholder="Search posts, users, ID..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-gray-50 dark:bg-slate-800/50 border border-gray-300 dark:border-slate-700/50 rounded-lg text-gray-900 dark:text-slate-200 placeholder-gray-500 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-violet-500/50 transition-all"
            />
          </div>

          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as "all" | PostStatus)}
            className="px-4 py-2.5 bg-gray-50 dark:bg-slate-800/50 border border-gray-300 dark:border-slate-700/50 rounded-lg text-gray-900 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-violet-500/50 transition-all"
          >
            <option value="all">All Status</option>
            <option value="pending">Pending</option>
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>
          </select>

          {/* Type Filter */}
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value as "all" | "image" | "video" | "text")}
            className="px-4 py-2.5 bg-gray-50 dark:bg-slate-800/50 border border-gray-300 dark:border-slate-700/50 rounded-lg text-gray-900 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-violet-500/50 transition-all"
          >
            <option value="all">All Types</option>
            <option value="image">Images</option>
            <option value="video">Videos</option>
            <option value="text">Text Only</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white dark:bg-slate-900/40 backdrop-blur-xl border border-gray-200 dark:border-slate-800/50 rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full min-w-max">
            <thead>
              <tr className="bg-gray-50 dark:bg-slate-800/30 border-b border-gray-200 dark:border-slate-700/50">
                <th className="text-left px-4 py-4 text-xs font-semibold text-gray-700 dark:text-slate-400 uppercase tracking-wider whitespace-nowrap">
                  Post ID
                </th>
                <th className="text-left px-4 py-4 text-xs font-semibold text-gray-700 dark:text-slate-400 uppercase tracking-wider whitespace-nowrap">
                  Username
                </th>
                <th className="text-left px-4 py-4 text-xs font-semibold text-gray-700 dark:text-slate-400 uppercase tracking-wider whitespace-nowrap">
                  Content Preview
                </th>
                <th className="text-left px-4 py-4 text-xs font-semibold text-gray-700 dark:text-slate-400 uppercase tracking-wider whitespace-nowrap">
                  Media
                </th>
                <th className="text-left px-4 py-4 text-xs font-semibold text-gray-700 dark:text-slate-400 uppercase tracking-wider whitespace-nowrap">
                  Posted Date
                </th>
                <th className="text-left px-4 py-4 text-xs font-semibold text-gray-700 dark:text-slate-400 uppercase tracking-wider whitespace-nowrap">
                  Engagement
                </th>
                <th className="text-left px-4 py-4 text-xs font-semibold text-gray-700 dark:text-slate-400 uppercase tracking-wider whitespace-nowrap">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredPosts.map((post) => (
                <tr
                  key={post.id}
                  className="border-b border-gray-200 dark:border-slate-800/50 hover:bg-gray-50 dark:hover:bg-slate-800/20 transition-colors"
                >
                  <td className="px-4 py-4 whitespace-nowrap">
                    <span className="text-sm font-medium text-gray-900 dark:text-slate-300">{post.id}</span>
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-3">
                      <div className="h-9 w-9 rounded-full bg-linear-to-br from-violet-600 to-indigo-600 flex items-center justify-center text-white text-sm font-bold shrink-0">
                        {post.username.charAt(0).toUpperCase()}
                      </div>
                      <span className="text-sm font-medium text-gray-900 dark:text-slate-200">{post.username}</span>
                    </div>
                  </td>
                  <td className="px-4 py-4 max-w-xs">
                    <div className="flex items-center gap-3">
                      {post.image && (
                        <img
                          src={post.image}
                          alt="Post preview"
                          className="h-12 w-12 rounded-lg object-cover shrink-0"
                        />
                      )}
                      <span className="text-sm text-gray-700 dark:text-slate-300 truncate">
                        {post.content.length > 50
                          ? `${post.content.substring(0, 50)}...`
                          : post.content}
                      </span>
                    </div>
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap">
                    <MediaBadge type={post.mediaType} />
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap">
                    <span className="text-sm text-gray-600 dark:text-slate-400">{post.postedDate}</span>
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-600 dark:text-slate-400 space-y-1">
                      <div className="flex items-center gap-1.5">
                        <Heart size={14} />
                        <span>{post.likes}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <MessageCircle size={14} />
                        <span>{post.comments}</span>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setSelectedPost(post)}
                        className="p-2 rounded-lg bg-gray-200 dark:bg-slate-700/50 hover:bg-gray-300 dark:hover:bg-slate-700 text-gray-700 dark:text-slate-300 hover:text-gray-900 dark:hover:text-white transition-all group"
                        title="View details"
                      >
                        <Eye size={16} />
                      </button>
                      {post.status !== "approved" && (
                        <button
                          onClick={() => handleStatusChange(post.id, "approved")}
                          className="p-2 rounded-lg bg-green-100 dark:bg-green-500/10 hover:bg-green-200 dark:hover:bg-green-500/20 text-green-700 dark:text-green-400 hover:text-green-800 dark:hover:text-green-300 transition-all"
                          title="Approve"
                        >
                          <Check size={16} />
                        </button>
                      )}
                      {post.status !== "rejected" && (
                        <button
                          onClick={() => handleStatusChange(post.id, "rejected")}
                          className="p-2 rounded-lg bg-red-100 dark:bg-red-500/10 hover:bg-red-200 dark:hover:bg-red-500/20 text-red-700 dark:text-red-400 hover:text-red-800 dark:hover:text-red-300 transition-all"
                          title="Reject"
                        >
                          <X size={16} />
                        </button>
                      )}                   
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredPosts.length === 0 && (
          <div className="py-12 text-center">
            <div className="text-gray-600 dark:text-slate-400 text-sm">No posts found matching your filters</div>
          </div>
        )}
      </div>
    </main>
  );
}

/* ============= POST DETAILS VIEW ============= */
function PostDetailsView({
  post,
  onBack,
  onStatusChange,
}: {
  post: Post;
  onBack: () => void;
  onStatusChange: (postId: string, status: PostStatus) => void;
}) {
  return (
    <main className="min-h-screen bg-linear-to-br from-gray-50 via-gray-100 to-gray-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 p-6 overflow-x-hidden">
      {/* Back Button */}
      <button
        onClick={onBack}
        className="flex items-center gap-2 text-gray-600 dark:text-slate-400 hover:text-gray-900 dark:hover:text-slate-200 transition-colors mb-6 group"
      >
        <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
        <span className="text-sm font-medium">Back to Content Moderation</span>
      </button>

      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-slate-100">Post Details</h1>
        <p className="text-sm text-gray-600 dark:text-slate-400 mt-1">View full post information</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Post Image/Video */}
          {post.image && (
            <div className="bg-white dark:bg-slate-900/40 backdrop-blur-xl border border-gray-200 dark:border-slate-800/50 rounded-2xl overflow-hidden">
              <img
                src={post.image}
                alt="Post content"
                className="w-full h-auto max-h-[600px] object-contain bg-gray-100 dark:bg-slate-950"
              />
            </div>
          )}

          {/* Post Content */}
          <div className="bg-white dark:bg-slate-900/40 backdrop-blur-xl border border-gray-200 dark:border-slate-800/50 rounded-2xl p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-slate-100 mb-4">Post Content</h3>
            <p className="text-gray-700 dark:text-slate-300 leading-relaxed whitespace-pre-wrap">{post.content}</p>
          </div>
        </div>

        {/* Sidebar Info */}
        <div className="space-y-6">
          {/* User Info */}
          <div className="bg-white dark:bg-slate-900/40 backdrop-blur-xl border border-gray-200 dark:border-slate-800/50 rounded-2xl p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-slate-100 mb-4">User Information</h3>
            <div className="flex items-center gap-3 mb-6">
              <div className="h-16 w-16 rounded-full bg-linear-to-br from-violet-600 to-indigo-600 flex items-center justify-center text-white text-xl font-bold">
                {post.username.charAt(0).toUpperCase()}
              </div>
              <div>
                <div className="text-gray-900 dark:text-slate-200 font-medium">{post.username}</div>
                <div className="text-gray-600 dark:text-slate-500 text-sm">{post.userId}</div>
              </div>
            </div>
          </div>

          {/* Post Metadata */}
          <div className="bg-white dark:bg-slate-900/40 backdrop-blur-xl border border-gray-200 dark:border-slate-800/50 rounded-2xl p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-slate-100 mb-4">Post Metadata</h3>
            <div className="space-y-4">
              <div>
                <div className="text-xs text-gray-600 dark:text-slate-500 uppercase tracking-wider mb-1">Post ID</div>
                <div className="text-gray-900 dark:text-slate-300 font-medium">{post.id}</div>
              </div>
              <div>
                <div className="text-xs text-gray-600 dark:text-slate-500 uppercase tracking-wider mb-1">Posted Date</div>
                <div className="text-gray-900 dark:text-slate-300 font-medium">{post.postedDate}</div>
              </div>
              <div>
                <div className="text-xs text-gray-600 dark:text-slate-500 uppercase tracking-wider mb-1">Media Type</div>
                <div className="mt-1">
                  <MediaBadge type={post.mediaType} />
                </div>
              </div>
              <div>
                <div className="text-xs text-gray-600 dark:text-slate-500 uppercase tracking-wider mb-1">Status</div>
                <div className="mt-1">
                  <StatusBadge status={post.status} />
                </div>
              </div>
            </div>
          </div>

          {/* Engagement Stats */}
          <div className="bg-white dark:bg-slate-900/40 backdrop-blur-xl border border-gray-200 dark:border-slate-800/50 rounded-2xl p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-slate-100 mb-4">Engagement</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-gray-600 dark:text-slate-400 flex items-center gap-2">
                  <Heart size={16} />
                  Likes
                </span>
                <span className="text-gray-900 dark:text-slate-200 font-medium">{post.likes}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600 dark:text-slate-400 flex items-center gap-2">
                  <MessageCircle size={16} />
                  Comments
                </span>
                <span className="text-gray-900 dark:text-slate-200 font-medium">{post.comments}</span>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="bg-white dark:bg-slate-900/40 backdrop-blur-xl border border-gray-200 dark:border-slate-800/50 rounded-2xl p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-slate-100 mb-4">Moderation Actions</h3>
            <div className="space-y-3">
              <button
                onClick={() => onStatusChange(post.id, "approved")}
                disabled={post.status === "approved"}
                className={`w-full flex items-center justify-center gap-2 px-4 py-3 rounded-lg font-medium transition-all ${
                  post.status === "approved"
                    ? "bg-green-100 dark:bg-green-500/20 text-green-700 dark:text-green-300 cursor-not-allowed"
                    : "bg-green-500 hover:bg-green-600 text-white shadow-lg shadow-green-500/20"
                }`}
              >
                <Check size={18} />
                {post.status === "approved" ? "Already Approved" : "Approve Post"}
              </button>
              <button
                onClick={() => onStatusChange(post.id, "rejected")}
                disabled={post.status === "rejected"}
                className={`w-full flex items-center justify-center gap-2 px-4 py-3 rounded-lg font-medium transition-all ${
                  post.status === "rejected"
                    ? "bg-red-100 dark:bg-red-500/20 text-red-700 dark:text-red-300 cursor-not-allowed"
                    : "bg-red-500 hover:bg-red-600 text-white shadow-lg shadow-red-500/20"
                }`}
              >
                <X size={18} />
                {post.status === "rejected" ? "Already Rejected" : "Reject Post"}
              </button>
              {post.status !== "pending" && (
                <button
                  onClick={() => onStatusChange(post.id, "pending")}
                  className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-lg font-medium bg-yellow-500 hover:bg-yellow-600 text-white shadow-lg shadow-yellow-500/20 transition-all"
                >
                  Reset to Pending
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}