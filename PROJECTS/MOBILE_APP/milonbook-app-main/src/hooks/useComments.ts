
import { useMutation, useQueryClient, useInfiniteQuery } from '@tanstack/react-query';
import { apiClient } from '../api/apiClient';
import Toast from 'react-native-toast-message';
import { useState, useEffect, useRef } from 'react';

type CommentType = 'post' | 'reel' | 'comment';

interface User {
  _id: string;
  name: string;
  profilePicture?: string;
}

interface Comment {
  _id: string;
  text: string;
  createdAt: string;
  user: User;
}

interface CommentsResponse {
  success: boolean;
  comments: Comment[];
  nextCursor: string | null;
}

interface UseCommentProps {
  id: string;
  type: CommentType;
  initialCommentsCount?: number;
  limit?: number;
  enableFetch?: boolean;
}

interface CommentData {
  postId?: string;
  reelId?: string;
  parentCommentId?: string;
  text: string;
}

interface UseCommentReturn {
  commentsCount: number;
  isLoading: boolean;
  addComment: (text: string) => void;
  // Fetch related returns
  comments: Comment[];
  isFetchingComments: boolean;
  isErrorFetchingComments: boolean;
  fetchError: Error | null;
  isFetchingNextPage: boolean;
  hasNextPage: boolean;
  fetchNextPage: () => void;
  refetchComments: () => void;
}

export const useComment = ({
  id,
  type,
  initialCommentsCount = 0,
  limit = 10,
  enableFetch = false,
}: UseCommentProps): UseCommentReturn => {
  const queryClient = useQueryClient();
  
  // ✅ Use refs to track if we've initialized
  const isInitializedRef = useRef(false);
  const prevIdRef = useRef(id);
  
  // ✅ Internal state that persists across re-renders
  const [commentsCount, setCommentsCount] = useState(initialCommentsCount);

  // ✅ Only sync when id changes (different post/reel) or on first mount
  useEffect(() => {
    // If ID changed, reset state to new item's values
    if (prevIdRef.current !== id) {
      console.log(`🔄 ID changed from ${prevIdRef.current} to ${id}, resetting state`);
      setCommentsCount(initialCommentsCount);
      prevIdRef.current = id;
      isInitializedRef.current = true;
      return;
    }

    // On first mount only, set initial values
    if (!isInitializedRef.current) {
      console.log(`🎯 First mount for ${id}: commentsCount=${initialCommentsCount}`);
      setCommentsCount(initialCommentsCount);
      isInitializedRef.current = true;
    }
    // After initialization, ignore prop changes (we manage state ourselves)
  }, [id]); // Only depend on id, not on initialCommentsCount

  // ✅ FETCH COMMENTS WITH INFINITE QUERY
  const {
    data: commentsData,
    isLoading: isFetchingComments,
    isError: isErrorFetchingComments,
    error: fetchError,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    refetch: refetchComments,
  } = useInfiniteQuery<CommentsResponse, Error>({
    queryKey: ['comments', id, { type }],
    queryFn: async ({ pageParam }) => {
      // Build query params based on type
      const params = new URLSearchParams();
      
      if (type === 'post') {
        params.append('postId', id);
      } else if (type === 'reel') {
        params.append('reelId', id);
      }
      
      params.append('limit', limit.toString());
      if (pageParam) params.append('cursor', pageParam as string);

      const response = await apiClient(`/api/comment?${params.toString()}`, {
        method: 'GET',
      });

      return response as CommentsResponse;
    },
    getNextPageParam: (lastPage) => {
      return lastPage.nextCursor ?? undefined;
    },
    initialPageParam: undefined,
    enabled: enableFetch && (type === 'post' || type === 'reel'),
    staleTime: 30000, // Consider data fresh for 30 seconds
    gcTime: 5 * 60 * 1000, // Keep unused data in cache for 5 minutes
  });

  // Flatten all pages into a single array of comments
  const comments = commentsData?.pages.flatMap((page) => page.comments) ?? [];

  // ✅ ADD COMMENT MUTATION
  const mutation = useMutation({
    mutationFn: async (commentData: CommentData) => {
      const response = await apiClient('/api/comment', {
        method: 'POST',
        body: JSON.stringify(commentData),
      });
      return response;
    },
    onMutate: async () => {
      console.log(`🎬 Optimistic update: adding comment to ${type} ${id}`);
      
      // Store previous state for rollback
      const previousCount = commentsCount;
      
      // Optimistically update UI
      const newCount = previousCount + 1;
      setCommentsCount(newCount);
      
      // Return context for rollback
      return { previousCount };
    },
    onSuccess: (data, variables, context) => {
      console.log(`✅ Comment added successfully for ${type} ${id}`, data);
      
      // Update the state with server response if available
      if (data?.comment) {
        Toast.show({
          type: 'success',
          text1: 'Comment posted',
          text2: 'Your comment has been added',
          position: 'bottom',
          visibilityTime: 2000,
        });
      }
      
      // Invalidate queries to refresh data
      if (type === 'post') {
        queryClient.invalidateQueries({ queryKey: ['posts'] });
        queryClient.invalidateQueries({ queryKey: ['comments', id] });
      } else if (type === 'reel') {
        queryClient.invalidateQueries({ queryKey: ['reels'] });
        queryClient.invalidateQueries({ queryKey: ['comments', id] });
      } else if (type === 'comment') {
        queryClient.invalidateQueries({ queryKey: ['comments'] });
      }
    },
    onError: (error: Error, variables, context: any) => {
      console.log(`❌ Comment action failed for ${type} ${id}:`, error.message);
      
      // Rollback to previous state
      if (context) {
        setCommentsCount(context.previousCount);
      }

      Toast.show({
        type: 'error',
        text1: 'Failed to post comment',
        text2: error.message,
        position: 'bottom',
        visibilityTime: 2000,
      });
    },
  });

  const addComment = (text: string) => {
    if (mutation.isPending) {
      console.log('⏳ Already posting comment, ignoring...');
      return;
    }

    if (!text || text.trim().length === 0) {
      Toast.show({
        type: 'error',
        text1: 'Empty comment',
        text2: 'Please enter some text',
        position: 'bottom',
        visibilityTime: 2000,
      });
      return;
    }

    const commentData: CommentData = {
      text: text.trim(),
    };
    
    if (type === 'post') {
      commentData.postId = id;
    } else if (type === 'reel') {
      commentData.reelId = id;
    } else if (type === 'comment') {
      commentData.parentCommentId = id;
    }

    mutation.mutate(commentData);
  };

  return {
    // Add comment returns
    commentsCount,
    isLoading: mutation.isPending,
    addComment,
    // Fetch comments returns
    comments,
    isFetchingComments,
    isErrorFetchingComments,
    fetchError: fetchError as Error | null,
    isFetchingNextPage,
    hasNextPage: !!hasNextPage,
    fetchNextPage,
    refetchComments,
  };
};