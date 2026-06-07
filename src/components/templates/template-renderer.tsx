"use client";

import type { InvoiceTemplateData } from "@/types/invoice";
import { ClassicTemplate } from "@/components/templates/classic-template";
import { CorporateTemplate } from "@/components/templates/corporate-template";
import { ProfessionalTemplate } from "@/components/templates/professional-template";

type TemplateRendererProps = {
  data: InvoiceTemplateData;
};

export function TemplateRenderer({ data }: TemplateRendererProps) {
  switch (data.templateId) {
    case "professional":
      return <ProfessionalTemplate data={data} />;
    case "corporate":
      return <CorporateTemplate data={data} />;
    case "classic":
    default:
      return <ClassicTemplate data={data} />;
  }
}
