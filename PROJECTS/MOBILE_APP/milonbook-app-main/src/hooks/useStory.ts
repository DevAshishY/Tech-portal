// hooks/useStory.ts
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient, API_BASE_URL } from '../api/apiClient';
import Toast from 'react-native-toast-message';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useVideoCompression } from './useVideoCompression';

export type StoryPrivacy = 'public' | 'friends' | 'private';

interface CreateStoryData {
  mediaUrl: string;
  mediaType: 'image' | 'video';
  caption?: string;
  privacy?: StoryPrivacy;
}

// 1. Upload Media First (with compression for videos)
export const useUploadStoryMedia = () => {
  const { compressVideo, isCompressing, compressionProgress } = useVideoCompression();

  return useMutation({
    mutationFn: async (file: { uri: string; name: string; type: string }) => {
      let uploadUri = file.uri;
      let wasCompressed = false;

      // Compress video before upload (just like Reels)
      if (file.type.startsWith('video/')) {
        Toast.show({
          type: 'info',
          text1: 'Compressing video...',
          text2: 'Best quality guaranteed',
        });

        const result = await compressVideo(file.uri, { quality: 'high' });
        uploadUri = result.uri;
        wasCompressed = result.compressed;

        if (wasCompressed) {
          Toast.show({
            type: 'success',
            text1: 'Compressed!',
            text2: 'Uploading now...',
          });
        }
      }

      const formData = new FormData();
      formData.append('media', {
        uri: uploadUri,
        name: file.name,
        type: file.type,
      } as any);

      const token = await AsyncStorage.getItem('token');

      const response = await fetch(`${API_BASE_URL}/api/upload/media`, {
        method: 'POST',
        body: formData,
        headers: {
          'Content-Type': 'multipart/form-data',
          ...(token && { Authorization: `Bearer ${token}` }),
        },
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Upload failed');

      return data.url; // Must return: "/uploads/images/xxx.jpg" or full URL
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

// 2. Create Story with Public URL
export const useCreateStory = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: CreateStoryData) => {
      return apiClient('/api/story', {
        method: 'POST',
        body: JSON.stringify(data),
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['stories'] });
      queryClient.invalidateQueries({ queryKey: ['user-stories'] });
      queryClient.invalidateQueries({ queryKey: ['stories', 'home'] });

      Toast.show({
        type: 'success',
        text1: 'Story Posted!',
        text2: 'Visible for 24 hours',
      });
    },
    onError: (error: any) => {
      Toast.show({
        type: 'error',
        text1: 'Failed to post story',
        text2: error.message || 'Try again',
      });
    },
  });
};