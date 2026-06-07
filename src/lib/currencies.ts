export type Currency = {
  code: string;
  symbol: string;
  label: string;
};

export const CURRENCIES: Currency[] = [
  { code: "ZAR", symbol: "R", label: "South African Rand (ZAR)" },
  { code: "USD", symbol: "$", label: "US Dollar (USD)" },
  { code: "EUR", symbol: "€", label: "Euro (EUR)" },
  { code: "GBP", symbol: "£", label: "British Pound (GBP)" },
  { code: "AUD", symbol: "A$", label: "Australian Dollar (AUD)" },
  { code: "CAD", symbol: "C$", label: "Canadian Dollar (CAD)" },
  { code: "NZD", symbol: "NZ$", label: "New Zealand Dollar (NZD)" },
  { code: "INR", symbol: "₹", label: "Indian Rupee (INR)" },
  { code: "JPY", symbol: "¥", label: "Japanese Yen (JPY)" },
  { code: "CNY", symbol: "¥", label: "Chinese Yuan (CNY)" },
  { code: "CHF", symbol: "CHF", label: "Swiss Franc (CHF)" },
  { code: "SEK", symbol: "kr", label: "Swedish Krona (SEK)" },
  { code: "NOK", symbol: "kr", label: "Norwegian Krone (NOK)" },
  { code: "AED", symbol: "د.إ", label: "UAE Dirham (AED)" },
  { code: "SGD", symbol: "S$", label: "Singapore Dollar (SGD)" },
];

export function getCurrencySymbol(code: string): string {
  return CURRENCIES.find((c) => c.code === code)?.symbol ?? code;
}
