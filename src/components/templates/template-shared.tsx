import type { InvoiceTemplateData } from "@/types/invoice";
import { getOrrbitLegalBlurb } from "@/lib/company-legal-blurb";
import { formatMoney } from "@/lib/format-money";
import { computeLineAmount } from "@/lib/invoice-math";
import { pdf } from "@/components/templates/pdf-safe-styles";

export type TemplateProps = {
  data: InvoiceTemplateData;
};

export function CompanyBesideLogo({
  data,
  nameClassName = "text-2xl font-bold",
  emailClassName = "text-sm",
  align = "right",
}: {
  data: InvoiceTemplateData;
  nameClassName?: string;
  emailClassName?: string;
  align?: "left" | "right";
}) {
  const alignClass = align === "right" ? "text-right" : "text-left";

  return (
    <div className={alignClass}>
      <div className={nameClassName}>{data.companyName || "Your Company"}</div>
      <div className={emailClassName}>
        {data.companyEmail.trim() ? data.companyEmail : "—"}
      </div>
    </div>
  );
}

export function InvoiceTitleAndCode({
  data,
  titleClassName = "text-2xl font-bold",
  codeClassName = "text-sm",
  align = "right",
}: {
  data: InvoiceTemplateData;
  titleClassName?: string;
  codeClassName?: string;
  align?: "left" | "right";
}) {
  const alignClass = align === "right" ? "text-right" : "text-left";

  return (
    <div className={alignClass}>
      <div className={titleClassName}>{data.invoiceTitle}</div>
      <div className={codeClassName}>{data.invoiceNumber || "—"}</div>
    </div>
  );
}

export function LogoOrPlaceholder({
  logoDataUrl,
  className = "",
}: {
  logoDataUrl: string | null;
  className?: string;
}) {
  if (logoDataUrl) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={logoDataUrl}
        alt="Company logo"
        className={`h-16 w-16 rounded-full object-cover ${className}`}
      />
    );
  }

  return (
    <div
      className={`flex h-16 w-16 items-center justify-center rounded-full ${pdf.bgPlaceholder} text-xs font-semibold text-[#ffffff] ${className}`}
    >
      LOGO
    </div>
  );
}

export function LineItemDescription({
  name,
  description,
}: {
  name: string;
  description: string;
}) {
  return (
    <>
      <div className="font-medium">{name || "—"}</div>
      {description ? (
        <div className={`mt-0.5 text-xs leading-snug ${pdf.textMuted}`}>
          {description}
        </div>
      ) : null}
    </>
  );
}

export function LineItemsTable({
  data,
  headerClassName,
  rowClassName,
}: TemplateProps & {
  headerClassName?: string;
  rowClassName?: string;
}) {
  const { accentColor } = data;

  return (
    <table className={`w-full border-collapse text-sm ${pdf.text}`}>
      <thead>
        <tr
          className={headerClassName}
          style={{ backgroundColor: accentColor, color: "#ffffff" }}
        >
          <th className="px-3 py-2 text-left font-semibold">QTY</th>
          <th className="px-3 py-2 text-left font-semibold">DESCRIPTION</th>
          <th className="px-3 py-2 text-right font-semibold">UNIT PRICE</th>
          <th className="px-3 py-2 text-right font-semibold">AMOUNT</th>
        </tr>
      </thead>
      <tbody>
        {data.lineItems.map((item) => (
          <tr key={item.id} className={rowClassName}>
            <td className="px-3 py-3 align-top">{item.quantity}</td>
            <td className="px-3 py-3 align-top">
              <LineItemDescription
                name={item.name}
                description={item.description}
              />
            </td>
            <td className="px-3 py-3 text-right align-top">
              {formatMoney(item.rate, data.currencySymbol)}
            </td>
            <td className="px-3 py-3 text-right align-top">
              {formatMoney(
                computeLineAmount(item),
                data.currencySymbol,
              )}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export function TotalsBlock({ data }: TemplateProps) {
  const { totals, currencySymbol, taxRate, taxEnabled } = data;

  return (
    <div className={`ml-auto w-64 space-y-1 text-sm ${pdf.text}`}>
      <div className="flex justify-between">
        <span>Subtotal</span>
        <span>{formatMoney(totals.subtotal, currencySymbol)}</span>
      </div>
      {data.discountEnabled && totals.discountValue > 0 ? (
        <div className="flex justify-between text-[#15803d]">
          <span>Discount</span>
          <span>-{formatMoney(totals.discountValue, currencySymbol)}</span>
        </div>
      ) : null}
      {taxEnabled ? (
        <div className="flex justify-between">
          <span>VAT {taxRate.toFixed(1)}%</span>
          <span>{formatMoney(totals.taxAmount, currencySymbol)}</span>
        </div>
      ) : null}
      {data.shippingEnabled && totals.shippingValue > 0 ? (
        <div className="flex justify-between">
          <span>Shipping</span>
          <span>{formatMoney(totals.shippingValue, currencySymbol)}</span>
        </div>
      ) : null}
      <div
        className={`flex justify-between border-t pt-2 text-base font-bold ${pdf.border}`}
      >
        <span>TOTAL</span>
        <span>{formatMoney(totals.total, currencySymbol)}</span>
      </div>
      {data.amountPaid > 0 ? (
        <div className="flex justify-between">
          <span>Amount Paid</span>
          <span>{formatMoney(data.amountPaid, currencySymbol)}</span>
        </div>
      ) : null}
      <div
        className={`flex justify-between border-t pt-2 text-lg font-bold ${pdf.borderStrong}`}
      >
        <span>Balance Due</span>
        <span>{formatMoney(totals.balanceDue, currencySymbol)}</span>
      </div>
    </div>
  );
}

export function CompanyLegalDetails({ data }: TemplateProps) {
  return (
    <p className={`text-xs leading-relaxed ${pdf.textMuted}`}>
      {getOrrbitLegalBlurb(data)}
    </p>
  );
}

export function BankDetailsLine({ data }: TemplateProps) {
  const parts = [
    data.companyName.trim(),
    data.bankName.trim(),
    data.accountNumber.trim(),
  ].filter(Boolean);

  if (parts.length === 0) return null;

  return (
    <p className={`text-xs ${pdf.textMuted}`}>{parts.join(" · ")}</p>
  );
}
