export function getErrorMessage(error: unknown): string | undefined {
  if (typeof error !== "object" || error === null || !("response" in error)) {
    return undefined;
  }

  const data = (error as { response?: { data?: unknown } }).response?.data;
  if (typeof data !== "object" || data === null || !("message" in data)) {
    return undefined;
  }

  const message = (data as { message: unknown }).message;
  if (typeof message !== "string") return undefined;

  const trimmed = message.trim();
  return trimmed || undefined;
}
