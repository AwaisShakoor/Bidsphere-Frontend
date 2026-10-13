import axios from "axios";

export function getApiErrorMessage(
  error: unknown,
  fallbackMessage = "Something went wrong. Try again.",
) {
  if (axios.isAxiosError<{ message?: string }>(error)) {
    return error.response?.data?.message || fallbackMessage;
  }

  return fallbackMessage;
}
