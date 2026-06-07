"use client";

import type { InvoiceTemplateData } from "@/types/invoice";
import { ClassicTemplate } from "@/components/templates/classic-template";
import { CorporateTemplate } from "@/components/templates/corporate-template";
import { ExecutiveTemplate } from "@/components/templates/executive-template";
import { MinimalTemplate } from "@/components/templates/minimal-template";
import { ModernTemplate } from "@/components/templates/modern-template";
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
    case "modern":
      return <ModernTemplate data={data} />;
    case "minimal":
      return <MinimalTemplate data={data} />;
    case "executive":
      return <ExecutiveTemplate data={data} />;
    case "classic":
    default:
      return <ClassicTemplate data={data} />;
  }
}
