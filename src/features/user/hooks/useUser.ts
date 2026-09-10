import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  changePassword,
  deleteMyAccount,
  getMyProfile,
  getUserSettings,
  updateMyProfile,
  updateUserSettings,
} from "../api";
import {
  ChangePasswordPayload,
  DeleteAccountPayload,
  UpdateProfilePayload,
  UpdateUserSettingsPayload,
} from "../types";

export const USER_PROFILE_QUERY_KEY = ["user", "profile"];
export const USER_SETTINGS_QUERY_KEY = ["user", "settings"];
export const NOTIFICATIONS_SETTINGS_QUERY_KEY = ["notifications", "settings"];

export function useUserProfile() {
  return useQuery({
    queryKey: USER_PROFILE_QUERY_KEY,
    queryFn: getMyProfile,
    staleTime: 60000,
  });
}

export function useUpdateUserProfile() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: UpdateProfilePayload) => updateMyProfile(payload),
    onSuccess: (updatedProfile) => {
      queryClient.setQueryData(USER_PROFILE_QUERY_KEY, updatedProfile);
      queryClient.invalidateQueries({ queryKey: USER_PROFILE_QUERY_KEY });
    },
  });
}

export function useChangePassword() {
  return useMutation({
    mutationFn: (payload: ChangePasswordPayload) => changePassword(payload),
  });
}

export function useUserSettings() {
  return useQuery({
    queryKey: USER_SETTINGS_QUERY_KEY,
    queryFn: getUserSettings,
    staleTime: 60000,
  });
}

export function useUpdateUserSettings() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: UpdateUserSettingsPayload) => updateUserSettings(payload),
    onSuccess: (updatedSettings) => {
      queryClient.setQueryData(USER_SETTINGS_QUERY_KEY, updatedSettings);
      queryClient.invalidateQueries({ queryKey: USER_SETTINGS_QUERY_KEY });
      // Synchronize existing F6 notification preferences query cache
      queryClient.invalidateQueries({ queryKey: NOTIFICATIONS_SETTINGS_QUERY_KEY });
    },
  });
}

export function useDeleteAccount() {
  return useMutation({
    mutationFn: (payload: DeleteAccountPayload) => deleteMyAccount(payload),
  });
}
