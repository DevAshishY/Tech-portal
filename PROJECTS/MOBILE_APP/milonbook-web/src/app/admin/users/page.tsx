"use client";
/* eslint-disable @next/next/no-img-element */
import React, { useState, useEffect } from "react";
import {
  Users,
  UserCheck,
  UserPlus,
  TrendingUp,
  Search,
  MoreVertical,
  Eye,
  Edit,
  Trash2,
  Shield,
  Loader2,
  RefreshCw,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import {
  useDeleteUser,
  useUserStats,
  usePaginatedUsers,
  useRefetchUsers,
  type User,
} from "@/hooks/useUsers";

export default function UserManagementPage() {
  const [actionMenuOpen, setActionMenuOpen] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [isDarkMode, setIsDarkMode] = useState(true);
  const usersPerPage = 10;

  // Check system theme preference
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    
    const handleChange = (e: MediaQueryListEvent) => {
      setIsDarkMode(e.matches);
    };
    
    // Set initial state without causing cascading renders
    if (mediaQuery.matches !== isDarkMode) {
      setIsDarkMode(mediaQuery.matches);
    }
    
    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, [isDarkMode]);

  // TanStack Query hooks
  const { data: stats, isLoading: statsLoading } = useUserStats();
  const {
    data: paginatedData,
    isLoading,
    error,
  } = usePaginatedUsers(currentPage, usersPerPage, searchQuery);
  const deleteUserMutation = useDeleteUser();
  const refetchUsers = useRefetchUsers();

  const handleDeleteUser = async (userId: string) => {
    if (!confirm("Are you sure you want to delete this user?")) return;

    try {
      await deleteUserMutation.mutateAsync(userId);
      setActionMenuOpen(null);
      alert("User deleted successfully");
    } catch (err) {
      alert("Failed to delete user");
      console.error(err);
    }
  };

  const handleRefresh = () => {
    refetchUsers();
  };

  const handlePrevPage = () => {
    setCurrentPage((prev) => Math.max(prev - 1, 1));
  };

  const handleNextPage = () => {
    if (paginatedData?.hasNextPage) {
      setCurrentPage((prev) => prev + 1);
    }
  };

  const statsCards = [
    {
      title: "Total Users",
      value: stats?.totalUsers.toString() || "0",
      change: "+12.5%",
      trend: "up",
      icon: Users,
      color: "from-blue-500 to-cyan-500",
    },
    {
      title: "Active Users",
      value: stats?.activeUsers.toString() || "0",
      change: "+8.2%",
      trend: "up",
      icon: UserCheck,
      color: "from-green-500 to-emerald-500",
    },
    {
      title: "New Signups",
      value: stats?.newSignups.toString() || "0",
      change: "+23.1%",
      trend: "up",
      icon: UserPlus,
      color: "from-violet-500 to-purple-500",
    },
  ];

  const getInitial = (name: string) => {
    return name.charAt(0).toUpperCase();
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const currentUsers = paginatedData?.users || [];
  const totalUsers = paginatedData?.totalUsers || 0;
  const indexOfFirstUser = (currentPage - 1) * usersPerPage;
  const indexOfLastUser = Math.min(indexOfFirstUser + usersPerPage, totalUsers);

  return (
    <div className={`min-h-screen ${isDarkMode ? 'bg-linear-to-br from-slate-950 via-slate-900 to-slate-950' : 'bg-linear-to-br from-gray-50 via-white to-gray-100'} p-3 sm:p-4 md:p-6 lg:p-8`}>
      <div className="max-w-7xl mx-auto space-y-4 sm:space-y-6">
        {/* Header */}
        <div className="mb-6 sm:mb-8">
          <h1 className={`text-2xl sm:text-3xl md:text-4xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'} mb-2`}>
            User Management
          </h1>
          <p className={`${isDarkMode ? 'text-slate-400' : 'text-gray-600'} text-sm sm:text-base`}>
            Monitor and manage your user base
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 lg:gap-6">
          {statsCards.map((card, idx) => (
            <div
              key={idx}
              className={`group relative overflow-hidden rounded-2xl ${isDarkMode ? 'bg-linear-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-xl border border-slate-700/50 hover:border-slate-600/50' : 'bg-white/80 backdrop-blur-xl border border-gray-200/50 hover:border-gray-300/50'} transition-all duration-300 hover:shadow-2xl ${isDarkMode ? 'hover:shadow-slate-900/50' : 'hover:shadow-gray-400/20'}`}
            >
              <div className="p-4 sm:p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <p className={`${isDarkMode ? 'text-slate-400' : 'text-gray-600'} text-xs sm:text-sm font-medium mb-1`}>
                      {card.title}
                    </p>
                    <div className="flex items-baseline gap-2">
                      {statsLoading ? (
                        <Loader2 className={`w-6 h-6 sm:w-8 sm:h-8 animate-spin ${isDarkMode ? 'text-slate-400' : 'text-gray-500'}`} />
                      ) : (
                        <h3 className={`text-2xl sm:text-3xl md:text-4xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                          {card.value}
                        </h3>
                      )}
                    </div>
                  </div>
                  <div
                    className={`p-2 sm:p-3 rounded-xl bg-linear-to-br ${card.color} shadow-lg`}
                  >
                    <card.icon className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1 text-xs sm:text-sm">
                    <TrendingUp className="w-3 h-3 sm:w-4 sm:h-4 text-emerald-400" />
                    <span className="text-emerald-400 font-semibold">
                      {card.change}
                    </span>
                    <span className={isDarkMode ? 'text-slate-500' : 'text-gray-500'}>vs last month</span>
                  </div>
                </div>
              </div>

              {/* Decorative gradient */}
              <div
                className={`absolute -bottom-6 -right-6 w-24 h-24 sm:w-32 sm:h-32 bg-linear-to-br ${card.color} opacity-10 rounded-full blur-2xl group-hover:opacity-20 transition-opacity`}
              ></div>
            </div>
          ))}
        </div>

        {/* User Table Card */}
        <div className={`rounded-2xl ${isDarkMode ? 'bg-linear-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-xl border border-slate-700/50' : 'bg-white/80 backdrop-blur-xl border border-gray-200/50'} overflow-hidden`}>
          {/* Table Header */}
          <div className={`p-4 sm:p-6 ${isDarkMode ? 'border-b border-slate-700/50' : 'border-b border-gray-200/50'}`}>
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <h2 className={`text-lg sm:text-xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'} mb-1`}>
                  All Users
                </h2>
                <p className={`${isDarkMode ? 'text-slate-400' : 'text-gray-600'} text-xs sm:text-sm`}>
                  Manage and monitor user accounts
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
                {/* Search Bar */}
                <div className="relative flex-1 sm:flex-initial">
                  <Search className={`absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 ${isDarkMode ? 'text-slate-400' : 'text-gray-500'}`} />
                  <input
                    type="text"
                    placeholder="Search users..."
                    value={searchQuery}
                    onChange={(e) => {
                      setSearchQuery(e.target.value);
                      setCurrentPage(1);
                    }}
                    className={`w-full sm:w-64 ${isDarkMode ? 'bg-slate-800/50 border border-slate-700/50 text-slate-200 placeholder:text-slate-500 focus:ring-blue-500/50' : 'bg-gray-50/50 border border-gray-300/50 text-gray-900 placeholder:text-gray-500 focus:ring-blue-500/50'} rounded-xl pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:border-transparent transition-all`}
                  />
                </div>

                {/* Refresh Button */}
                <button
                  onClick={handleRefresh}
                  className={`flex items-center justify-center gap-2 px-4 py-2.5 ${isDarkMode ? 'bg-slate-800/50 hover:bg-slate-700/50 border border-slate-700/50 text-slate-200' : 'bg-gray-100/50 hover:bg-gray-200/50 border border-gray-300/50 text-gray-700'} rounded-xl transition-all text-sm font-medium`}
                >
                  <RefreshCw className="w-4 h-4" />
                  <span className="hidden sm:inline">Refresh</span>
                </button>
              </div>
            </div>
          </div>

          {/* Loading State */}
          {isLoading && (
            <div className="flex flex-col items-center justify-center py-16 sm:py-24">
              <Loader2 className="w-10 h-10 sm:w-12 sm:h-12 animate-spin text-blue-500 mb-4" />
              <p className={`${isDarkMode ? 'text-slate-400' : 'text-gray-600'} text-sm sm:text-base`}>Loading users...</p>
            </div>
          )}

          {/* Error State */}
          {error && !isLoading && (
            <div className="flex flex-col items-center justify-center py-16 sm:py-24 px-4">
              <div className={`w-12 h-12 sm:w-16 sm:h-16 rounded-full ${isDarkMode ? 'bg-red-500/10' : 'bg-red-100'} flex items-center justify-center mb-4`}>
                <Shield className="w-6 h-6 sm:w-8 sm:h-8 text-red-400" />
              </div>
              <p className="text-red-400 text-center text-sm sm:text-base mb-4">
                {error instanceof Error ? error.message : "Failed to load users"}
              </p>
              <button
                onClick={handleRefresh}
                className={`px-4 sm:px-6 py-2 sm:py-2.5 ${isDarkMode ? 'bg-red-500/10 hover:bg-red-500/20' : 'bg-red-100 hover:bg-red-200'} text-red-400 rounded-xl transition-colors text-sm font-medium`}
              >
                Retry
              </button>
            </div>
          )}

          {/* Table - Desktop View */}
          {!isLoading && !error && (
            <>
              <div className="hidden lg:block overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className={isDarkMode ? 'border-b border-slate-700/50' : 'border-b border-gray-200/50'}>
                      <th className={`text-left p-4 text-xs font-semibold ${isDarkMode ? 'text-slate-400' : 'text-gray-600'} uppercase tracking-wider`}>
                        User
                      </th>
                      <th className={`text-left p-4 text-xs font-semibold ${isDarkMode ? 'text-slate-400' : 'text-gray-600'} uppercase tracking-wider`}>
                        Email
                      </th>
                      <th className={`text-left p-4 text-xs font-semibold ${isDarkMode ? 'text-slate-400' : 'text-gray-600'} uppercase tracking-wider`}>
                        Phone
                      </th>
                      <th className={`text-left p-4 text-xs font-semibold ${isDarkMode ? 'text-slate-400' : 'text-gray-600'} uppercase tracking-wider`}>
                        Join Date
                      </th>
                      <th className={`text-left p-4 text-xs font-semibold ${isDarkMode ? 'text-slate-400' : 'text-gray-600'} uppercase tracking-wider`}>
                        Stats
                      </th>
                      <th className={`text-right p-4 text-xs font-semibold ${isDarkMode ? 'text-slate-400' : 'text-gray-600'} uppercase tracking-wider`}>
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {currentUsers.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="text-center py-16">
                          <Users className={`w-12 h-12 ${isDarkMode ? 'text-slate-600' : 'text-gray-400'} mx-auto mb-4`} />
                          <p className={isDarkMode ? 'text-slate-400' : 'text-gray-600'}>No users found</p>
                        </td>
                      </tr>
                    ) : (
                      currentUsers.map((user: User) => (
                        <tr
                          key={user._id}
                          className={`group ${isDarkMode ? 'border-b border-slate-700/30 hover:bg-slate-800/30' : 'border-b border-gray-100/30 hover:bg-gray-50/50'} transition-colors`}
                        >
                          <td className="p-4">
                            <div className="flex items-center gap-3">
                              {user.profilePicture ? (
                                <img
                                  src={user.profilePicture}
                                  alt={user.name}
                                  className="w-10 h-10 rounded-full object-cover ring-2 ring-slate-700"
                                />
                              ) : (
                                <div className="w-10 h-10 rounded-full bg-linear-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white font-semibold ring-2 ring-slate-700">
                                  {getInitial(user.name)}
                                </div>
                              )}
                              <span className={`font-medium ${isDarkMode ? 'text-slate-200' : 'text-gray-900'}`}>
                                {user.name}
                              </span>
                            </div>
                          </td>
                          <td className={`p-4 ${isDarkMode ? 'text-slate-300' : 'text-gray-700'} text-sm`}>
                            {user.email || "N/A"}
                          </td>
                          <td className={`p-4 ${isDarkMode ? 'text-slate-300' : 'text-gray-700'} text-sm`}>
                            {user.phone || "N/A"}
                          </td>
                          <td className={`p-4 ${isDarkMode ? 'text-slate-300' : 'text-gray-700'} text-sm`}>
                            {formatDate(user.createdAt)}
                          </td>
                          <td className="p-4">
                            <div className="flex gap-3">
                              <span className="px-2.5 py-1 bg-blue-500/10 text-blue-400 rounded-lg text-xs font-medium">
                                M: {user.momentsCount || 0}
                              </span>
                              <span className="px-2.5 py-1 bg-emerald-500/10 text-emerald-400 rounded-lg text-xs font-medium">
                                C: {user.connectionsCount || 0}
                              </span>
                            </div>
                          </td>
                          <td className="p-4">
                            <div className="flex items-center justify-end gap-2">
                              <button
                                onClick={() => handleDeleteUser(user._id)}
                                disabled={deleteUserMutation.isPending}
                                className={`p-2 rounded-lg hover:bg-red-500/10 ${isDarkMode ? 'text-slate-400 hover:text-red-400' : 'text-gray-600 hover:text-red-500'} transition-all disabled:opacity-50`}
                                title="Delete User"
                              >
                                {deleteUserMutation.isPending &&
                                deleteUserMutation.variables === user._id ? (
                                  <Loader2 className="w-4 h-4 animate-spin" />
                                ) : (
                                  <Trash2 className="w-4 h-4" />
                                )}
                              </button>
                              <div className="relative">
                                <button
                                  onClick={() =>
                                    setActionMenuOpen(
                                      actionMenuOpen === user._id ? null : user._id
                                    )
                                  }
                                  className={`p-2 rounded-lg ${isDarkMode ? 'hover:bg-slate-700/50 text-slate-400 hover:text-slate-200' : 'hover:bg-gray-100/50 text-gray-600 hover:text-gray-900'} transition-all opacity-0 group-hover:opacity-100`}
                                >
                                  <MoreVertical className="w-4 h-4" />
                                </button>
                                {actionMenuOpen === user._id && (
                                  <div className={`absolute right-0 top-full mt-2 w-48 ${isDarkMode ? 'bg-slate-800 border border-slate-700' : 'bg-white border border-gray-200'} rounded-xl shadow-2xl py-2 z-10`}>
                                    <button className={`w-full px-4 py-2 text-left text-sm ${isDarkMode ? 'text-slate-300 hover:bg-slate-700/50' : 'text-gray-700 hover:bg-gray-100/50'} flex items-center gap-2 transition-colors`}>
                                      <Eye className="w-4 h-4" />
                                      View Details
                                    </button>
                                    <button className={`w-full px-4 py-2 text-left text-sm ${isDarkMode ? 'text-slate-300 hover:bg-slate-700/50' : 'text-gray-700 hover:bg-gray-100/50'} flex items-center gap-2 transition-colors`}>
                                      <Edit className="w-4 h-4" />
                                      Send Message
                                    </button>
                                    <button className="w-full px-4 py-2 text-left text-sm text-red-400 hover:bg-red-500/10 flex items-center gap-2 transition-colors">
                                      <Shield className="w-4 h-4" />
                                      Ban User
                                    </button>
                                  </div>
                                )}
                              </div>
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>

              {/* Mobile/Tablet Card View */}
              <div className={`lg:hidden ${isDarkMode ? 'divide-y divide-slate-700/30' : 'divide-y divide-gray-200/30'}`}>
                {currentUsers.length === 0 ? (
                  <div className="text-center py-16 px-4">
                    <Users className={`w-12 h-12 ${isDarkMode ? 'text-slate-600' : 'text-gray-400'} mx-auto mb-4`} />
                    <p className={isDarkMode ? 'text-slate-400' : 'text-gray-600'}>No users found</p>
                  </div>
                ) : (
                  currentUsers.map((user: User) => (
                    <div
                      key={user._id}
                      className={`p-4 ${isDarkMode ? 'hover:bg-slate-800/30' : 'hover:bg-gray-50/50'} transition-colors`}
                    >
                      <div className="flex items-start gap-3 mb-3">
                        {user.profilePicture ? (
                          <img
                            src={user.profilePicture}
                            alt={user.name}
                            className="w-12 h-12 rounded-full object-cover ring-2 ring-slate-700"
                          />
                        ) : (
                          <div className="w-12 h-12 rounded-full bg-linear-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white font-semibold ring-2 ring-slate-700 shrink-0">
                            {getInitial(user.name)}
                          </div>
                        )}
                        <div className="flex-1 min-w-0">
                          <h3 className={`font-semibold ${isDarkMode ? 'text-slate-200' : 'text-gray-900'} mb-1 truncate`}>
                            {user.name}
                          </h3>
                          <p className={`text-xs ${isDarkMode ? 'text-slate-400' : 'text-gray-600'} truncate`}>
                            {user.email || "N/A"}
                          </p>
                        </div>
                        <div className="relative shrink-0">
                          <button
                            onClick={() =>
                              setActionMenuOpen(
                                actionMenuOpen === user._id ? null : user._id
                              )
                            }
                            className={`p-2 rounded-lg ${isDarkMode ? 'hover:bg-slate-700/50 text-slate-400' : 'hover:bg-gray-100/50 text-gray-600'}`}
                          >
                            <MoreVertical className="w-5 h-5" />
                          </button>
                          {actionMenuOpen === user._id && (
                            <div className={`absolute right-0 top-full mt-2 w-48 ${isDarkMode ? 'bg-slate-800 border border-slate-700' : 'bg-white border border-gray-200'} rounded-xl shadow-2xl py-2 z-10`}>
                              <button className={`w-full px-4 py-2 text-left text-sm ${isDarkMode ? 'text-slate-300 hover:bg-slate-700/50' : 'text-gray-700 hover:bg-gray-100/50'} flex items-center gap-2`}>
                                <Eye className="w-4 h-4" />
                                View Details
                              </button>
                              <button className={`w-full px-4 py-2 text-left text-sm ${isDarkMode ? 'text-slate-300 hover:bg-slate-700/50' : 'text-gray-700 hover:bg-gray-100/50'} flex items-center gap-2`}>
                                <Edit className="w-4 h-4" />
                                Send Message
                              </button>
                              <button className="w-full px-4 py-2 text-left text-sm text-red-400 hover:bg-red-500/10 flex items-center gap-2">
                                <Shield className="w-4 h-4" />
                                Ban User
                              </button>
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-2 mb-3">
                        <div>
                          <p className={`text-xs ${isDarkMode ? 'text-slate-500' : 'text-gray-500'} mb-1`}>Phone</p>
                          <p className={`text-sm ${isDarkMode ? 'text-slate-300' : 'text-gray-700'}`}>{user.phone || "N/A"}</p>
                        </div>
                        <div>
                          <p className={`text-xs ${isDarkMode ? 'text-slate-500' : 'text-gray-500'} mb-1`}>Joined</p>
                          <p className={`text-sm ${isDarkMode ? 'text-slate-300' : 'text-gray-700'}`}>
                            {formatDate(user.createdAt)}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex gap-2">
                          <span className="px-2.5 py-1 bg-blue-500/10 text-blue-400 rounded-lg text-xs font-medium">
                            M: {user.momentsCount || 0}
                          </span>
                          <span className="px-2.5 py-1 bg-emerald-500/10 text-emerald-400 rounded-lg text-xs font-medium">
                            C: {user.connectionsCount || 0}
                          </span>
                        </div>
                        <button
                          onClick={() => handleDeleteUser(user._id)}
                          disabled={deleteUserMutation.isPending}
                          className={`p-2 rounded-lg hover:bg-red-500/10 ${isDarkMode ? 'text-slate-400 hover:text-red-400' : 'text-gray-600 hover:text-red-500'} transition-all disabled:opacity-50`}
                          title="Delete User"
                        >
                          {deleteUserMutation.isPending &&
                          deleteUserMutation.variables === user._id ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                          ) : (
                            <Trash2 className="w-4 h-4" />
                          )}
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>

              {/* Pagination */}
              <div className={`p-4 sm:p-6 ${isDarkMode ? 'border-t border-slate-700/50' : 'border-t border-gray-200/50'}`}>
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                  <p className={`text-xs sm:text-sm ${isDarkMode ? 'text-slate-400' : 'text-gray-600'} text-center sm:text-left`}>
                    Showing {indexOfFirstUser + 1} to{" "}
                    {Math.min(indexOfLastUser, totalUsers)} of {totalUsers} users
                  </p>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={handlePrevPage}
                      disabled={currentPage === 1}
                      className={`px-3 sm:px-4 py-2 ${isDarkMode ? 'bg-slate-800/50 hover:bg-slate-700/50 text-slate-200' : 'bg-gray-100/50 hover:bg-gray-200/50 text-gray-700'} disabled:opacity-50 disabled:cursor-not-allowed border ${isDarkMode ? 'border-slate-700/50' : 'border-gray-300/50'} rounded-xl transition-all text-sm font-medium flex items-center gap-2`}
                    >
                      <ChevronLeft className="w-4 h-4" />
                      <span className="hidden sm:inline">Previous</span>
                    </button>
                    <div className="px-3 sm:px-4 py-2 bg-blue-500/10 border border-blue-500/50 rounded-xl text-sm font-medium text-blue-400">
                      {currentPage}
                    </div>
                    <button
                      onClick={handleNextPage}
                      disabled={!paginatedData?.hasNextPage}
                      className={`px-3 sm:px-4 py-2 ${isDarkMode ? 'bg-slate-800/50 hover:bg-slate-700/50 text-slate-200' : 'bg-gray-100/50 hover:bg-gray-200/50 text-gray-700'} disabled:opacity-50 disabled:cursor-not-allowed border ${isDarkMode ? 'border-slate-700/50' : 'border-gray-300/50'} rounded-xl transition-all text-sm font-medium flex items-center gap-2`}
                    >
                      <span className="hidden sm:inline">Next</span>
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
 