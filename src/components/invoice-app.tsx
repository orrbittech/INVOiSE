"use client";

import { Eye, Pencil } from "lucide-react";
import { useCallback, useMemo, useState } from "react";
import { InvoiceEditor } from "@/components/editor/invoice-editor";
import { PdfExportOverlay } from "@/components/pdf-export-overlay";
import { SettingsSidebar } from "@/components/sidebar/settings-sidebar";
import { InvoicePdfRoot } from "@/components/templates/invoice-pdf-root";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useHydrated } from "@/hooks/use-hydrated";
import { useInvoiceTemplateData } from "@/hooks/use-invoice-template-data";
import type { PdfExportControls } from "@/lib/export-pdf";
import {
  firstValidationErrorField,
  type InvoiceValidationField,
  type InvoiceValidationResult,
} from "@/lib/validate-invoice";

export function InvoiceApp() {
  const hydrated = useHydrated();
  const templateData = useInvoiceTemplateData();
  const [activeTab, setActiveTab] = useState("edit");
  const [fieldErrors, setFieldErrors] = useState<
    Partial<Record<InvoiceValidationField, string>>
  >({});
  const [fieldWarnings, setFieldWarnings] = useState<
    Partial<Record<InvoiceValidationField, string>>
  >({});
  const [pdfExportOpen, setPdfExportOpen] = useState(false);
  const [pdfExportPercent, setPdfExportPercent] = useState(0);
  const [pdfExportLabel, setPdfExportLabel] = useState("Preparing…");

  const pdfExportControls = useMemo<PdfExportControls>(
    () => ({
      start: () => {
        setPdfExportOpen(true);
        setPdfExportPercent(0);
        setPdfExportLabel("Preparing…");
      },
      reportProgress: (progress) => {
        setPdfExportOpen(true);
        setPdfExportPercent(progress.percent);
        setPdfExportLabel(progress.label);
      },
      finish: () => {
        setPdfExportOpen(false);
        setPdfExportPercent(0);
        setPdfExportLabel("Preparing…");
      },
      cancel: () => {
        setPdfExportOpen(false);
        setPdfExportPercent(0);
        setPdfExportLabel("Preparing…");
      },
    }),
    [],
  );

  const handleExportValidation = useCallback(
    (result: InvoiceValidationResult, blocked: boolean) => {
      if (blocked) {
        setFieldErrors(result.fieldErrors);
        setFieldWarnings(result.fieldWarnings);
        setActiveTab("edit");
        requestAnimationFrame(() => {
          const firstField = firstValidationErrorField(result);
          if (!firstField) return;
          document
            .querySelector(`[data-validation-field="${firstField}"]`)
            ?.scrollIntoView({ behavior: "smooth", block: "center" });
        });
        return;
      }
      setFieldErrors({});
      setFieldWarnings(result.fieldWarnings);
    },
    [],
  );

  const clearFieldError = useCallback((field: InvoiceValidationField) => {
    setFieldErrors((prev) => {
      if (!prev[field]) return prev;
      const next = { ...prev };
      delete next[field];
      return next;
    });
  }, []);

  const clearFieldWarning = useCallback((field: InvoiceValidationField) => {
    setFieldWarnings((prev) => {
      if (!prev[field]) return prev;
      const next = { ...prev };
      delete next[field];
      return next;
    });
  }, []);

  return (
    <Tabs
      value={activeTab}
      onValueChange={setActiveTab}
      className="min-h-screen bg-background"
    >
      <PdfExportOverlay
        open={pdfExportOpen}
        percent={pdfExportPercent}
        label={pdfExportLabel}
      />

      <header className="border-b border-border bg-card">
        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-foreground sm:text-3xl">
                Free Invoice Template
              </h1>
              <p className="mt-1 text-muted-foreground">
                Create professional invoices with one click — saved on this
                device until you reset.
              </p>
            </div>
            <TabsList className="border border-border bg-muted [&_[data-slot=tabs-trigger][data-active]]:shadow-none">
              <TabsTrigger value="edit" className="gap-1.5">
                <Pencil />
                Edit
              </TabsTrigger>
              <TabsTrigger value="preview" className="gap-1.5">
                <Eye />
                Preview
              </TabsTrigger>
            </TabsList>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
        <div className="grid gap-8 lg:grid-cols-[1fr_280px]">
          <div>
            <TabsContent value="edit" className="mt-0">
              <InvoiceEditor
                fieldErrors={fieldErrors}
                fieldWarnings={fieldWarnings}
                onClearFieldError={clearFieldError}
                onClearFieldWarning={clearFieldWarning}
              />
            </TabsContent>
            <TabsContent value="preview" className="mt-0">
              <div className="overflow-x-auto rounded-lg border border-border bg-muted p-4">
                {hydrated ? (
                  <InvoicePdfRoot data={templateData} id="invoice-preview" />
                ) : (
                  <p className="p-8 text-muted-foreground">Loading preview…</p>
                )}
              </div>
            </TabsContent>
          </div>
          <SettingsSidebar
            onExportValidation={handleExportValidation}
            pdfExportControls={pdfExportControls}
          />
        </div>
      </main>

      {hydrated ? (
        <div
          aria-hidden
          className="pointer-events-none fixed top-0 -left-[10000px] -z-10"
          style={{ width: 794 }}
        >
          <InvoicePdfRoot data={templateData} id="invoice-pdf-root" />
        </div>
      ) : null}
    </Tabs>
  );
}
