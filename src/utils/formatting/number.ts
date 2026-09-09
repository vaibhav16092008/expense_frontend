export function formatPercentage(
  value: number,
  decimals = 1,
  includeSign = false
): string {
  const formatted = value.toFixed(decimals);
  if (includeSign && value > 0) {
    return `+${formatted}%`;
  }
  return `${formatted}%`;
}

export function formatNumber(
  value: number,
  compact = false,
  locale?: string
): string {
  const targetLocale = locale || (typeof navigator !== "undefined" ? navigator.language : "en-US");
  return new Intl.NumberFormat(targetLocale, {
    notation: compact ? "compact" : "standard",
    maximumFractionDigits: 2,
  }).format(value);
}
