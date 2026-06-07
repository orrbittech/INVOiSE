import type { TemplateProps } from "@/components/templates/template-shared";
import {
  CompanyLegalDetails,
  LineItemDescription,
  LogoOrPlaceholder,
  TotalsBlock,
  VerticalSideLabel,
} from "@/components/templates/template-shared";
import { pdf } from "@/components/templates/pdf-safe-styles";
import { formatMoney } from "@/lib/format-money";
import { computeLineAmount } from "@/lib/invoice-math";
import { getDisplayTerms } from "@/lib/template-terms";

export function MinimalTemplate({ data }: TemplateProps) {
  const accent = data.accentColor;
  const displayTerms = getDisplayTerms(data.templateId, data.terms);

  return (
    <div className={`relative pl-8 ${pdf.text}`}>
      <VerticalSideLabel label={`Invoice No. ${data.invoiceNumber || "—"}`} />

      <div className="mb-8 flex items-start justify-between gap-6">
        <LogoOrPlaceholder logoDataUrl={data.logoDataUrl} />
        <div className="text-right text-sm">
          <div className={`mb-1 text-xs font-bold uppercase ${pdf.textLight}`}>
            Bill To
          </div>
          <div className="whitespace-pre-line">{data.billTo || "—"}</div>
          {data.dueDate ? (
            <div className="mt-3">
              <span className={`text-xs ${pdf.textLight}`}>Due: </span>
              <span className="font-medium">{data.dueDate}</span>
            </div>
          ) : null}
        </div>
      </div>

      <div className="mb-6">
        <div className="text-3xl font-bold">INVOICE</div>
        <div className="text-lg font-bold" style={{ color: accent }}>
          #{data.invoiceNumber || "—"}
        </div>
        {data.invoiceDate ? (
          <div className={`mt-1 text-sm ${pdf.textMuted}`}>
            Date: {data.invoiceDate}
          </div>
        ) : null}
      </div>

      <div
        className={`mb-6 border-t border-dashed ${pdf.borderStrong}`}
        style={{ borderTopWidth: "2px" }}
      />

      <table
        className={`w-full border-collapse border-2 text-sm ${pdf.borderStrong} ${pdf.text}`}
      >
        <thead>
          <tr className={pdf.bgMuted}>
            <th className={`border-2 px-3 py-2 text-left font-bold ${pdf.borderStrong}`}>
              Description
            </th>
            <th
              className={`w-20 border-2 px-3 py-2 text-center font-bold ${pdf.borderStrong}`}
            >
              Qty
            </th>
            <th
              className={`w-28 border-2 px-3 py-2 text-right font-bold ${pdf.borderStrong}`}
            >
              Rate
            </th>
            <th
              className={`w-28 border-2 px-3 py-2 text-right font-bold ${pdf.borderStrong}`}
            >
              Total
            </th>
          </tr>
        </thead>
        <tbody>
          {data.lineItems.map((item) => (
            <tr key={item.id}>
              <td className={`border-2 px-3 py-2 ${pdf.borderStrong}`}>
                <LineItemDescription
                  name={item.name}
                  description={item.description}
                />
              </td>
              <td className={`border-2 px-3 py-2 text-center ${pdf.borderStrong}`}>
                {item.quantity}
              </td>
              <td className={`border-2 px-3 py-2 text-right ${pdf.borderStrong}`}>
                {formatMoney(item.rate, data.currencySymbol)}
              </td>
              <td className={`border-2 px-3 py-2 text-right ${pdf.borderStrong}`}>
                {formatMoney(computeLineAmount(item), data.currencySymbol)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="mt-6 flex justify-end">
        <TotalsBlock data={data} />
      </div>

      <div
        className={`mt-8 grid grid-cols-2 gap-8 border-t-2 pt-6 ${pdf.borderStrong}`}
      >
        <div>
          <div className="mb-2 text-sm font-bold">Notes</div>
          <div className={`whitespace-pre-line text-sm ${pdf.textMuted}`}>
            {data.notes || "—"}
          </div>
        </div>
        <div>
          <div className="mb-2 text-sm font-bold">Terms</div>
          <div className={`whitespace-pre-line text-sm ${pdf.textMuted}`}>
            {displayTerms}
          </div>
          <div className="mt-4">
            <CompanyLegalDetails data={data} />
          </div>
        </div>
      </div>
    </div>
  );
}
