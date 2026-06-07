import type { TemplateProps } from "@/components/templates/template-shared";
import {
  AccentDivider,
  BankDetailsLine,
  BillingMetaStrip,
  CompanyContactHeader,
  CompanyLegalDetails,
  LineItemsTable,
  TotalsBlock,
} from "@/components/templates/template-shared";
import { pdf } from "@/components/templates/pdf-safe-styles";
import { getDisplayTerms } from "@/lib/template-terms";

export function ModernTemplate({ data }: TemplateProps) {
  const accent = data.accentColor;
  const displayTerms = getDisplayTerms(data.templateId, data.terms);

  return (
    <div className={pdf.text}>
      <CompanyContactHeader data={data} />

      <AccentDivider color={accent} />

      <BillingMetaStrip data={data} />

      <AccentDivider color={accent} />

      <LineItemsTable
        data={data}
        headerStyle="text"
        columnOrder="description-rate-qty-amount"
      />

      <div className="mt-6 flex justify-end">
        <TotalsBlock data={data} />
      </div>

      <div className="mt-4">
        <BankDetailsLine data={data} />
      </div>

      {data.signatureDataUrl ? (
        <div className="mt-6 flex justify-end">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={data.signatureDataUrl}
            alt="Signature"
            className="h-16 object-contain"
          />
        </div>
      ) : null}

      <div className="mt-8">
        <div
          className="mb-2 text-sm font-bold"
          style={{ color: accent }}
        >
          Terms
        </div>
        <div className={`whitespace-pre-line text-sm ${pdf.textMuted}`}>
          {displayTerms}
        </div>
        {data.notes ? (
          <div className={`mt-4 text-sm ${pdf.textMuted}`}>
            <span className="font-semibold">Notes: </span>
            {data.notes}
          </div>
        ) : null}
        <div className="mt-4">
          <CompanyLegalDetails data={data} />
        </div>
      </div>
    </div>
  );
}
