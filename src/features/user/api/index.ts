import apiClient from "@/lib/api/client";
import { Theme } from "@/types/common";
import {
  BackendThemePreference,
  BackendUpdateUserSettingsPayload,
  BackendUserSettings,
  ChangePasswordPayload,
  DeleteAccountPayload,
  UpdateProfilePayload,
  UpdateUserSettingsPayload,
  UserApiResponse,
  UserProfile,
  UserSettings,
} from "../types";

// Helper to normalize backend theme ("SYSTEM" | "LIGHT" | "DARK") to frontend Theme ("system" | "light" | "dark")
function normalizeThemeFromBackend(theme: BackendThemePreference | string): Theme {
  const normalized = (theme || "SYSTEM").toLowerCase();
  if (normalized === "dark" || normalized === "light" || normalized === "system") {
    return normalized as Theme;
  }
  return "system";
}

// Helper to map frontend Theme ("system" | "light" | "dark") to backend BackendThemePreference ("SYSTEM" | "LIGHT" | "DARK")
function mapThemeToBackend(theme?: Theme): BackendThemePreference | undefined {
  if (!theme) return undefined;
  return theme.toUpperCase() as BackendThemePreference;
}

// Helper to map raw backend settings object to frontend UserSettings
function mapSettingsFromBackend(backendData: BackendUserSettings): UserSettings {
  return {
    ...backendData,
    theme: normalizeThemeFromBackend(backendData.theme),
  };
}

export const getMyProfile = async (): Promise<UserProfile> => {
  const response = await apiClient.get<UserApiResponse<UserProfile> | UserProfile>("/users/me");
  const data = (response.data as UserApiResponse<UserProfile>)?.data || (response.data as UserProfile);
  return data;
};

export const updateMyProfile = async (
  payload: UpdateProfilePayload
): Promise<UserProfile> => {
  const response = await apiClient.patch<UserApiResponse<UserProfile> | UserProfile>(
    "/users/me",
    payload
  );
  const data = (response.data as UserApiResponse<UserProfile>)?.data || (response.data as UserProfile);
  return data;
};

export const changePassword = async (
  payload: ChangePasswordPayload
): Promise<UserApiResponse<void>> => {
  const response = await apiClient.patch<UserApiResponse<void>>("/users/me/password", payload);
  return response.data;
};

export const getUserSettings = async (): Promise<UserSettings> => {
  const response = await apiClient.get<UserApiResponse<BackendUserSettings>>("/users/settings");
  const backendData = response.data?.data;
  if (!backendData) {
    throw new Error("Failed to load user settings data.");
  }
  return mapSettingsFromBackend(backendData);
};

export const updateUserSettings = async (
  payload: UpdateUserSettingsPayload
): Promise<UserSettings> => {
  const backendPayload: BackendUpdateUserSettingsPayload = {
    currency: payload.currency,
    monthlyBudgetEnabled: payload.monthlyBudgetEnabled,
    monthlyBudgetAmount: payload.monthlyBudgetAmount,
    budgetAlertsEnabled: payload.budgetAlertsEnabled,
    recurringRemindersEnabled: payload.recurringRemindersEnabled,
    goalRemindersEnabled: payload.goalRemindersEnabled,
    theme: mapThemeToBackend(payload.theme),
  };

  const response = await apiClient.patch<UserApiResponse<BackendUserSettings>>(
    "/users/settings",
    backendPayload
  );
  const backendData = response.data?.data;
  if (!backendData) {
    throw new Error("Failed to update user settings.");
  }
  return mapSettingsFromBackend(backendData);
};

export const deleteMyAccount = async (
  payload: DeleteAccountPayload
): Promise<UserApiResponse<void>> => {
  const response = await apiClient.delete<UserApiResponse<void>>("/users/me", {
    data: payload,
  });
  return response.data;
};
