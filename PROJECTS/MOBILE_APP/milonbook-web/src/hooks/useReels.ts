"use client";

import { useQuery, useMutation, useQueryClient, useInfiniteQuery } from "@tanstack/react-query";
import axios from "axios";

interface ReelUser {
  _id: string;
  name: string;
  profilePicture?: string;
}

export interface Reel {
  _id: string;
  userId: ReelUser;
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
  isLiked?: boolean;
}

interface CommentUser {
  _id: string;
  name: string;
  profilePicture?: string;
}

export interface ReelComment {
  _id: string;
  text: string;
  createdAt: string;
  isLiked: boolean;
  likesCount: number;
  user: CommentUser;
}

interface ReelsResponse {
  success: boolean;
  reels: Reel[];
  nextCursor: string | null;
}

interface DeleteReelResponse {
  success: boolean;
  message: string;
}

interface CommentsResponse {
  success: boolean;
  comments: ReelComment[];
  nextCursor: string | null;
}

const fetchReels = async (params?: { limit?: number; cursor?: string; category?: string; userId?: string }) => {
  const token = localStorage.getItem("admin-token");

  const queryParams = new URLSearchParams();
  if (params?.limit) queryParams.append("limit", String(params.limit));
  if (params?.cursor) queryParams.append("cursor", params.cursor);
  if (params?.category && params.category !== "All") queryParams.append("category", params.category);
  if (params?.userId) queryParams.append("userId", params.userId);

  try {
    const response = await axios.get<ReelsResponse>(`/api/reels?${queryParams.toString()}` , {
      headers: { Authorization: token ? `Bearer ${token}` : "" },
      withCredentials: true,
    });
    return response.data;
  } catch (error: unknown) {
    const axiosError = error as { response?: { data?: { message?: string } } };
    const message = axiosError.response?.data?.message || "Failed to fetch reels";
    throw new Error(message);
  }
};

const fetchReelComments = async (params: { reelId: string; limit?: number; cursor?: string }) => {
  const token = localStorage.getItem("admin-token");

  const queryParams = new URLSearchParams();
  queryParams.append("reelId", params.reelId);
  queryParams.append("limit", String(params.limit ?? 10));
  if (params.cursor) queryParams.append("cursor", params.cursor);

  try {
    const response = await axios.get<CommentsResponse>(`/api/comment?${queryParams.toString()}` , {
      headers: { Authorization: token ? `Bearer ${token}` : "" },
      withCredentials: true,
    });
    return response.data;
  } catch (error: unknown) {
    const axiosError = error as { response?: { data?: { message?: string } } };
    const message = axiosError.response?.data?.message || "Failed to fetch comments";
    throw new Error(message);
  }
};

const deleteReel = async (reelId: string) => {
  const token = localStorage.getItem("admin-token");

  try {
    const response = await axios.delete<DeleteReelResponse>(`/api/reels/${reelId}` , {
      headers: { Authorization: token ? `Bearer ${token}` : "" },
    });
    return response.data;
  } catch (error: unknown) {
    const axiosError = error as { response?: { data?: { message?: string } } };
    const message = axiosError.response?.data?.message || "Failed to delete reel";
    throw new Error(message);
  }
};

export const useReels = (params?: { limit?: number; cursor?: string; category?: string; userId?: string }) => {
  return useQuery({ queryKey: ["reels", params], queryFn: () => fetchReels(params), staleTime: 30000, refetchOnWindowFocus: false });
};

export const useInfiniteReels = (params?: { limit?: number; category?: string; userId?: string }) => {
  return useInfiniteQuery({
    queryKey: ["reels-infinite", params],
    queryFn: ({ pageParam }) => fetchReels({ ...params, cursor: pageParam as string | undefined }),
    initialPageParam: undefined as string | undefined,
    getNextPageParam: (lastPage) => lastPage.nextCursor ?? undefined,
    staleTime: 30000,
    refetchOnWindowFocus: false,
  });
};

export const useDeleteReel = () => {
  const queryClient = useQueryClient();
  return useMutation({ mutationFn: deleteReel, onSuccess: () => queryClient.invalidateQueries({ queryKey: ["reels"] }) });
};

export const useReelComments = (params: { reelId: string; limit?: number; enableFetch?: boolean }) => {
  const { reelId, limit, enableFetch } = params;

  return useInfiniteQuery<CommentsResponse, Error>({
    // Match mobile hook style: ['comments', id, { type: 'reel' }]
    queryKey: ["comments", reelId, { type: "reel" }],
    queryFn: ({ pageParam }) =>
      fetchReelComments({
        reelId,
        limit,
        cursor: pageParam as string | undefined,
      }),
    initialPageParam: undefined as string | undefined,
    getNextPageParam: (lastPage) => lastPage.nextCursor ?? undefined,
    enabled: (enableFetch ?? true) && !!reelId,
    staleTime: 30000,
    refetchOnWindowFocus: false,
  });
};
