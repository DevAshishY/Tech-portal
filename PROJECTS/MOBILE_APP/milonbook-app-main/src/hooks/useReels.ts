// File: src/hooks/useReels.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient, API_BASE_URL } from '../api/apiClient';
import Toast from 'react-native-toast-message';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useVideoCompression } from './useVideoCompression';
import { useInfiniteQuery } from '@tanstack/react-query';
interface CreateReelData {
  caption?: string;
  mediaUrl: string;
  mediaType: 'image' | 'video';
  category?: string;
  hashtags?: string[];
  taggedUsers?: string[];
  location?: {
    name: string;
    coordinates?: [number, number];
  };
}

// ✅ Upload Reel Media with Client-Side Compression
export const useUploadReelMedia = () => {
  const { compressVideo, isCompressing, compressionProgress } = useVideoCompression();

  return useMutation({
    mutationFn: async (file: { uri: string; name: string; type: string }) => {
      let uploadUri = file.uri;
      let wasCompressed = false;

      // 🎥 Compress video on device BEFORE uploading (HIGH QUALITY)
      if (file.type.startsWith('video/')) {
        console.log('🔄 Compressing video before upload...');
        
        Toast.show({
          type: 'info',
          text1: 'Compressing video...',
          text2: 'Maintaining high quality ✨',
          visibilityTime: 2000,
        });

        const result = await compressVideo(file.uri, {
          quality: 'high', // Use HIGH quality preset
        });
        uploadUri = result.uri;
        wasCompressed = result.compressed;

        if (wasCompressed) {
          Toast.show({
            type: 'success',
            text1: 'Video compressed!',
            text2: 'Uploading now...',
            visibilityTime: 1500,
          });
        }
      }

      const form = new FormData();
      form.append('media', {
        uri: uploadUri,
        name: file.name,
        type: file.type,
      } as any);

      const token = await AsyncStorage.getItem('token');

      const response = await fetch(`${API_BASE_URL}/api/upload/media`, {
        method: 'POST',
        body: form,
        headers: {
          ...(token && { Authorization: `Bearer ${token}` }),
        },
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Upload failed');
      
   return data;
    },

    onError: (error: Error) => {
      Toast.show({
        type: 'error',
        text1: 'Upload failed',
        text2: error.message,
      });
    },
  });
};

// ✅ Create Reel
export const useCreateReel = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (reelData: CreateReelData) => {
      return apiClient('/api/reels', {
        method: 'POST',
        body: JSON.stringify(reelData),
      });
    },

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reels'] });

      Toast.show({
        type: 'success',
        text1: 'Reel Posted!',
        text2: 'Your reel has been uploaded successfully',
      });
    },

    onError: (error: Error) => {
      Toast.show({
        type: 'error',
        text1: 'Failed to upload reel',
        text2: error.message,
      });
    },
  });
};

// ✅ GET ALL REELS (feed)
// export const useReels = (page = 1, category?: string, userId?: string) => {
//   return useQuery({
//     queryKey: ['reels', page, category, userId],
//     queryFn: async () => {
//       const params = new URLSearchParams({
//         page: page.toString(),
//         limit: '10',
//         ...(category && category !== 'All' ? { category } : {}),
//         ...(userId ? { userId } : {}),
//       });

//       return apiClient(`/api/reels?${params}`);
//     },
//     staleTime: 60 * 1000,
//   });
// };
export const useReels = (category?: string, userId?: string) => {
  return useInfiniteQuery({
    queryKey: ['reels', category, userId],
    queryFn: async ({ pageParam = null }) => {
      const params = new URLSearchParams({
        limit: '5',
        ...(category && category !== 'All' ? { category } : {}),
        ...(userId ? { userId } : {}),
        ...(pageParam ? { cursor: pageParam } : {}),
      });

      const res = await apiClient(`/api/reels?${params}`);
      return {
        reels: res.reels || [],
        nextCursor: res.nextCursor || null,
      };
    },
    getNextPageParam: (lastPage) => lastPage.nextCursor ?? undefined,
    initialPageParam: null as string | null,
    staleTime: 1000 * 60,
    gcTime: 1000 * 60 * 5,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
  });
};

// ✅ GET SINGLE REEL
export const useReel = (reelId: string, enabled = true) => {
  const queryClient = useQueryClient();

  return useQuery({
    queryKey: ['reel', reelId],
    queryFn: async () => {
      const data = await apiClient(`/api/reels/${reelId}`);
      return data.reel;
    },
    enabled: enabled && !!reelId,
    staleTime: 5 * 60 * 1000,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reels'] });
    },
  });
};
export const useDeleteReel = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (reelId: string) => {
      const response = await apiClient(`/api/reels/${reelId}`, {
        method: 'DELETE',
      });
      return response;
    },

    // Optimistic Update (instant UI feedback)
    onMutate: async (reelId) => {
      await queryClient.cancelQueries({ queryKey: ['reels'] });
      await queryClient.cancelQueries({ queryKey: ['userReels'] });

      const previousReels = queryClient.getQueryData<any>(['reels']);
      const previousUserReels = queryClient.getQueryData<any>(['userReels']);

      // Remove reel from all pages
      queryClient.setQueryData(['reels'], (old: any) => {
        if (!old) return old;
        return {
          ...old,
          pages: old.pages.map((page: any) => ({
            ...page,
            reels: page.reels.filter((reel: any) => reel._id !== reelId),
          })),
        };
      });

      queryClient.setQueryData(['userReels'], (old: any) => {
        if (!old) return old;
        return {
          ...old,
          pages: old.pages.map((page: any) => ({
            ...page,
            reels: page.reels.filter((reel: any) => reel._id !== reelId),
          })),
        };
      });

      return { previousReels, previousUserReels };
    },

    onError: (err, reelId, context: any) => {
      // Rollback on error
      if (context?.previousReels) {
        queryClient.setQueryData(['reels'], context.previousReels);
      }
      if (context?.previousUserReels) {
        queryClient.setQueryData(['userReels'], context.previousUserReels);
      }

      Toast.show({
        type: 'error',
        text1: 'Failed to delete reel',
        text2: 'Please try again',
      });
    },

    onSuccess: () => {
      // Invalidate related queries
      queryClient.invalidateQueries({ queryKey: ['reels'] });
      queryClient.invalidateQueries({ queryKey: ['userReels'] });
      queryClient.removeQueries({ queryKey: ['reel', ''] }); // clear single reel cache

      Toast.show({
        type: 'success',
        text1: 'Reel deleted',
        text2: 'Your reel has been removed',
        visibilityTime: 2000,
      });
    },

    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['reels'] });
      queryClient.invalidateQueries({ queryKey: ['userReels'] });
    },
  });
};