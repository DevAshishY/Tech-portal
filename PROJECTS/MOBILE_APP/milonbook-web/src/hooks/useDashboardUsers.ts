"use client";

import { useInfiniteQuery } from "@tanstack/react-query";
import axios from "axios";

export interface DashboardUser {
  _id: string;
  name: string;
  email?: string;
  phone?: string;
  createdAt: string;
  profilePicture?: string;
  momentsCount?: number;
  connectionsCount?: number;
  connectingCount?: number;
}

interface DashboardUsersResponse {
  success: boolean;
  users: DashboardUser[];
  nextCursor: string | null;
}

const fetchDashboardUsers = async (params?: { limit?: number; cursor?: string }) => {
  const token = typeof window !== "undefined" ? localStorage.getItem("admin-token") : null;

  const queryParams = new URLSearchParams();
  if (params?.limit) queryParams.append("limit", String(params.limit));
  if (params?.cursor) queryParams.append("cursor", params.cursor);

  try {
    const response = await axios.get<DashboardUsersResponse>(`/api/users?${queryParams.toString()}` , {
      headers: { Authorization: token ? `Bearer ${token}` : "" },
      withCredentials: true,
    });
    return response.data;
  } catch (error: unknown) {
    const axiosError = error as { response?: { data?: { message?: string } } };
    const message = axiosError.response?.data?.message || "Failed to fetch users";
    throw new Error(message);
  }
};

export const useInfiniteDashboardUsers = (params?: { limit?: number }) => {
  return useInfiniteQuery({
    queryKey: ["dashboard-users", params],
    queryFn: ({ pageParam }) =>
      fetchDashboardUsers({
        limit: params?.limit,
        cursor: pageParam as string | undefined,
      }),
    initialPageParam: undefined as string | undefined,
    getNextPageParam: (lastPage) => lastPage.nextCursor ?? undefined,
    staleTime: 30000,
    refetchOnWindowFocus: false,
  });
};
