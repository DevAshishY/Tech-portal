"use client";

import React from "react";

export default function ChartCard({
  title,
  children,
  loading,
}: {
  title: string;
  children: React.ReactNode;
  loading?: boolean;
}) {
  return (
    <div className="bg-linear-to-b from-slate-900/60 to-slate-900/50 border border-slate-800 rounded-xl p-4 hover:shadow-lg transition-all">
      <div className="mb-3 flex items-center justify-between">
        <div className="text-sm font-semibold text-white">{title}</div>
        <div className="text-xs text-slate-400">Last 30 days</div>
      </div>
      <div className="h-56 sm:h-64">
        {loading ? (
          <div className="w-full h-full rounded bg-slate-800 animate-pulse" />
        ) : (
          children
        )}
      </div>
    </div>
  );
}
