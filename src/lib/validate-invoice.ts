import type { InvoiceState } from "@/types/invoice";

export type InvoiceValidationField =
  | "companyDetails"
  | "invoiceNumber"
  | "billTo"
  | "lineItems"
  | "dueDate"
  | "paymentTerms";

export type InvoiceValidationResult = {
  fieldErrors: Partial<Record<InvoiceValidationField, string>>;
  fieldWarnings: Partial<Record<InvoiceValidationField, string>>;
};

const FIELD_ORDER: InvoiceValidationField[] = [
  "companyDetails",
  "invoiceNumber",
  "billTo",
  "lineItems",
  "dueDate",
  "paymentTerms",
];

export function hasValidationErrors(result: InvoiceValidationResult): boolean {
  return Object.keys(result.fieldErrors).length > 0;
}

export function firstValidationErrorField(
  result: InvoiceValidationResult,
): InvoiceValidationField | undefined {
  return FIELD_ORDER.find((field) => result.fieldErrors[field]);
}

export function validateInvoiceForExport(
  state: InvoiceState,
): InvoiceValidationResult {
  const fieldErrors: Partial<Record<InvoiceValidationField, string>> = {};
  const fieldWarnings: Partial<Record<InvoiceValidationField, string>> = {};

  if (!state.companyName.trim() && !state.companyAddress.trim()) {
    fieldErrors.companyDetails = "Add your company name or address.";
  }
  if (!state.billTo.trim()) {
    fieldErrors.billTo = "Bill To is required.";
  }
  if (!state.invoiceNumber.trim()) {
    fieldErrors.invoiceNumber = "Invoice number is required.";
  }

  const hasValidLine = state.lineItems.some(
    (item) => item.name.trim().length > 0 && item.rate > 0,
  );
  if (!hasValidLine) {
    fieldErrors.lineItems =
      "Add at least one line item with a name and rate greater than zero.";
  }

  if (!state.dueDate.trim()) {
    fieldWarnings.dueDate = "Due date is not set.";
  }
  if (!state.paymentTerms.trim()) {
    fieldWarnings.paymentTerms = "Payment terms are not set.";
  }

  return { fieldErrors, fieldWarnings };
}
