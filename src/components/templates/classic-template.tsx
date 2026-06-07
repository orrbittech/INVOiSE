import type { TemplateProps } from "@/components/templates/template-shared";
import {
  BankDetailsLine,
  CompanyBesideLogo,
  CompanyLegalDetails,
  InvoiceTitleAndCode,
  LineItemsTable,
  LogoOrPlaceholder,
  TotalsBlock,
} from "@/components/templates/template-shared";
import { pdf } from "@/components/templates/pdf-safe-styles";
import { getDisplayTerms } from "@/lib/template-terms";

export function ClassicTemplate({ data }: TemplateProps) {
  const accent = data.accentColor;
  const displayTerms = getDisplayTerms(data.templateId, data.terms);

  return (
    <div className={pdf.text}>
      <div className="mb-6 flex items-center justify-end">
        <div className="flex items-center gap-4">
          <CompanyBesideLogo
            data={data}
            nameClassName="text-xl font-bold"
            emailClassName={`text-sm ${pdf.textMuted}`}
          />
          <LogoOrPlaceholder logoDataUrl={data.logoDataUrl} />
        </div>
      </div>

      <div
        className="mb-6 h-0.5 w-full"
        style={{ backgroundColor: "#c45c3e" }}
      />

      <div className="mb-8 grid grid-cols-3 gap-6 text-sm">
        <div>
          <div className="mb-2 font-bold" style={{ color: accent }}>
            BILL TO
          </div>
          <div className="whitespace-pre-line">{data.billTo || "—"}</div>
          {data.companyAddress ? (
            <div className={`mt-3 whitespace-pre-line text-xs ${pdf.textMuted}`}>
              {data.companyAddress}
            </div>
          ) : null}
        </div>
        <div>
          <div className="mb-2 font-bold" style={{ color: accent }}>
            SHIP TO
          </div>
          <div className="whitespace-pre-line">{data.shipTo || "—"}</div>
        </div>
        <div className="space-y-2">
          <InvoiceTitleAndCode
            data={data}
            titleClassName="text-2xl font-bold tracking-tight"
            codeClassName="text-sm"
          />
          <div className="mt-4 space-y-2">
          <MetaRow label="INVOICE DATE" value={data.invoiceDate} accent={accent} />
          <MetaRow label="P.O.#" value={data.poNumber} accent={accent} />
          <MetaRow label="DUE DATE" value={data.dueDate} accent={accent} />
          {data.paymentTerms ? (
            <MetaRow label="TERMS" value={data.paymentTerms} accent={accent} />
          ) : null}
          </div>
        </div>
      </div>

      <div
        className="mb-0 h-0.5 w-full"
        style={{ backgroundColor: "#c45c3e" }}
      />

      <LineItemsTable data={data} />

      <div
        className="mt-0 h-0.5 w-full"
        style={{ backgroundColor: "#c45c3e" }}
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

      <div className={`mt-12 flex gap-8 border-t pt-8 ${pdf.border}`}>
        <div
          className="flex-1 text-5xl font-semibold italic"
          style={{ color: accent }}
        >
          Thank you
        </div>
        <div className={`w-px ${pdf.divider}`} />
        <div className="flex-1">
          <div
            className="mb-2 text-sm font-bold"
            style={{ color: "#c45c3e" }}
          >
            TERMS & CONDITIONS
          </div>
          <div className={`whitespace-pre-line text-xs ${pdf.textMuted}`}>
            {displayTerms}
          </div>
          <div className="mt-4">
            <CompanyLegalDetails data={data} />
          </div>
        </div>
      </div>

      {data.notes ? (
        <div className={`mt-6 text-xs ${pdf.textLight}`}>
          <span className="font-semibold">Notes: </span>
          {data.notes}
        </div>
      ) : null}
    </div>
  );
}

function MetaRow({
  label,
  value,
  accent,
}: {
  label: string;
  value: string;
  accent: string;
}) {
  if (!value) return null;
  return (
    <div className="flex justify-between gap-2">
      <span className="font-bold" style={{ color: accent }}>
        {label}
      </span>
      <span>{value}</span>
    </div>
  );
}
