import apiClient from "@/lib/api/client";
import {
  DeleteNotificationResponse,
  MarkAllReadResponse,
  MarkNotificationReadResponse,
  NotificationPreferences,
  NotificationQueryParams,
  NotificationsResponse,
  UnreadCountResponse,
  UpdateNotificationPreferencesPayload,
  UserSettingsResponse,
} from "../types";

export const getNotifications = async (
  params: NotificationQueryParams = {}
): Promise<NotificationsResponse> => {
  const cleanParams: Record<string, unknown> = {};

  if (params.page !== undefined) cleanParams.page = params.page;
  if (params.limit !== undefined) cleanParams.limit = params.limit;
  if (params.unreadOnly !== undefined) cleanParams.unreadOnly = params.unreadOnly;
  if (params.type) cleanParams.type = params.type;

  const response = await apiClient.get<NotificationsResponse>("/notifications", {
    params: cleanParams,
  });

  const rawData = response.data;
  const items = Array.isArray(rawData?.data) ? rawData.data : [];
  const rawPagination = rawData?.pagination ?? {
    page: params.page || 1,
    limit: params.limit || 20,
    totalCount: items.length,
    totalPages: 1,
    hasMore: false,
  };

  return {
    success: rawData?.success ?? true,
    message: rawData?.message || "",
    data: items,
    pagination: {
      page: Number(rawPagination.page) || params.page || 1,
      limit: Number(rawPagination.limit) || params.limit || 20,
      totalCount: Number(rawPagination.totalCount) || items.length,
      totalPages: Number(rawPagination.totalPages) || 1,
      hasMore: Boolean(rawPagination.hasMore),
    },
  };
};

export const getUnreadCount = async (): Promise<UnreadCountResponse> => {
  const response = await apiClient.get<UnreadCountResponse>("/notifications/unread-count");
  return response.data;
};

export const markNotificationAsRead = async (
  id: string
): Promise<MarkNotificationReadResponse> => {
  const response = await apiClient.patch<MarkNotificationReadResponse>(
    `/notifications/${id}/read`
  );
  return response.data;
};

export const markAllNotificationsAsRead = async (): Promise<MarkAllReadResponse> => {
  const response = await apiClient.patch<MarkAllReadResponse>("/notifications/read-all");
  return response.data;
};

export const deleteNotification = async (
  id: string
): Promise<DeleteNotificationResponse> => {
  const response = await apiClient.delete<DeleteNotificationResponse>(
    `/notifications/${id}`
  );
  return response.data;
};

export const getNotificationPreferences = async (): Promise<NotificationPreferences> => {
  const response = await apiClient.get<UserSettingsResponse>("/users/settings");
  const data = response.data?.data;
  return {
    budgetAlertsEnabled: data?.budgetAlertsEnabled ?? true,
    recurringRemindersEnabled: data?.recurringRemindersEnabled ?? true,
    goalRemindersEnabled: data?.goalRemindersEnabled ?? true,
    monthlySummaryEnabled: data?.monthlySummaryEnabled ?? true,
  };
};

export const updateNotificationPreferences = async (
  payload: UpdateNotificationPreferencesPayload
): Promise<NotificationPreferences> => {
  // Filter out any undefined or unauthorized fields
  const cleanPayload: UpdateNotificationPreferencesPayload = {};
  if (payload.budgetAlertsEnabled !== undefined) {
    cleanPayload.budgetAlertsEnabled = payload.budgetAlertsEnabled;
  }
  if (payload.recurringRemindersEnabled !== undefined) {
    cleanPayload.recurringRemindersEnabled = payload.recurringRemindersEnabled;
  }
  if (payload.goalRemindersEnabled !== undefined) {
    cleanPayload.goalRemindersEnabled = payload.goalRemindersEnabled;
  }

  const response = await apiClient.patch<UserSettingsResponse>("/users/settings", cleanPayload);
  const data = response.data?.data;
  return {
    budgetAlertsEnabled: data?.budgetAlertsEnabled ?? true,
    recurringRemindersEnabled: data?.recurringRemindersEnabled ?? true,
    goalRemindersEnabled: data?.goalRemindersEnabled ?? true,
    monthlySummaryEnabled: data?.monthlySummaryEnabled ?? true,
  };
};
