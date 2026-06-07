"use client";

import { TemplateRenderer } from "@/components/templates/template-renderer";
import type { InvoiceTemplateData } from "@/types/invoice";

type InvoicePdfRootProps = {
  data: InvoiceTemplateData;
  id?: string;
  className?: string;
};

export function InvoicePdfRoot({
  data,
  id = "invoice-pdf-root",
  className = "",
}: InvoicePdfRootProps) {
  return (
    <div
      id={id}
      className={`mx-auto w-[794px] max-w-full border border-[#e5e5e5] p-8 ${className}`}
      style={{
        backgroundColor: data.pageColor,
        printColorAdjust: "exact",
        WebkitPrintColorAdjust: "exact",
      }}
    >
      <TemplateRenderer data={data} />
    </div>
  );
}
