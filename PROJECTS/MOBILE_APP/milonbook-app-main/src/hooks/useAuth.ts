import { useMutation } from '@tanstack/react-query';
import { apiClient } from '../api/apiClient';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Toast from 'react-native-toast-message';

interface LoginCredentials {
  identifier: string;
  password: string;
}

interface RegisterData {
  name: string;
  email?: string;
  phone?: string;
  password: string;
}
interface ResetPasswordData {
  identifier: string;
  newPassword: string;
}
interface VerifyOtpPayload {
  email: string;
  otp: string;
}
// ✅ Login
export const useLogin = () => {
  return useMutation({
    mutationFn: async (credentials: LoginCredentials) => {
      return apiClient('/api/auth/login', {
        method: 'POST',
        requiresAuth: false,
        body: JSON.stringify(credentials),
      });
    },
    onSuccess: async (data) => {
      await AsyncStorage.setItem('token', data.token);
      Toast.show({
        type: 'success',
        text1: 'Login Successful',
        text2: 'Welcome back!',
      });
    },
    onError: (error: Error) => {
      Toast.show({
        type: 'error',
        text1: 'Login Failed',
        text2: error.message,
      });
    },
  });
};
export const useRegister = () => {
  return useMutation({
    mutationFn: async (data: RegisterData) => {
      return apiClient('/api/auth/register', {
        method: 'POST',
        requiresAuth: false,
        body: JSON.stringify(data),
      });
    },
    onSuccess: async (data) => {
      await AsyncStorage.setItem('token', data.token);
      Toast.show({
        type: 'success',
        text1: 'Registration Successful',
        text2: 'Welcome to Milonbook!',
      });
    },
    onError: (error: Error) => {
      Toast.show({
        type: 'error',
        text1: 'Registration Failed',
        text2: error.message,
      });
    },
  });
};

// ✅ Verify Token
export const useVerifyToken = () => {
  return useMutation({
    mutationFn: async (token: string) => {
      return apiClient('/api/auth/verify', {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
        },
        requiresAuth: false,
      });
    },
  });
};
export const useGoogleLogin = () => {
  return useMutation({
    mutationFn: async (googleIdToken: string) => {
      return apiClient('/api/auth/google', {
        method: 'POST',
        requiresAuth: false,
        body: JSON.stringify({ token: googleIdToken }),
      });
    },

    onSuccess: async (data) => {
      await AsyncStorage.setItem('token', data.token);

      Toast.show({
        type: 'success',
        text1: 'Login Successful',
        text2: 'Logged in with Google',
      });
    },

    onError: (error: any) => {
      Toast.show({
        type: 'error',
        text1: 'Google Login Failed',
        text2: error?.message ?? 'Something went wrong',
      });
    },
  });
};
export const useFacebookLogin = () => {
  return useMutation({
    mutationFn: async (accessToken: string) => {
      return apiClient('/api/auth/facebook', {
        method: 'POST',
        requiresAuth: false,
        body: JSON.stringify({ accessToken }),
      });
    },

    onSuccess: async (data) => {
      await AsyncStorage.setItem('token', data.token);

      Toast.show({
        type: 'success',
        text1: 'Login Successful',
        text2: 'Logged in with Facebook!',
      });
    },

    onError: (error: any) => {
      Toast.show({
        type: 'error',
        text1: 'Facebook Login Failed',
        text2: error?.message || 'Something went wrong',
      });
    },
  });
};
export function useSendOtp() {
  return useMutation({
    mutationFn: async (email: string) => {
      return apiClient("/api/auth/otp", {
        method: "POST",
        requiresAuth: false, // 🔥 OTP does NOT need token
        body: JSON.stringify({ email }),
      });
    },

    onSuccess: (data: any) => {
      Toast.show({
        type: "success",
        text1: "OTP Sent",
        text2: data.message || "OTP sent successfully!",
      });
    },

    onError: (error: any) => {
      Toast.show({
        type: "error",
        text1: "Failed",
        text2: error.message || "Could not send OTP",
      });
    },
  });
}
export const useResetPassword = () => {
  return useMutation({
    mutationFn: async ({ identifier, newPassword }: ResetPasswordData) => {
      return apiClient("/api/auth/reset-password", {
        method: "POST",
        requiresAuth: false,
        body: JSON.stringify({ identifier, newPassword }),
      });
    },

    onSuccess: (data: any) => {
      Toast.show({
        type: "success",
        text1: "Password Reset",
        text2: data.message || "Your password has been reset!",
      });
    },

    onError: (error: any) => {
      Toast.show({
        type: "error",
        text1: "Reset Failed",
        text2: error?.message || "Unable to reset password",
      });
    },
  });
};
export const useVerifyOtp = () => {
  return useMutation({
    mutationFn: async ({ email, otp }: VerifyOtpPayload) => {
      return apiClient("/api/auth/verify-otp", {
        method: "POST",
        requiresAuth: false,
        body: JSON.stringify({ email, otp }),
      });
    },

    onSuccess: (data: any) => {
      Toast.show({
        type: "success",
        text1: "OTP Verified",
        text2: data.message || "Verification successful!",
      });
    },

    onError: (error: any) => {
      Toast.show({
        type: "error",
        text1: "OTP Verification Failed",
        text2: error?.message || "Invalid OTP. Try again.",
      });
    },
  });
};