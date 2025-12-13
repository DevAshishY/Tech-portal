import { useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '../api/apiClient';
import Toast from 'react-native-toast-message';
import { useState, useEffect, useRef } from 'react';

type LikeType = 'post' | 'reel' | 'comment';

interface UseLikeProps {
  id: string;
  type: LikeType;
  initialLiked?: boolean;
  initialLikesCount?: number;
}

interface LikeData {
  postId?: string;
  reelId?: string;
  commentId?: string;
}

interface UseLikeReturn {
  isLiked: boolean;
  likesCount: number;
  isLoading: boolean;
  toggleLike: () => void;
}

export const useLike = ({
  id,
  type,
  initialLiked = false,
  initialLikesCount = 0,
}: UseLikeProps): UseLikeReturn => {
  const queryClient = useQueryClient();
  
  // ✅ Use refs to track if we've initialized
  const isInitializedRef = useRef(false);
  const prevIdRef = useRef(id);
  
  // ✅ Internal state that persists across re-renders
  const [isLiked, setIsLiked] = useState(initialLiked);
  const [likesCount, setLikesCount] = useState(initialLikesCount);

  // ✅ Only sync when id changes (different post/reel) or on first mount
  useEffect(() => {
    // If ID changed, reset state to new item's values
    if (prevIdRef.current !== id) {
      console.log(`🔄 ID changed from ${prevIdRef.current} to ${id}, resetting state`);
      setIsLiked(initialLiked);
      setLikesCount(initialLikesCount);
      prevIdRef.current = id;
      isInitializedRef.current = true;
      return;
    }

    // On first mount only, set initial values
    if (!isInitializedRef.current) {
      console.log(`🎯 First mount for ${id}: isLiked=${initialLiked}, count=${initialLikesCount}`);
      setIsLiked(initialLiked);
      setLikesCount(initialLikesCount);
      isInitializedRef.current = true;
    }
    // After initialization, ignore prop changes (we manage state ourselves)
  }, [id]); // Only depend on id, not on initialLiked/initialLikesCount

  const mutation = useMutation({
    mutationFn: async (likeData: LikeData) => {
      const response = await apiClient('/api/likes', {
        method: 'POST',
        body: JSON.stringify(likeData),
      });
      return response;
    },
    onMutate: async () => {
      console.log(`🎬 Optimistic update: ${isLiked ? 'unliking' : 'liking'} ${type} ${id}`);
      
      // Store previous state for rollback
      const previousLiked = isLiked;
      const previousCount = likesCount;
      
      // Optimistically update UI
      const newLikedState = !previousLiked;
      const newCount = newLikedState ? previousCount + 1 : previousCount - 1;
      
      setIsLiked(newLikedState);
      setLikesCount(newCount);
      
      // Return context for rollback
      return { previousLiked, previousCount };
    },
    onSuccess: (data, variables, context) => {
      console.log(`✅ Like action successful for ${type} ${id}`, data);
      
      // Update the state with server response if available
      if (data?.isLiked !== undefined) {
        setIsLiked(data.isLiked);
      }
      if (data?.likesCount !== undefined) {
        setLikesCount(data.likesCount);
      }
      
      // Invalidate queries to refresh data
      if (type === 'post') {
        queryClient.invalidateQueries({ queryKey: ['posts'] });
      } else if (type === 'reel') {
        queryClient.invalidateQueries({ queryKey: ['reels'] });
      } else if (type === 'comment') {
        queryClient.invalidateQueries({ queryKey: ['comments'] });
      }
    },
    onError: (error: Error, variables, context: any) => {
      console.log(`❌ Like action failed for ${type} ${id}:`, error.message);
      
      // Rollback to previous state
      if (context) {
        setIsLiked(context.previousLiked);
        setLikesCount(context.previousCount);
      }

      Toast.show({
        type: 'error',
        text1: 'Failed to update like',
        text2: error.message,
        position: 'bottom',
        visibilityTime: 2000,
      });
    },
  });

  const toggleLike = () => {
    if (mutation.isPending) {
      console.log('⏳ Already processing like action, ignoring...');
      return;
    }

    const likeData: LikeData = {};
    
    if (type === 'post') {
      likeData.postId = id;
    } else if (type === 'reel') {
      likeData.reelId = id;
    } else if (type === 'comment') {
      likeData.commentId = id;
    }

    mutation.mutate(likeData);
  };

  return {
    isLiked,
    likesCount,
    isLoading: mutation.isPending,
    toggleLike,
  };
};