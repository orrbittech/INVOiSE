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

export function CompanyContactHeader({ data }: TemplateProps) {
  return (
    <div className="mb-6 flex items-start justify-between gap-6">
      <LogoOrPlaceholder logoDataUrl={data.logoDataUrl} />
      <div className="text-right text-sm">
        <div className="text-xl font-bold">{data.companyName || "Your Company"}</div>
        {data.companyPhone.trim() ? (
          <div className={pdf.textMuted}>{data.companyPhone}</div>
        ) : null}
        {data.companyAddress.trim() ? (
          <div className={`mt-1 whitespace-pre-line ${pdf.textMuted}`}>
            {data.companyAddress}
          </div>
        ) : null}
        {!data.companyPhone.trim() && !data.companyAddress.trim() && data.companyEmail.trim() ? (
          <div className={pdf.textMuted}>{data.companyEmail}</div>
        ) : null}
      </div>
    </div>
  );
}

export function BillingMetaStrip({ data }: TemplateProps) {
  const accent = data.accentColor;
  const { totals, currencySymbol } = data;

  return (
    <div className="mb-6 grid grid-cols-4 gap-4 text-sm">
      <div>
        <div className="mb-1 text-xs font-bold uppercase" style={{ color: accent }}>
          Billed To
        </div>
        <div className="whitespace-pre-line">{data.billTo || "—"}</div>
      </div>
      <div>
        <div className="mb-1 text-xs font-bold uppercase" style={{ color: accent }}>
          Dates
        </div>
        <div className="space-y-1">
          <div>
            <span className={pdf.textLight}>Date of Issue: </span>
            {data.invoiceDate || "—"}
          </div>
          <div>
            <span className={pdf.textLight}>Due Date: </span>
            {data.dueDate || "—"}
          </div>
        </div>
      </div>
      <div>
        <div className="mb-1 text-xs font-bold uppercase" style={{ color: accent }}>
          Invoice Number
        </div>
        <div className="font-medium">{data.invoiceNumber || "—"}</div>
      </div>
      <div>
        <div className="mb-1 text-xs font-bold uppercase" style={{ color: accent }}>
          Amount Due ({data.currencyCode})
        </div>
        <div className="text-2xl font-bold" style={{ color: accent }}>
          {formatMoney(totals.balanceDue, currencySymbol)}
        </div>
      </div>
    </div>
  );
}

export function VerticalSideLabel({
  label,
  className = "",
}: {
  label: string;
  className?: string;
}) {
  return (
    <div
      className={`absolute left-0 top-8 origin-top-left -rotate-90 text-xs font-bold uppercase tracking-widest ${pdf.textLight} ${className}`}
      style={{ transformOrigin: "top left" }}
    >
      {label}
    </div>
  );
}

export function PaymentFooterBar({
  data,
  terms,
}: TemplateProps & { terms: string }) {
  const accent = data.accentColor;
  const bankParts = [
    data.bankName.trim(),
    data.sortCode.trim() ? `Sort: ${data.sortCode}` : "",
    data.accountNumber.trim() ? `Acc: ${data.accountNumber}` : "",
  ].filter(Boolean);

  return (
    <div
      className="-mx-8 -mb-8 mt-10 px-8 py-6 text-[#ffffff]"
      style={{ backgroundColor: accent }}
    >
      <div className="grid grid-cols-2 gap-8 text-sm">
        <div>
          <div className="mb-2 text-xs font-bold uppercase tracking-wide">
            Payment Info
          </div>
          {bankParts.length > 0 ? (
            <div className="space-y-1 text-[#ffffff]/90">
              {bankParts.map((part) => (
                <div key={part}>{part}</div>
              ))}
            </div>
          ) : (
            <div className="text-[#ffffff]/90">—</div>
          )}
        </div>
        <div>
          <div className="mb-2 text-xs font-bold uppercase tracking-wide">
            Terms & Conditions
          </div>
          <div className="whitespace-pre-line text-xs leading-relaxed text-[#ffffff]/90">
            {terms}
          </div>
        </div>
      </div>
    </div>
  );
}

export function AccentDivider({ color }: { color: string }) {
  return (
    <div className="mb-6 h-0.5 w-full" style={{ backgroundColor: color }} />
  );
}

export function LineItemsTable({
  data,
  headerClassName,
  rowClassName,
  headerStyle = "filled",
  columnOrder = "qty-description-rate-amount",
  cellClassName,
}: TemplateProps & {
  headerClassName?: string;
  rowClassName?: string;
  headerStyle?: "filled" | "text";
  columnOrder?: "qty-description-rate-amount" | "description-rate-qty-amount";
  cellClassName?: string;
}) {
  const { accentColor } = data;
  const headerStyleProps =
    headerStyle === "filled"
      ? { backgroundColor: accentColor, color: "#ffffff" }
      : { color: accentColor };

  const thBase =
    headerStyle === "filled"
      ? "px-3 py-2 font-semibold"
      : "border-b-2 px-3 py-2 font-semibold";

  const headers =
    columnOrder === "description-rate-qty-amount"
      ? [
          { label: "Description", className: `${thBase} text-left` },
          { label: "Rate", className: `${thBase} text-right` },
          { label: "Qty", className: `${thBase} text-right` },
          { label: "Line Total", className: `${thBase} text-right` },
        ]
      : [
          { label: "QTY", className: `${thBase} text-left` },
          { label: "DESCRIPTION", className: `${thBase} text-left` },
          { label: "UNIT PRICE", className: `${thBase} text-right` },
          { label: "AMOUNT", className: `${thBase} text-right` },
        ];

  return (
    <table className={`w-full border-collapse text-sm ${pdf.text}`}>
      <thead>
        <tr className={headerClassName} style={headerStyleProps}>
          {headers.map((h) => (
            <th
              key={h.label}
              className={h.className}
              style={
                headerStyle === "text"
                  ? { borderColor: accentColor, color: accentColor }
                  : undefined
              }
            >
              {h.label}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {data.lineItems.map((item) => {
          const tdClass = `px-3 py-3 align-top ${cellClassName ?? ""}`;
          return (
          <tr
            key={item.id}
            className={
              rowClassName ??
              (headerStyle === "text" ? `border-b ${pdf.border}` : undefined)
            }
          >
            {columnOrder === "description-rate-qty-amount" ? (
              <>
                <td className={tdClass}>
                  <LineItemDescription
                    name={item.name}
                    description={item.description}
                  />
                </td>
                <td className={`${tdClass} text-right`}>
                  {formatMoney(item.rate, data.currencySymbol)}
                </td>
                <td className={`${tdClass} text-right`}>{item.quantity}</td>
                <td className={`${tdClass} text-right`}>
                  {formatMoney(computeLineAmount(item), data.currencySymbol)}
                </td>
              </>
            ) : (
              <>
                <td className={tdClass}>{item.quantity}</td>
                <td className={tdClass}>
                  <LineItemDescription
                    name={item.name}
                    description={item.description}
                  />
                </td>
                <td className={`${tdClass} text-right`}>
                  {formatMoney(item.rate, data.currencySymbol)}
                </td>
                <td className={`${tdClass} text-right`}>
                  {formatMoney(computeLineAmount(item), data.currencySymbol)}
                </td>
              </>
            )}
          </tr>
          );
        })}
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
