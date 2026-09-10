export type NotificationType =
  | "BUDGET_WARNING"
  | "BUDGET_CRITICAL"
  | "BUDGET_EXCEEDED"
  | "RECURRING_UPCOMING"
  | "RECURRING_DUE"
  | "GOAL_DEADLINE"
  | "GOAL_PROGRESS"
  | "MONTHLY_SUMMARY";

export type NotificationSeverity = "INFO" | "WARNING" | "CRITICAL";

export interface NotificationObject {
  id: string;
  userId: string;
  type: NotificationType;
  title: string;
  message: string;
  severity: NotificationSeverity;
  isRead: boolean;
  referenceType: string | null;
  referenceId: string | null;
  notificationKey: string;
  createdAt: string;
  readAt: string | null;
}

export interface NotificationsPagination {
  page: number;
  limit: number;
  totalCount: number;
  totalPages: number;
  hasMore: boolean;
}

export interface NotificationsResponse {
  success: boolean;
  message: string;
  data: NotificationObject[];
  pagination: NotificationsPagination;
}

export interface UnreadCountResponse {
  success: boolean;
  message: string;
  data: {
    count: number;
  };
}

export interface MarkNotificationReadResponse {
  success: boolean;
  message: string;
  data: NotificationObject;
}

export interface MarkAllReadResponse {
  success: boolean;
  message: string;
  data: {
    count: number;
  };
}

export interface DeleteNotificationResponse {
  success: boolean;
  message: string;
}

export interface NotificationQueryParams {
  page?: number;
  limit?: number;
  unreadOnly?: boolean;
  type?: NotificationType;
}

export interface NotificationPreferences {
  budgetAlertsEnabled: boolean;
  recurringRemindersEnabled: boolean;
  goalRemindersEnabled: boolean;
  monthlySummaryEnabled: boolean;
}

export interface UpdateNotificationPreferencesPayload {
  budgetAlertsEnabled?: boolean;
  recurringRemindersEnabled?: boolean;
  goalRemindersEnabled?: boolean;
}

export interface UserSettingsResponse {
  success: boolean;
  message: string;
  data: {
    id: string;
    userId: string;
    currency?: string;
    dateFormat?: string;
    theme?: string;
    budgetAlertsEnabled: boolean;
    recurringRemindersEnabled: boolean;
    goalRemindersEnabled: boolean;
    monthlySummaryEnabled: boolean;
    createdAt?: string;
    updatedAt?: string;
  };
}
