"use client";

import { Plus, Upload, X } from "lucide-react";
import { useState, type ReactNode } from "react";
import { useInvoiceStore } from "@/store/invoice-store";
import { useHydrated } from "@/hooks/use-hydrated";
import { BBBEE_LEVEL_OPTIONS } from "@/lib/bbbee-levels";
import {
  isPresetPaymentTerm,
  PAYMENT_TERM_OPTIONS,
} from "@/lib/payment-terms";
import { readFileAsDataUrl } from "@/lib/read-file-as-data-url";
import { formatMoney, lineItemAmount } from "@/lib/format-money";
import { getCurrencySymbol } from "@/lib/currencies";
import { computeTotals } from "@/lib/invoice-math";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { DatePickerField } from "@/components/ui/date-picker-field";
import { FormField } from "@/components/ui/form-field";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import type { InvoiceValidationField } from "@/lib/validate-invoice";

type InvoiceEditorProps = {
  fieldErrors: Partial<Record<InvoiceValidationField, string>>;
  fieldWarnings: Partial<Record<InvoiceValidationField, string>>;
  onClearFieldError: (field: InvoiceValidationField) => void;
  onClearFieldWarning: (field: InvoiceValidationField) => void;
};

function hasValidLineItems(
  lineItems: { name: string; rate: number }[],
): boolean {
  return lineItems.some(
    (item) => item.name.trim().length > 0 && item.rate > 0,
  );
}

export function InvoiceEditor({
  fieldErrors,
  fieldWarnings,
  onClearFieldError,
  onClearFieldWarning,
}: InvoiceEditorProps) {
  const hydrated = useHydrated();
  const store = useInvoiceStore();
  const symbol = getCurrencySymbol(store.currencyCode);
  const totals = computeTotals(store);
  const [fileError, setFileError] = useState<string | null>(null);
  const paymentSelectValue = isPresetPaymentTerm(store.paymentTerms)
    ? store.paymentTerms
    : store.paymentTerms
      ? "Custom"
      : "";

  if (!hydrated) {
    return (
      <div className="rounded-lg border border-border bg-card p-8 text-muted-foreground">
        Loading your invoice…
      </div>
    );
  }

  async function handleLogoUpload(file: File | undefined) {
    if (!file) return;
    const { dataUrl, error } = await readFileAsDataUrl(file);
    setFileError(error ?? null);
    if (dataUrl) {
      store.setField("logoDataUrl", dataUrl);
      store.setField("logoFileName", file.name);
    }
  }

  function clearLogo() {
    store.setField("logoDataUrl", null);
    store.setField("logoFileName", null);
  }

  async function handleSignatureUpload(file: File | undefined) {
    if (!file) return;
    const { dataUrl, error } = await readFileAsDataUrl(file);
    setFileError(error ?? null);
    if (dataUrl) store.setField("signatureDataUrl", dataUrl);
  }

  function maybeClearCompanyDetails(address: string, name: string) {
    if (address.trim() || name.trim()) {
      onClearFieldError("companyDetails");
    }
  }

  function maybeClearLineItems() {
    if (hasValidLineItems(useInvoiceStore.getState().lineItems)) {
      onClearFieldError("lineItems");
    }
  }

  return (
    <div className="rounded-lg border border-border bg-card p-6">
      {fileError ? (
        <Alert className="mb-4 border-border">
          <AlertDescription>{fileError}</AlertDescription>
        </Alert>
      ) : null}

      <div className="mb-6 flex flex-wrap items-start justify-between gap-4">
        <div className="flex flex-col gap-2">
          <label className="relative flex h-28 w-28 cursor-pointer flex-col items-center justify-center rounded-md border-2 border-dashed border-border text-center hover:border-foreground/40">
            {store.logoDataUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={store.logoDataUrl}
                alt="Logo"
                className="h-full w-full rounded-md object-contain p-1"
              />
            ) : (
              <>
                <Upload className="mb-1 size-6 text-muted-foreground" />
                <span className="text-xs italic text-muted-foreground">
                  Add your logo
                </span>
              </>
            )}
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => handleLogoUpload(e.target.files?.[0])}
            />
          </label>
          {store.logoFileName ? (
            <div className="flex max-w-28 items-center gap-1">
              <span
                className="truncate text-xs text-muted-foreground"
                title={store.logoFileName}
              >
                {store.logoFileName}
              </span>
              <button
                type="button"
                onClick={clearLogo}
                className="text-muted-foreground hover:text-foreground"
                aria-label="Remove logo"
              >
                <X className="size-3" />
              </button>
            </div>
          ) : null}
        </div>
        <div
          className="flex min-w-[200px] flex-1 flex-col items-end gap-2"
          data-validation-field="invoiceNumber"
        >
          <Input
            value={store.invoiceTitle}
            onChange={(e) => store.setField("invoiceTitle", e.target.value)}
            className="text-right text-3xl font-bold uppercase tracking-wide"
            placeholder="INVOICE"
          />
          <div className="flex flex-col items-end gap-1.5">
            <div className="flex items-center gap-2">
              <span className="text-muted-foreground">#</span>
              <Input
                value={store.invoiceNumber}
                onChange={(e) => {
                  const value = e.target.value;
                  store.setField("invoiceNumber", value);
                  if (value.trim()) onClearFieldError("invoiceNumber");
                }}
                className="w-40 text-right"
                placeholder="INV-001"
                aria-invalid={Boolean(fieldErrors.invoiceNumber)}
              />
            </div>
            {fieldErrors.invoiceNumber ? (
              <p role="alert" className="text-sm text-destructive">
                {fieldErrors.invoiceNumber}
              </p>
            ) : null}
          </div>
        </div>
      </div>

      <div data-validation-field="companyDetails">
        <FormField
          label="Your company details"
          error={fieldErrors.companyDetails}
        >
          <Textarea
            value={store.companyAddress}
            onChange={(e) => {
              const value = e.target.value;
              store.setField("companyAddress", value);
              if (!store.companyName && value.split("\n")[0]) {
                store.setField("companyName", value.split("\n")[0]);
              }
              maybeClearCompanyDetails(value, store.companyName);
            }}
            placeholder="Company name and address"
            className="min-h-[100px] placeholder:italic"
            aria-invalid={Boolean(fieldErrors.companyDetails)}
          />
        </FormField>
      </div>

      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        <FormField label="Email">
          <Input
            type="email"
            value={store.companyEmail}
            onChange={(e) => store.setField("companyEmail", e.target.value)}
            placeholder="you@company.co.za"
            className="placeholder:italic"
          />
        </FormField>
        <FormField label="Cell phone">
          <Input
            type="tel"
            value={store.companyPhone}
            onChange={(e) => store.setField("companyPhone", e.target.value)}
            placeholder="+27 …"
            className="placeholder:italic"
          />
        </FormField>
        <FormField label="VAT / tax number">
          <Input
            value={store.taxId}
            onChange={(e) => store.setField("taxId", e.target.value)}
            placeholder="4123456789"
            className="placeholder:italic"
          />
        </FormField>
        <FormField label="Company registration no. (CK / IT)">
          <Input
            value={store.registrationNumber}
            onChange={(e) =>
              store.setField("registrationNumber", e.target.value)
            }
            placeholder="2020/123456/07"
            className="placeholder:italic"
          />
        </FormField>
        <FormField label="B-BBEE level">
          <Select
            value={store.bbbeeLevel || ""}
            onValueChange={(value) => {
              store.setField("bbbeeLevel", value ?? "");
            }}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select level" />
            </SelectTrigger>
            <SelectContent>
              {BBBEE_LEVEL_OPTIONS.filter(Boolean).map((level) => (
                <SelectItem key={level} value={level}>
                  {level}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </FormField>
      </div>

      <button
        type="button"
        className="mt-4 text-sm text-foreground underline underline-offset-2"
        onClick={() =>
          store.setField(
            "showAdditionalBusinessDetails",
            !store.showAdditionalBusinessDetails,
          )
        }
      >
        {store.showAdditionalBusinessDetails
          ? "Hide bank details"
          : "Show bank details"}
      </button>

      {store.showAdditionalBusinessDetails ? (
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <FormField label="Company name">
            <Input
              value={store.companyName}
              onChange={(e) => {
                const value = e.target.value;
                store.setField("companyName", value);
                maybeClearCompanyDetails(store.companyAddress, value);
              }}
            />
          </FormField>
          <FormField label="Business number">
            <Input
              value={store.businessNumber}
              onChange={(e) => store.setField("businessNumber", e.target.value)}
            />
          </FormField>
          <FormField label="Bank name">
            <Input
              value={store.bankName}
              onChange={(e) => store.setField("bankName", e.target.value)}
            />
          </FormField>
          <FormField label="Sort code">
            <Input
              value={store.sortCode}
              onChange={(e) => store.setField("sortCode", e.target.value)}
            />
          </FormField>
          <FormField label="Account number">
            <Input
              value={store.accountNumber}
              onChange={(e) => store.setField("accountNumber", e.target.value)}
            />
          </FormField>
        </div>
      ) : null}

      <div className="mt-6 grid gap-4 md:grid-cols-2">
        <div data-validation-field="billTo">
          <FormField label="Bill To" error={fieldErrors.billTo}>
            <Textarea
              value={store.billTo}
              onChange={(e) => {
                const value = e.target.value;
                store.setField("billTo", value);
                if (value.trim()) onClearFieldError("billTo");
              }}
              placeholder="Who is this to?"
              className="placeholder:italic"
              aria-invalid={Boolean(fieldErrors.billTo)}
            />
          </FormField>
        </div>
        <FormField label="Ship To (optional)">
          <Textarea
            value={store.shipTo}
            onChange={(e) => store.setField("shipTo", e.target.value)}
            placeholder="Shipping address"
            className="placeholder:italic"
          />
        </FormField>
      </div>

      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <FormField label="Date">
          <DatePickerField
            value={store.invoiceDate}
            onChange={(v) => store.setField("invoiceDate", v)}
            placeholder="Pick date"
          />
        </FormField>
        <div data-validation-field="paymentTerms">
          <FormField
            label="Payment Terms"
            warning={fieldWarnings.paymentTerms}
          >
            <Select
              value={paymentSelectValue}
              onValueChange={(value) => {
                if (!value) return;
                if (value === "Custom") {
                  if (isPresetPaymentTerm(store.paymentTerms)) {
                    store.setField("paymentTerms", "");
                  }
                } else {
                  store.setField("paymentTerms", value);
                  onClearFieldWarning("paymentTerms");
                }
              }}
            >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select terms" />
            </SelectTrigger>
            <SelectContent>
              {PAYMENT_TERM_OPTIONS.map((term) => (
                <SelectItem key={term} value={term}>
                  {term}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
            {paymentSelectValue === "Custom" ? (
              <Input
                className="mt-2 placeholder:italic"
                value={store.paymentTerms}
                onChange={(e) => {
                  const value = e.target.value;
                  store.setField("paymentTerms", value);
                  if (value.trim()) onClearFieldWarning("paymentTerms");
                }}
                placeholder="Enter custom terms"
              />
            ) : null}
          </FormField>
        </div>
        <div data-validation-field="dueDate">
          <FormField label="Due Date" warning={fieldWarnings.dueDate}>
            <DatePickerField
              value={store.dueDate}
              onChange={(v) => {
                store.setField("dueDate", v);
                if (v.trim()) onClearFieldWarning("dueDate");
              }}
              placeholder="Pick date"
            />
          </FormField>
        </div>
        <FormField label="PO Number">
          <Input
            value={store.poNumber}
            onChange={(e) => store.setField("poNumber", e.target.value)}
            placeholder="PO-000"
            className="placeholder:italic"
          />
        </FormField>
      </div>

      <div
        className="mt-8 overflow-x-auto"
        data-validation-field="lineItems"
      >
        <table className="w-full min-w-[600px] text-sm">
          <thead>
            <tr className="bg-black text-white">
              <th className="px-3 py-2 text-left">Item</th>
              <th className="w-24 px-3 py-2 text-left">Quantity</th>
              <th className="w-32 px-3 py-2 text-left">Rate</th>
              <th className="w-32 px-3 py-2 text-right">Amount</th>
              <th className="w-10" />
            </tr>
          </thead>
          <tbody>
            {store.lineItems.map((item, index) => (
              <tr key={item.id} className="border-b border-border">
                <td className="px-2 py-2 align-top">
                  <Input
                    value={item.name}
                    onChange={(e) => {
                      store.updateLineItem(item.id, { name: e.target.value });
                      maybeClearLineItems();
                    }}
                    className="mb-1 placeholder:italic"
                    placeholder="Item name"
                    aria-invalid={
                      Boolean(fieldErrors.lineItems) && index === 0
                    }
                  />
                  <Input
                    value={item.description}
                    onChange={(e) =>
                      store.updateLineItem(item.id, {
                        description: e.target.value,
                      })
                    }
                    className="text-xs placeholder:italic"
                    placeholder="Description of item/service…"
                  />
                </td>
                <td className="px-2 py-2 align-top">
                  <Input
                    type="number"
                    min={0}
                    value={item.quantity}
                    onChange={(e) => {
                      store.updateLineItem(item.id, {
                        quantity: Number(e.target.value) || 0,
                      });
                      maybeClearLineItems();
                    }}
                  />
                </td>
                <td className="px-2 py-2 align-top">
                  <div className="flex items-center rounded-lg border border-input">
                    <span className="pl-2 text-muted-foreground">{symbol}</span>
                    <Input
                      type="number"
                      min={0}
                      step="0.01"
                      value={item.rate}
                      onChange={(e) => {
                        store.updateLineItem(item.id, {
                          rate: Number(e.target.value) || 0,
                        });
                        maybeClearLineItems();
                      }}
                      className="border-0 focus-visible:ring-0"
                      aria-invalid={
                        Boolean(fieldErrors.lineItems) && index === 0
                      }
                    />
                  </div>
                </td>
                <td className="px-3 py-2 text-right align-top text-foreground">
                  {formatMoney(
                    lineItemAmount(item.quantity, item.rate),
                    symbol,
                  )}
                </td>
                <td className="px-1 py-2 align-top">
                  <button
                    type="button"
                    onClick={() => {
                      store.removeLineItem(item.id);
                      maybeClearLineItems();
                    }}
                    className="text-muted-foreground hover:text-destructive"
                    aria-label="Remove line item"
                  >
                    <X className="size-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <Button
          variant="outline"
          className="mt-3 border-foreground/20"
          onClick={() => {
            store.addLineItem();
            maybeClearLineItems();
          }}
        >
          <Plus data-icon="inline-start" />
          Line Item
        </Button>
        {fieldErrors.lineItems ? (
          <p role="alert" className="mt-2 text-sm text-destructive">
            {fieldErrors.lineItems}
          </p>
        ) : null}
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        <FormField label="Notes">
          <Textarea
            value={store.notes}
            onChange={(e) => store.setField("notes", e.target.value)}
            placeholder="Notes - any relevant information not already covered"
            className="min-h-[120px] placeholder:italic"
          />
        </FormField>
        <FormField label="Terms">
          <Textarea
            value={store.terms}
            onChange={(e) => store.setField("terms", e.target.value)}
            placeholder="Additional terms (template defaults apply in PDF)"
            className="min-h-[120px] placeholder:italic"
          />
        </FormField>
      </div>

      <div className="mt-8 flex flex-col items-end border-t border-border pt-6 text-sm">
        <div className="w-full max-w-sm space-y-2">
          <TotalRow label="Subtotal" value={formatMoney(totals.subtotal, symbol)} />

          <TotalsAdjustmentRow
            label="Tax"
            enabled={store.taxEnabled}
            onEnabledChange={(enabled) => store.setField("taxEnabled", enabled)}
            amount={formatMoney(totals.taxAmount, symbol)}
          >
            <Input
              type="number"
              min={0}
              value={store.taxRate}
              onChange={(e) =>
                store.setField("taxRate", Number(e.target.value) || 0)
              }
              disabled={!store.taxEnabled}
              className="w-16 text-right"
            />
            <span className="text-muted-foreground">%</span>
          </TotalsAdjustmentRow>

          {store.discountEnabled ? (
            <TotalsAdjustmentRow
              label="Discount"
              enabled={store.discountEnabled}
              onEnabledChange={(enabled) =>
                store.setField("discountEnabled", enabled)
              }
              amount={`-${formatMoney(totals.discountValue, symbol)}`}
            >
              <Input
                type="number"
                min={0}
                value={store.discountAmount}
                onChange={(e) =>
                  store.setField("discountAmount", Number(e.target.value) || 0)
                }
                className="w-20 text-right"
              />
              <label className="flex items-center gap-1 text-xs">
                <input
                  type="checkbox"
                  checked={store.discountIsPercent}
                  onChange={(e) =>
                    store.setField("discountIsPercent", e.target.checked)
                  }
                />
                %
              </label>
            </TotalsAdjustmentRow>
          ) : (
            <TotalsAdjustmentRow
              label="Discount"
              amount="—"
              showCheckbox={false}
            >
              <button
                type="button"
                className="text-foreground underline underline-offset-2"
                onClick={() => store.setField("discountEnabled", true)}
              >
                + Add discount
              </button>
            </TotalsAdjustmentRow>
          )}

          {store.shippingEnabled ? (
            <TotalsAdjustmentRow
              label="Shipping"
              enabled={store.shippingEnabled}
              onEnabledChange={(enabled) =>
                store.setField("shippingEnabled", enabled)
              }
              amount={formatMoney(totals.shippingValue, symbol)}
            >
              <Input
                type="number"
                min={0}
                value={store.shippingAmount}
                onChange={(e) =>
                  store.setField("shippingAmount", Number(e.target.value) || 0)
                }
                className="w-24 text-right"
              />
            </TotalsAdjustmentRow>
          ) : (
            <TotalsAdjustmentRow
              label="Shipping"
              amount="—"
              showCheckbox={false}
            >
              <button
                type="button"
                className="text-foreground underline underline-offset-2"
                onClick={() => store.setField("shippingEnabled", true)}
              >
                + Add shipping
              </button>
            </TotalsAdjustmentRow>
          )}

          <TotalRow
            label="Total"
            value={formatMoney(totals.total, symbol)}
            bold
          />

          <div className={totalsRowGridClass}>
            <span>Amount Paid</span>
            <div className="flex items-center justify-end rounded-lg border border-input">
              <span className="pl-2 text-muted-foreground">{symbol}</span>
              <Input
                type="number"
                min={0}
                step="0.01"
                value={store.amountPaid}
                onChange={(e) =>
                  store.setField("amountPaid", Number(e.target.value) || 0)
                }
                className="w-full max-w-[8rem] border-0 focus-visible:ring-0"
              />
            </div>
            <span />
          </div>

          <TotalRow
            label="Balance Due"
            value={formatMoney(totals.balanceDue, symbol)}
            bold
            large
          />
        </div>
      </div>

      <div className="mt-6 flex flex-wrap items-center gap-4">
        <label className="flex cursor-pointer items-center gap-2 text-sm text-muted-foreground">
          <Upload className="size-4" />
          <span className="font-medium text-foreground">Signature</span>
          <span className="italic">Upload</span>
          <input
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => handleSignatureUpload(e.target.files?.[0])}
          />
        </label>
        {store.signatureDataUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={store.signatureDataUrl}
            alt="Signature"
            className="h-12 object-contain"
          />
        ) : null}
        {store.signatureDataUrl ? (
          <Button
            variant="destructive"
            size="sm"
            className="bg-red-600 text-white hover:bg-red-700"
            onClick={() => store.setField("signatureDataUrl", null)}
          >
            Remove signature
          </Button>
        ) : null}
      </div>
    </div>
  );
}

const totalsRowGridClass =
  "grid w-full grid-cols-[5.5rem_1fr_7rem] items-center gap-x-3 gap-y-1";

function TotalRow({
  label,
  value,
  bold,
  large,
}: {
  label: string;
  value: string;
  bold?: boolean;
  large?: boolean;
}) {
  return (
    <div
      className={cn(
        totalsRowGridClass,
        bold && "font-semibold",
        large && "text-lg font-bold",
      )}
    >
      <span className="col-span-2">{label}</span>
      <span className="text-right tabular-nums">{value}</span>
    </div>
  );
}

function TotalsAdjustmentRow({
  label,
  enabled = true,
  onEnabledChange,
  showCheckbox = true,
  amount,
  children,
}: {
  label: string;
  enabled?: boolean;
  onEnabledChange?: (enabled: boolean) => void;
  showCheckbox?: boolean;
  amount: string;
  children: ReactNode;
}) {
  return (
    <div className={totalsRowGridClass}>
      <label className="flex items-center gap-2">
        {showCheckbox && onEnabledChange ? (
          <input
            type="checkbox"
            checked={enabled}
            onChange={(e) => onEnabledChange(e.target.checked)}
          />
        ) : null}
        <span>{label}</span>
      </label>
      <div className="flex items-center justify-end gap-2">{children}</div>
      <span className="text-right tabular-nums">{amount}</span>
    </div>
  );
}
