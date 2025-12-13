export interface RegisterRequest {
  name: string;
  email?: string;
  phone?: string;
  password: string;
}

export interface LoginRequest {
  email: string; 
  password: string;
}

export interface UserResponse {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  createdAt?: Date;
}

export interface AuthResponse {
  success: boolean;
  message: string;
  data?: {
    user: UserResponse;
    token: string;
  };
  error?: string;
}

export interface ErrorResponse {
  success: false;
  message: string;
  error?: string;
}