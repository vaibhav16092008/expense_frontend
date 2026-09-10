import { Theme } from "@/types/common";

export type CurrencyCode = "INR" | "USD" | "EUR" | "GBP" | "AED";
export type BackendThemePreference = "SYSTEM" | "LIGHT" | "DARK";

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  createdAt: string;
  updatedAt: string;
}

export interface UserSettings {
  id: string;
  userId: string;
  currency: CurrencyCode;
  monthlyBudgetEnabled: boolean;
  monthlyBudgetAmount: string | null;
  budgetAlertsEnabled: boolean;
  recurringRemindersEnabled: boolean;
  goalRemindersEnabled: boolean;
  theme: Theme; // Normalized to frontend "system" | "light" | "dark"
  createdAt: string;
  updatedAt: string;
}

export interface BackendUserSettings {
  id: string;
  userId: string;
  currency: CurrencyCode;
  monthlyBudgetEnabled: boolean;
  monthlyBudgetAmount: string | null;
  budgetAlertsEnabled: boolean;
  recurringRemindersEnabled: boolean;
  goalRemindersEnabled: boolean;
  theme: BackendThemePreference;
  createdAt: string;
  updatedAt: string;
}

export interface UpdateProfilePayload {
  name?: string;
}

export interface ChangePasswordPayload {
  currentPassword: string;
  newPassword: string;
}

export interface UpdateUserSettingsPayload {
  currency?: CurrencyCode;
  monthlyBudgetEnabled?: boolean;
  monthlyBudgetAmount?: number | string | null;
  budgetAlertsEnabled?: boolean;
  recurringRemindersEnabled?: boolean;
  goalRemindersEnabled?: boolean;
  theme?: Theme;
}

export interface BackendUpdateUserSettingsPayload {
  currency?: CurrencyCode;
  monthlyBudgetEnabled?: boolean;
  monthlyBudgetAmount?: number | string | null;
  budgetAlertsEnabled?: boolean;
  recurringRemindersEnabled?: boolean;
  goalRemindersEnabled?: boolean;
  theme?: BackendThemePreference;
}

export interface DeleteAccountPayload {
  password: string;
}

export interface UserApiResponse<T> {
  success: boolean;
  message: string;
  data?: T;
}
