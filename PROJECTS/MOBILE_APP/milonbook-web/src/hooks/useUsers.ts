import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";

// Types
interface User {
  _id: string;
  name: string;
  email?: string;
  phone?: string;
  createdAt: string;
  profilePicture?: string;
  momentsCount?: number;
  connectionsCount?: number;
  connectingCount?: number;
}

interface ApiResponse<T> {
  success: boolean;
  data: T;
  count?: number;
  error?: string;
  message?: string;
}

// API Functions
const fetchUsers = async (): Promise<User[]> => {
  try {
    const response = await axios.get<ApiResponse<User[]>>("/api/users", {
      headers: { "Content-Type": "application/json" },
    });
    const data = response.data;
    if (!data.success) {
      throw new Error(data.error || "Failed to fetch users");
    }
    return data.data;
  } catch (error) {
    throw new Error("Failed to fetch users");
  }
};

const fetchUserById = async (id: string): Promise<User> => {
  try {
    const response = await axios.get<ApiResponse<User>>(`/api/users?id=${id}`, {
      headers: { "Content-Type": "application/json" },
    });
    const data = response.data;
    if (!data.success) {
      throw new Error(data.error || "Failed to fetch user");
    }
    return data.data;
  } catch (error) {
    throw new Error("Failed to fetch user");
  }
};

const deleteUser = async (id: string): Promise<void> => {
  try {
    const response = await axios.delete<ApiResponse<User>>(`/api/users?id=${id}`, {
      headers: { "Content-Type": "application/json" },
    });
    const data = response.data;
    if (!data.success) {
      throw new Error(data.error || "Failed to delete user");
    }
  } catch (error) {
    throw new Error("Failed to delete user");
  }
};

// Custom Hooks

// 1. Hook to fetch all users
export const useUsers = () => {
  return useQuery({
    queryKey: ["users"],
    queryFn: fetchUsers,
    staleTime: 30000, // Data stays fresh for 30 seconds
    refetchOnWindowFocus: true,
  });
};

// 2. Hook to fetch a single user by ID
export const useUser = (id: string, enabled: boolean = true) => {
  return useQuery({
    queryKey: ["user", id],
    queryFn: () => fetchUserById(id),
    enabled: enabled && !!id, // Only fetch if enabled and id exists
    staleTime: 30000,
  });
};

// 3. Hook to delete a user
export const useDeleteUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteUser,
    onSuccess: () => {
      // Invalidate and refetch users list after deletion
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
  });
};

// 4. Hook to get user statistics
export const useUserStats = () => {
  return useQuery({
    queryKey: ["users"],
    queryFn: fetchUsers,
    select: (users) => {
      const totalUsers = users.length;
      const activeUsers = users.length; // You can add custom logic
      
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      
      const newSignups = users.filter((user) => {
        const createdDate = new Date(user.createdAt);
        return createdDate >= thirtyDaysAgo;
      }).length;

      return {
        totalUsers,
        activeUsers,
        newSignups,
      };
    },
    staleTime: 30000,
  });
};

// 5. Hook to search/filter users
export const useFilteredUsers = (searchQuery: string) => {
  return useQuery({
    queryKey: ["users"],
    queryFn: fetchUsers,
    select: (users) => {
      if (!searchQuery) return users;
      
      const query = searchQuery.toLowerCase();
      return users.filter(
        (user) =>
          user.name.toLowerCase().includes(query) ||
          user.email?.toLowerCase().includes(query) ||
          user.phone?.includes(query)
      );
    },
    staleTime: 30000,
  });
};

// 6. Hook to get paginated users
export const usePaginatedUsers = (page: number, perPage: number, searchQuery: string = "") => {
  return useQuery({
    queryKey: ["users"],
    queryFn: fetchUsers,
    select: (users) => {
      // Filter users first
      let filteredUsers = users;
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        filteredUsers = users.filter(
          (user) =>
            user.name.toLowerCase().includes(query) ||
            user.email?.toLowerCase().includes(query) ||
            user.phone?.includes(query)
        );
      }

      // Calculate pagination
      const totalPages = Math.ceil(filteredUsers.length / perPage);
      const indexOfLastUser = page * perPage;
      const indexOfFirstUser = indexOfLastUser - perPage;
      const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);

      return {
        users: currentUsers,
        totalUsers: filteredUsers.length,
        totalPages,
        currentPage: page,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1,
      };
    },
    staleTime: 30000,
  });
};

// 7. Hook to manually refetch users
export const useRefetchUsers = () => {
  const queryClient = useQueryClient();

  return () => {
    queryClient.invalidateQueries({ queryKey: ["users"] });
  };
};

// 8. Hook to get users sorted by creation date
export const useSortedUsers = (order: "asc" | "desc" = "desc") => {
  return useQuery({
    queryKey: ["users"],
    queryFn: fetchUsers,
    select: (users) => {
      return [...users].sort((a, b) => {
        const dateA = new Date(a.createdAt).getTime();
        const dateB = new Date(b.createdAt).getTime();
        return order === "desc" ? dateB - dateA : dateA - dateB;
      });
    },
    staleTime: 30000,
  });
};

// 9. Hook to get recent users (last 7 days)
export const useRecentUsers = (days: number = 7) => {
  return useQuery({
    queryKey: ["users"],
    queryFn: fetchUsers,
    select: (users) => {
      const daysAgo = new Date();
      daysAgo.setDate(daysAgo.getDate() - days);
      
      return users.filter((user) => {
        const createdDate = new Date(user.createdAt);
        return createdDate >= daysAgo;
      });
    },
    staleTime: 30000,
  });
};

// 10. Hook to prefetch user data (useful for hover effects)
export const usePrefetchUser = () => {
  const queryClient = useQueryClient();

  return (id: string) => {
    queryClient.prefetchQuery({
      queryKey: ["user", id],
      queryFn: () => fetchUserById(id),
      staleTime: 30000,
    });
  };
};

export type { User, ApiResponse };