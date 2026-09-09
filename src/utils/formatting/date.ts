export function formatDate(
  dateInput: Date | string | number,
  options: Intl.DateTimeFormatOptions = {
    year: "numeric",
    month: "short",
    day: "numeric",
  },
  locale?: string
): string {
  const date = new Date(dateInput);
  if (isNaN(date.getTime())) return "Invalid date";

  const targetLocale = locale || (typeof navigator !== "undefined" ? navigator.language : "en-US");
  return new Intl.DateTimeFormat(targetLocale, options).format(date);
}

export function formatRelativeTime(dateInput: Date | string | number): string {
  const date = new Date(dateInput);
  if (isNaN(date.getTime())) return "";

  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (diffInSeconds < 60) return "Just now";
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
  if (diffInSeconds < 2592000) return `${Math.floor(diffInSeconds / 86400)}d ago`;

  return formatDate(date);
}
