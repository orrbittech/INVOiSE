import type { TemplateProps } from "@/components/templates/template-shared";
import {
  BankDetailsLine,
  CompanyBesideLogo,
  CompanyLegalDetails,
  InvoiceTitleAndCode,
  LineItemDescription,
  LogoOrPlaceholder,
  TotalsBlock,
} from "@/components/templates/template-shared";
import { pdf } from "@/components/templates/pdf-safe-styles";
import { formatMoney } from "@/lib/format-money";
import { computeLineAmount } from "@/lib/invoice-math";
import { getDisplayTerms } from "@/lib/template-terms";

export function ProfessionalTemplate({ data }: TemplateProps) {
  const accent = data.accentColor;
  const displayTerms = getDisplayTerms(data.templateId, data.terms);

  return (
    <div className={pdf.text}>
      <div className="mb-8 flex items-start justify-between">
        <div className={`whitespace-pre-line text-sm ${pdf.textMuted}`}>
          {data.companyAddress || null}
        </div>
        <div className="flex items-center gap-4">
          <CompanyBesideLogo
            data={data}
            nameClassName="text-xl font-bold"
            emailClassName={`text-sm ${pdf.textMuted}`}
          />
          <LogoOrPlaceholder logoDataUrl={data.logoDataUrl} />
        </div>
      </div>

      <div className="mb-8 grid grid-cols-2 gap-8 text-sm">
        <div>
          <div className={`mb-1 text-xs font-semibold uppercase ${pdf.textLight}`}>
            Bill To
          </div>
          <div className="whitespace-pre-line">{data.billTo || "—"}</div>
        </div>
        <div className="text-sm">
          <InvoiceTitleAndCode
            data={data}
            titleClassName={`text-2xl font-light ${pdf.textLight}`}
            codeClassName="text-sm font-medium"
          />
          <div className="mt-4 grid grid-cols-2 gap-4">
          <MetaField label="Date" value={data.invoiceDate} />
          <MetaField label="Due Date" value={data.dueDate} />
          <MetaField label="PO Number" value={data.poNumber} />
          </div>
        </div>
      </div>

      <table className={`w-full border-collapse border text-sm ${pdf.border} ${pdf.text}`}>
        <thead>
          <tr className={pdf.bgMuted}>
            <th className={`border px-3 py-2 text-left ${pdf.border}`}>Item</th>
            <th className={`border px-3 py-2 text-center w-20 ${pdf.border}`}>
              Qty
            </th>
            <th className={`border px-3 py-2 text-right w-28 ${pdf.border}`}>
              Rate
            </th>
            <th className={`border px-3 py-2 text-right w-28 ${pdf.border}`}>
              Amount
            </th>
          </tr>
        </thead>
        <tbody>
          {data.lineItems.map((item) => (
            <tr key={item.id}>
              <td className={`border px-3 py-2 ${pdf.border}`}>
                <LineItemDescription
                  name={item.name}
                  description={item.description}
                />
              </td>
              <td className={`border px-3 py-2 text-center ${pdf.border}`}>
                {item.quantity}
              </td>
              <td className={`border px-3 py-2 text-right ${pdf.border}`}>
                {formatMoney(item.rate, data.currencySymbol)}
              </td>
              <td className={`border px-3 py-2 text-right ${pdf.border}`}>
                {formatMoney(
                  computeLineAmount(item),
                  data.currencySymbol,
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="mt-6 flex justify-end">
        <TotalsBlock data={data} />
      </div>

      <div className="mt-4">
        <BankDetailsLine data={data} />
      </div>

      <div className={`mt-8 grid grid-cols-2 gap-8 border-t pt-6 text-sm ${pdf.border}`}>
        <div>
          <div className="mb-2 font-semibold" style={{ color: accent }}>
            Notes
          </div>
          <div className={`whitespace-pre-line ${pdf.textMuted}`}>
            {data.notes || "—"}
          </div>
        </div>
        <div>
          <div className="mb-2 font-semibold" style={{ color: accent }}>
            Terms
          </div>
          <div className={`whitespace-pre-line ${pdf.textMuted}`}>
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

function MetaField({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <div className={`text-xs ${pdf.textLight}`}>{label}</div>
      <div className="font-medium">{value || "—"}</div>
    </div>
  );
}
