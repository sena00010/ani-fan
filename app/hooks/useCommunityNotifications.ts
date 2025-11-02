import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/services/api";

interface CommunityNotificationParams {
  limit: number;
  offset: number;
  project?: Record<string, unknown>;
}

interface CommunityNotification {
  notification_id: string;
  notification_type: "1" | "2" | "3" | "4" | "5";
  user_id: string;
  to_user_id: string;
  post_id: string;
  community_id: string;
  seen_status: string;
  created_date: string;
  updated_date: string;
  user_name?: string;
}

interface CommunityNotificationsResponse {
  data?: CommunityNotification[];
  status?: boolean;
}

export const useCommunityNotifications = (params: CommunityNotificationParams) => {
  return useQuery<CommunityNotificationsResponse>({
    queryKey: ["communityNotifications", params.limit, params.offset],
    queryFn: async () => {
      const response = await api.post("/community/notifications/list", params);
      return response.data;
    },
    staleTime: 30000, // 30 saniye
  });
};

export const useMarkNotificationsAsSeen = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (params: { project?: Record<string, unknown> }) => {
      const response = await api.post("/community/notifications/seen", params);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["communityNotifications"] });
    },
  });
};

export const useDeleteAllNotifications = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (params: { project?: Record<string, unknown> }) => {
      const response = await api.post("/community/notifications/delete-all", params);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["communityNotifications"] });
    },
  });
};




