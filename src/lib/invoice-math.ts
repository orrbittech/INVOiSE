import type { InvoiceState, InvoiceTotals, LineItem } from "@/types/invoice";

export function computeLineAmount(item: LineItem): number {
  return item.quantity * item.rate;
}

export function computeTotals(state: Pick<
  InvoiceState,
  | "lineItems"
  | "taxRate"
  | "taxEnabled"
  | "discountAmount"
  | "discountEnabled"
  | "discountIsPercent"
  | "shippingAmount"
  | "shippingEnabled"
  | "amountPaid"
>): InvoiceTotals {
  const subtotal = state.lineItems.reduce(
    (sum, item) => sum + computeLineAmount(item),
    0,
  );

  let discountValue = 0;
  if (state.discountEnabled && state.discountAmount > 0) {
    discountValue = state.discountIsPercent
      ? subtotal * (state.discountAmount / 100)
      : state.discountAmount;
  }

  const afterDiscount = Math.max(0, subtotal - discountValue);

  const taxAmount =
    state.taxEnabled && state.taxRate > 0
      ? afterDiscount * (state.taxRate / 100)
      : 0;

  const shippingValue =
    state.shippingEnabled && state.shippingAmount > 0
      ? state.shippingAmount
      : 0;

  const total = afterDiscount + taxAmount + shippingValue;
  const balanceDue = total - (state.amountPaid || 0);

  return {
    subtotal,
    taxAmount,
    discountValue,
    shippingValue,
    total,
    balanceDue,
  };
}
