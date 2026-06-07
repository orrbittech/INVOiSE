export const PAYMENT_TERM_OPTIONS = [
  "Due on receipt",
  "Net 7",
  "Net 15",
  "Net 30",
  "Net 45",
  "Net 60",
  "Net 90",
  "Custom",
] as const;

export type PaymentTermOption = (typeof PAYMENT_TERM_OPTIONS)[number];

export function isPresetPaymentTerm(value: string): boolean {
  return PAYMENT_TERM_OPTIONS.includes(value as PaymentTermOption);
}
