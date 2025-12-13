


import { useQuery, useInfiniteQuery,useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient, API_BASE_URL } from '../api/apiClient';
import Toast from 'react-native-toast-message';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface CreatePostData {
  caption: string;
  mediaUrl: string;
  mediaType: 'image' | 'video';
  category: string;
  hashtags: string[];
  taggedUsers: string[];
  location?: {
    name: string;
    coordinates?: [number, number];
  };
}

// ✅ CREATE POST
export const useCreatePost = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (postData: CreatePostData) => {
      return apiClient('/api/posts', {
        method: 'POST',
        body: JSON.stringify(postData),
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['posts'] });

      Toast.show({
        type: 'success',
        text1: 'Post Created!',
        text2: 'Your post has been shared successfully',
      });
    },
    onError: (error: Error) => {
      Toast.show({
        type: 'error',
        text1: 'Failed to create post',
        text2: error.message,
      });
    },
  });
};

// ✅ GET ALL POSTS (Feed)
// export const usePosts = (page = 1, category?: string) => {
//   return useQuery({
//     queryKey: ['posts', page, category],
//     queryFn: async () => {
//       const params = new URLSearchParams({
//         page: page.toString(),
//         limit: '10',
//         ...(category && category !== 'All' && { category }),
//       });
//       return apiClient(`/api/posts?${params}`);
//     },
//     staleTime: 60 * 1000,
//   });
// };

// // ✅ GET USER'S POSTS
// export const useUserPosts = (userId: string) => {
//   return useQuery({
//     queryKey: ['posts', 'user', userId],
//     queryFn: async () => {
//       return apiClient(`/api/posts?userId=${userId}`);
//     },
//   });
// };
// ✅ GET ALL POSTS (Feed) - WITH CURSOR PAGINATION
export const usePosts = (category?: string) => {
  return useInfiniteQuery({
    queryKey: ['posts', category],
    queryFn: async ({ pageParam }: { pageParam: string | undefined }) => {
      const paramsObj: Record<string, string> = {
        limit: '10',
      };
      
      if (category && category !== 'All') {
        paramsObj.category = category;
      }
      
      if (pageParam) {
        paramsObj.cursor = pageParam;
      }
      
      const params = new URLSearchParams(paramsObj);
      return apiClient(`/api/posts?${params}`);
    },
    getNextPageParam: (lastPage) => {
      return lastPage?.nextCursor || undefined;
    },
    initialPageParam: undefined as string | undefined,
    staleTime: 60 * 1000,
  });
};

// ✅ GET USER'S POSTS
export const useUserPosts = (userId: string) => {
  return useInfiniteQuery({
    queryKey: ['posts', 'user', userId],
    queryFn: async ({ pageParam }: { pageParam: string | undefined }) => {
      const paramsObj: Record<string, string> = {
        userId,
        limit: '10',
      };
      
      if (pageParam) {
        paramsObj.cursor = pageParam;
      }
      
      const params = new URLSearchParams(paramsObj);
      return apiClient(`/api/posts?${params}`);
    },
    getNextPageParam: (lastPage) => {
      return lastPage?.nextCursor || undefined;
    },
    initialPageParam: undefined as string | undefined,
  });
};
// ✅ UPLOAD IMAGE
export const useUploadImage = () => {
  return useMutation({
    mutationFn: async (file: { uri: string; name: string; type: string }) => {
      const form = new FormData();
      form.append('image', {
        uri: file.uri,
        name: file.name,
        type: file.type,
      } as any);

      const token = await AsyncStorage.getItem('token');

      const response = await fetch(`${API_BASE_URL}/api/upload`, {
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

// ✅ UPLOAD MEDIA (Image + Video)
export const useUploadMedia = () => {
  return useMutation({
    mutationFn: async (file: { uri: string; name: string; type: string }) => {
      const form = new FormData();
      form.append('media', {
        uri: file.uri,
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
// ✅ DELETE POST
export const useDeletePost = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (postId: string) => {
      return apiClient(`/api/posts/${postId}`, {
        method: 'DELETE',
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['posts'] });

      Toast.show({
        type: 'success',
        text1: 'Post Deleted!',
        text2: 'Your post has been deleted successfully',
      });
    },
    onError: (error: Error) => {
      Toast.show({
        type: 'error',
        text1: 'Failed to delete post',
        text2: error.message,
      });
    },
  });
};