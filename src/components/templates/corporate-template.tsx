import type { TemplateProps } from "@/components/templates/template-shared";
import {
  BankDetailsLine,
  CompanyBesideLogo,
  CompanyLegalDetails,
  InvoiceTitleAndCode,
  LineItemsTable,
  LogoOrPlaceholder,
} from "@/components/templates/template-shared";
import { pdf } from "@/components/templates/pdf-safe-styles";
import { formatMoney } from "@/lib/format-money";
import { getDisplayTerms } from "@/lib/template-terms";

export function CorporateTemplate({ data }: TemplateProps) {
  const accent = data.accentColor;
  const { totals, currencySymbol } = data;
  const displayTerms = getDisplayTerms(data.templateId, data.terms);

  return (
    <div className={pdf.text}>
      <div
        className="-mx-8 -mt-8 mb-8 px-8 py-4 text-[#ffffff]"
        style={{ backgroundColor: accent }}
      >
        <div className="flex items-center justify-end">
          <div className="flex items-center gap-4">
            <CompanyBesideLogo data={data} />
            <LogoOrPlaceholder logoDataUrl={data.logoDataUrl} />
          </div>
        </div>
      </div>

      <div className="mb-8 grid grid-cols-3 gap-6 text-sm">
        <div>
          <div
            className="mb-2 text-xs font-bold uppercase"
            style={{ color: accent }}
          >
            Bill To
          </div>
          <div className="whitespace-pre-line">{data.billTo || "—"}</div>
        </div>
        <div>
          <div
            className="mb-2 text-xs font-bold uppercase"
            style={{ color: accent }}
          >
            Ship To
          </div>
          <div className="whitespace-pre-line">{data.shipTo || "—"}</div>
        </div>
        <div className="text-sm">
          <InvoiceTitleAndCode data={data} />
          <div className="mt-4 space-y-1">
          <div>
            <span className="font-bold" style={{ color: accent }}>
              Date:{" "}
            </span>
            {data.invoiceDate}
          </div>
          <div>
            <span className="font-bold" style={{ color: accent }}>
              Due:{" "}
            </span>
            {data.dueDate || "—"}
          </div>
          <div>
            <span className="font-bold" style={{ color: accent }}>
              PO:{" "}
            </span>
            {data.poNumber || "—"}
          </div>
          </div>
        </div>
      </div>

      <div
        className={`mb-6 flex items-end justify-between border-b-2 pb-3 ${pdf.borderStrong}`}
      >
        <span className="text-lg font-semibold">Invoice Total</span>
        <span className="text-2xl font-bold">
          {formatMoney(totals.total, currencySymbol)}
        </span>
      </div>

      <LineItemsTable
        data={data}
        rowClassName={`border-b even:bg-[#fafafa] ${pdf.border}`}
      />

      <div className="mt-6 flex justify-end">
        <div className={`ml-auto w-64 space-y-1 text-sm ${pdf.text}`}>
          <div className="flex justify-between">
            <span>Subtotal</span>
            <span>{formatMoney(totals.subtotal, currencySymbol)}</span>
          </div>
          {data.taxEnabled ? (
            <div className="flex justify-between">
              <span>Tax ({data.taxRate}%)</span>
              <span>{formatMoney(totals.taxAmount, currencySymbol)}</span>
            </div>
          ) : null}
          <div
            className={`flex justify-between border-t-2 pt-2 text-lg font-bold ${pdf.borderStrong}`}
          >
            <span>TOTAL</span>
            <span>{formatMoney(totals.total, currencySymbol)}</span>
          </div>
        </div>
      </div>

      <div className="mt-4">
        <BankDetailsLine data={data} />
      </div>

      <div className="mt-8">
        <div
          className="mb-2 text-xs font-bold uppercase"
          style={{ color: accent }}
        >
          Terms & Conditions
        </div>
        <div className={`whitespace-pre-line text-sm ${pdf.textMuted}`}>
          {displayTerms}
        </div>
        <div className="mt-3">
          <CompanyLegalDetails data={data} />
        </div>
      </div>

      <div
        className="-mx-8 -mb-8 mt-10 h-3"
        style={{ backgroundColor: accent }}
        aria-hidden
      />
    </div>
  );
}
