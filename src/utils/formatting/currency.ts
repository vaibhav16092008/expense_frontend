export interface FormatCurrencyOptions {
  currency?: string;
  locale?: string;
  minimumFractionDigits?: number;
  maximumFractionDigits?: number;
  compact?: boolean;
}

export function formatCurrency(
  amount: number,
  options: FormatCurrencyOptions = {}
): string {
  const {
    currency = "USD",
    locale = typeof navigator !== "undefined" ? navigator.language : "en-US",
    minimumFractionDigits = 2,
    maximumFractionDigits = 2,
    compact = false,
  } = options;

  try {
    const formatter = new Intl.NumberFormat(locale, {
      style: "currency",
      currency,
      notation: compact ? "compact" : "standard",
      minimumFractionDigits: compact ? 0 : minimumFractionDigits,
      maximumFractionDigits,
    });
    return formatter.format(amount);
  } catch {
    // Fallback if currency code or locale is invalid
    return `${currency} ${amount.toFixed(2)}`;
  }
}
