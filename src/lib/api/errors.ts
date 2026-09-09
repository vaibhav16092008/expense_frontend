import { ApiErrorResponse } from "@/types/api";
import { AxiosError } from "axios";

export class AppError extends Error {
  public statusCode: number;
  public details?: ApiErrorResponse["errors"];
  public isNetworkError: boolean;

  constructor(message: string, statusCode = 500, details?: ApiErrorResponse["errors"], isNetworkError = false) {
    super(message);
    this.name = "AppError";
    this.statusCode = statusCode;
    this.details = details;
    this.isNetworkError = isNetworkError;
  }
}

export function normalizeApiError(error: unknown): AppError {
  if (error instanceof AppError) {
    return error;
  }

  if (typeof error === "object" && error !== null && "isAxiosError" in error) {
    const axiosError = error as AxiosError<ApiErrorResponse>;

    if (!axiosError.response) {
      return new AppError(
        "Network error. Please check your internet connection and try again.",
        0,
        undefined,
        true
      );
    }

    const status = axiosError.response.status;
    const responseData = axiosError.response.data;

    let message = responseData?.message || axiosError.message || "An unexpected error occurred.";

    if (status === 401) {
      message = responseData?.message || "Session expired. Please log in again.";
    } else if (status === 403) {
      message = "You do not have permission to perform this action.";
    } else if (status === 404) {
      message = "Requested resource was not found.";
    } else if (status >= 500) {
      message = "Server error. Our team has been notified. Please try again later.";
    }

    return new AppError(message, status, responseData?.errors);
  }

  if (error instanceof Error) {
    return new AppError(error.message, 500);
  }

  return new AppError("An unknown error occurred.", 500);
}
