import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  deleteNotification,
  getNotificationPreferences,
  getNotifications,
  getUnreadCount,
  markAllNotificationsAsRead,
  markNotificationAsRead,
  updateNotificationPreferences,
} from "../api";
import {
  NotificationQueryParams,
  UpdateNotificationPreferencesPayload,
} from "../types";

export const NOTIFICATIONS_LIST_QUERY_KEY = ["notifications", "list"];
export const NOTIFICATIONS_UNREAD_COUNT_QUERY_KEY = ["notifications", "unread-count"];
export const NOTIFICATIONS_SETTINGS_QUERY_KEY = ["notifications", "settings"];

export function useNotifications(params: NotificationQueryParams = {}) {
  return useQuery({
    queryKey: [...NOTIFICATIONS_LIST_QUERY_KEY, params],
    queryFn: () => getNotifications(params),
    staleTime: 30000, // 30 seconds freshness
    refetchInterval: 60000, // Background poll every 60 seconds
  });
}

export function useUnreadCount() {
  return useQuery({
    queryKey: NOTIFICATIONS_UNREAD_COUNT_QUERY_KEY,
    queryFn: getUnreadCount,
    staleTime: 30000,
    refetchInterval: 60000,
  });
}

export function useMarkNotificationAsRead() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => markNotificationAsRead(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: NOTIFICATIONS_LIST_QUERY_KEY });
      queryClient.invalidateQueries({ queryKey: NOTIFICATIONS_UNREAD_COUNT_QUERY_KEY });
    },
  });
}

export function useMarkAllNotificationsAsRead() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: markAllNotificationsAsRead,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: NOTIFICATIONS_LIST_QUERY_KEY });
      queryClient.invalidateQueries({ queryKey: NOTIFICATIONS_UNREAD_COUNT_QUERY_KEY });
    },
  });
}

export function useDeleteNotification() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => deleteNotification(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: NOTIFICATIONS_LIST_QUERY_KEY });
      queryClient.invalidateQueries({ queryKey: NOTIFICATIONS_UNREAD_COUNT_QUERY_KEY });
    },
  });
}

export function useNotificationPreferences() {
  return useQuery({
    queryKey: NOTIFICATIONS_SETTINGS_QUERY_KEY,
    queryFn: getNotificationPreferences,
    staleTime: 60000,
  });
}

export function useUpdateNotificationPreferences() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: UpdateNotificationPreferencesPayload) =>
      updateNotificationPreferences(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: NOTIFICATIONS_SETTINGS_QUERY_KEY });
    },
  });
}
