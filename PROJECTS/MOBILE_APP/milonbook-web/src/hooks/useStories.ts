"use client";

import { useQuery, useMutation, useQueryClient, useInfiniteQuery } from "@tanstack/react-query";
import axios from "axios";

interface StoryUser {
  _id: string;
  name: string;
  profilePicture?: string;
}

export interface Story {
  _id: string;
  userId: StoryUser;
  mediaUrl: string;
  mediaType: "image" | "video";
  caption?: string;
  privacy: string;
  createdAt: string;
  expiresAt: string;
  viewCount: number;
  viewers: string[];
}

interface StoriesResponse {
  success: boolean;
  stories: Story[];
  nextCursor: string | null;
}

interface DeleteStoryResponse {
  success: boolean;
  message: string;
}

const fetchStories = async (params?: { limit?: number; cursor?: string; userId?: string }) => {
  const token = localStorage.getItem("admin-token");

  const queryParams = new URLSearchParams();
  if (params?.limit) queryParams.append("limit", String(params.limit));
  if (params?.cursor) queryParams.append("cursor", params.cursor);
  if (params?.userId) queryParams.append("userId", params.userId);

  try {
    const response = await axios.get<StoriesResponse>(`/api/story?${queryParams.toString()}`, {
      headers: { Authorization: token ? `Bearer ${token}` : "" },
      withCredentials: true,
    });
    return response.data;
  } catch (error: unknown) {
    const axiosError = error as { response?: { data?: { message?: string } } };
    const message = axiosError.response?.data?.message || "Failed to fetch stories";
    throw new Error(message);
  }
};

const deleteStory = async (storyId: string) => {
  const token = localStorage.getItem("admin-token");

  try {
    const response = await axios.delete<DeleteStoryResponse>(`/api/story/${storyId}`, {
      headers: { Authorization: token ? `Bearer ${token}` : "" },
    });
    return response.data;
  } catch (error: unknown) {
    const axiosError = error as { response?: { data?: { message?: string } } };
    const message = axiosError.response?.data?.message || "Failed to delete story";
    throw new Error(message);
  }
};

export const useStories = (params?: { limit?: number; cursor?: string; userId?: string }) => {
  return useQuery({ queryKey: ["stories", params], queryFn: () => fetchStories(params), staleTime: 30000, refetchOnWindowFocus: false });
};

export const useInfiniteStories = (params?: { limit?: number; userId?: string }) => {
  return useInfiniteQuery({
    queryKey: ["stories-infinite", params],
    queryFn: ({ pageParam }) => fetchStories({ ...params, cursor: pageParam as string | undefined }),
    initialPageParam: undefined as string | undefined,
    getNextPageParam: (lastPage) => lastPage.nextCursor ?? undefined,
    staleTime: 30000,
    refetchOnWindowFocus: false,
  });
};

export const useDeleteStory = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteStory,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["stories"] });
      queryClient.invalidateQueries({ queryKey: ["stories-infinite"] });
    },
  });
};
