import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '../api/apiClient';
import Toast from 'react-native-toast-message';

interface UserProfile {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  bio: string;
  gender: string;
  profilePicture: string;
  momentsCount: number;
  connectionsCount: number;
  connectingCount: number;
  analytics?: {
    totalViews: number;
    engagementRate: number;
    estimatedEarnings: number;
  };
}

// ✅ Fetch Profile
export const useProfile = () => {
  return useQuery({
    queryKey: ['profile'],
    queryFn: async (): Promise<UserProfile> => {
      const data = await apiClient('/api/profile');
      return data.user;
    },
    staleTime: 5 * 60 * 1000, 
  });
};

// ✅ Update Profile
export const useUpdateProfile = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (profileData: Partial<UserProfile>) => {
      return apiClient('/api/profile', {
        method: 'PUT',
        body: JSON.stringify(profileData),
      });
    },
    onSuccess: (data) => {
      // Update cache
      queryClient.setQueryData(['profile'], data.user);
      
      Toast.show({
        type: 'success',
        text1: 'Profile updated',
        text2: 'Your changes have been saved',
      });
    },
    onError: (error: Error) => {
      Toast.show({
        type: 'error',
        text1: 'Update failed',
        text2: error.message,
      });
    },
  });
};