import type { TemplateProps } from "@/components/templates/template-shared";
import {
  CompanyLegalDetails,
  LineItemsTable,
  PaymentFooterBar,
  TotalsBlock,
} from "@/components/templates/template-shared";
import { pdf } from "@/components/templates/pdf-safe-styles";
import { getDisplayTerms } from "@/lib/template-terms";

export function ExecutiveTemplate({ data }: TemplateProps) {
  const accent = data.accentColor;
  const displayTerms = getDisplayTerms(data.templateId, data.terms);

  const paymentParts = [
    data.companyName.trim(),
    data.bankName.trim(),
    data.accountNumber.trim(),
  ].filter(Boolean);

  return (
    <div className={`relative ${pdf.text}`}>
      <div
        className="pointer-events-none absolute right-0 top-0 h-16 w-16 rounded-full border-2 border-dashed opacity-30"
        style={{ borderColor: accent }}
        aria-hidden
      />

      <div className="mb-8 flex items-end justify-between">
        <div className="text-3xl font-bold" style={{ color: accent }}>
          {data.invoiceTitle}
        </div>
        <div className="text-right text-sm">
          <div className={`text-xs font-bold uppercase ${pdf.textLight}`}>
            Order #
          </div>
          <div className="text-lg font-bold">{data.invoiceNumber || "—"}</div>
        </div>
      </div>

      <div className="mb-8 grid grid-cols-2 gap-8 text-sm">
        <div>
          <div
            className="mb-2 text-xs font-bold uppercase"
            style={{ color: accent }}
          >
            Payment To
          </div>
          {paymentParts.length > 0 ? (
            <div className="space-y-1">
              {paymentParts.map((part) => (
                <div key={part}>{part}</div>
              ))}
              {data.sortCode.trim() ? (
                <div className={pdf.textMuted}>Sort: {data.sortCode}</div>
              ) : null}
            </div>
          ) : (
            <div className={pdf.textMuted}>—</div>
          )}
        </div>
        <div>
          <div
            className="mb-2 text-xs font-bold uppercase"
            style={{ color: accent }}
          >
            Billed To
          </div>
          <div className="whitespace-pre-line">{data.billTo || "—"}</div>
          {data.invoiceDate || data.dueDate ? (
            <div className={`mt-3 space-y-1 text-xs ${pdf.textMuted}`}>
              {data.invoiceDate ? <div>Date: {data.invoiceDate}</div> : null}
              {data.dueDate ? <div>Due: {data.dueDate}</div> : null}
            </div>
          ) : null}
        </div>
      </div>

      <LineItemsTable
        data={data}
        headerStyle="filled"
        rowClassName={`border-b even:bg-[#f0f4f8] ${pdf.border}`}
      />

      <div className="mt-6 flex justify-end">
        <TotalsBlock data={data} />
      </div>

      <div className="mt-6">
        <CompanyLegalDetails data={data} />
      </div>

      <PaymentFooterBar data={data} terms={displayTerms} />
    </div>
  );
}
