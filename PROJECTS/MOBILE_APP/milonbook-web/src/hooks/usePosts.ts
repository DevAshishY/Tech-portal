"use client";

import { useQuery, useMutation, useQueryClient, useInfiniteQuery } from "@tanstack/react-query";
import axios from "axios";

type PostStatus = "pending" | "approved" | "rejected";

interface Post {
  _id: string;
  username: string;
  userId: { _id: string; name: string; profilePicture?: string };
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
interface CommentUser {
  _id: string;
  name: string;
  profilePicture?: string;
}

export interface PostComment {
  _id: string;
  text: string;
  createdAt: string;
  isLiked: boolean;
  likesCount: number;
  user: CommentUser;
}

interface PostsResponse { success: boolean; posts: Post[]; nextCursor: string | null }
interface DeletePostResponse { success: boolean; message: string }
interface CommentsResponse { success: boolean; comments: PostComment[]; nextCursor: string | null }

// ------------------
// Fetch posts
// ------------------
const fetchPosts = async (params?: { limit?: number; cursor?: string; category?: string; userId?: string }) => {
  const token = localStorage.getItem("admin-token"); // <-- auto-read token
  const queryParams = new URLSearchParams();
  if (params?.limit) queryParams.append("limit", String(params.limit));
  if (params?.cursor) queryParams.append("cursor", params.cursor);
  if (params?.category && params.category !== "All") queryParams.append("category", params.category);
  if (params?.userId) queryParams.append("userId", params.userId);

  try {
    const response = await axios.get<PostsResponse>(`/api/posts?${queryParams.toString()}`, {
      headers: { Authorization: token ? `Bearer ${token}` : "" },
      withCredentials: true,
    });
    return response.data;
  } catch (error: unknown) {
    const axiosError = error as { response?: { data?: { message?: string } } };
    const message = axiosError.response?.data?.message || "Failed to fetch posts";
    throw new Error(message);
  }
};

const fetchPostComments = async (params: { postId: string; limit?: number; cursor?: string }) => {
  const token = localStorage.getItem("admin-token");

  const queryParams = new URLSearchParams();
  queryParams.append("postId", params.postId);
  queryParams.append("limit", String(params.limit ?? 10));
  if (params.cursor) queryParams.append("cursor", params.cursor);

  try {
    const response = await axios.get<CommentsResponse>(`/api/comment?${queryParams.toString()}`, {
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

// ------------------
// Delete post
// ------------------
const deletePost = async (postId: string) => {
  const token = localStorage.getItem("admin-token"); // auto-read token
  try {
    const response = await axios.delete<DeletePostResponse>(`/api/posts/${postId}`, {
      headers: { Authorization: token ? `Bearer ${token}` : "" },
    });
    return response.data;
  } catch (error: unknown) {
    const axiosError = error as { response?: { data?: { message?: string } } };
    const message = axiosError.response?.data?.message || "Failed to delete post";
    throw new Error(message);
  }
};

// ------------------
// Hooks
// ------------------
export const usePosts = (params?: { limit?: number; cursor?: string; category?: string; userId?: string }) => {
  return useQuery({ queryKey: ["posts", params], queryFn: () => fetchPosts(params), staleTime: 30000, refetchOnWindowFocus: false });
};

export const useInfinitePosts = (params?: { limit?: number; category?: string; userId?: string }) => {
  return useInfiniteQuery({
    queryKey: ["posts-infinite", params],
    queryFn: ({ pageParam }) => fetchPosts({ ...params, cursor: pageParam as string | undefined }),
    initialPageParam: undefined as string | undefined,
    getNextPageParam: (lastPage) => lastPage.nextCursor ?? undefined,
    staleTime: 30000,
    refetchOnWindowFocus: false,
  });
};

export const useDeletePost = () => {
  const queryClient = useQueryClient();
  return useMutation({ mutationFn: deletePost, onSuccess: () => queryClient.invalidateQueries({ queryKey: ["posts"] }) });
};

export const usePostComments = (params: { postId: string; limit?: number; enableFetch?: boolean }) => {
  const { postId, limit, enableFetch } = params;

  return useInfiniteQuery<CommentsResponse, Error>({
    queryKey: ["comments", postId, { type: "post" }],
    queryFn: ({ pageParam }) =>
      fetchPostComments({
        postId,
        limit,
        cursor: pageParam as string | undefined,
      }),
    initialPageParam: undefined as string | undefined,
    getNextPageParam: (lastPage) => lastPage.nextCursor ?? undefined,
    enabled: (enableFetch ?? true) && !!postId,
    staleTime: 30000,
    refetchOnWindowFocus: false,
  });
};
