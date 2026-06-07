"use client";

import { Download, RotateCcw } from "lucide-react";
import { useState } from "react";
import { useInvoiceStore } from "@/store/invoice-store";
import { useInvoiceTemplateData } from "@/hooks/use-invoice-template-data";
import { CURRENCIES } from "@/lib/currencies";
import { exportInvoicePdf, type PdfExportControls } from "@/lib/export-pdf";
import {
  hasValidationErrors,
  validateInvoiceForExport,
  type InvoiceValidationResult,
} from "@/lib/validate-invoice";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { FormField } from "@/components/ui/form-field";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { TemplateId } from "@/types/invoice";

const TEMPLATES: { id: TemplateId; name: string; description: string }[] = [
  { id: "classic", name: "Classic", description: "Navy title, orange accents" },
  {
    id: "professional",
    name: "Professional",
    description: "Bordered grid table",
  },
  { id: "corporate", name: "Corporate", description: "Bold header bars" },
  { id: "modern", name: "Modern", description: "Clean layout, prominent total" },
  { id: "minimal", name: "Minimal", description: "Bold black & white" },
  {
    id: "executive",
    name: "Executive",
    description: "Zebra table, payment footer",
  },
];

const ACCENT_PRESETS = [
  "#1e3a5f",
  "#171717",
  "#2563eb",
  "#dc2626",
  "#059669",
  "#c45c3e",
];

type SettingsSidebarProps = {
  onExportValidation: (
    result: InvoiceValidationResult,
    blocked: boolean,
  ) => void;
  pdfExportControls: PdfExportControls;
};

export function SettingsSidebar({
  onExportValidation,
  pdfExportControls,
}: SettingsSidebarProps) {
  const store = useInvoiceStore();
  const templateData = useInvoiceTemplateData();
  const [exporting, setExporting] = useState(false);
  const [exportError, setExportError] = useState<string | null>(null);
  const [settingsOpen, setSettingsOpen] = useState(false);

  async function handleDownloadPdf() {
    setExporting(true);
    setExportError(null);

    const validation = validateInvoiceForExport(store);
    if (hasValidationErrors(validation)) {
      onExportValidation(validation, true);
      setExporting(false);
      return;
    }

    onExportValidation(validation, false);
    pdfExportControls.start();

    try {
      const safeNumber = store.invoiceNumber.replace(/[^\w-]+/g, "_") || "draft";
      await exportInvoicePdf(
        "invoice-pdf-root",
        `invoice-${safeNumber}.pdf`,
        store.pageColor,
        pdfExportControls.reportProgress,
      );
      pdfExportControls.finish();
    } catch (err) {
      pdfExportControls.cancel();
      setExportError(
        err instanceof Error ? err.message : "Failed to export PDF",
      );
    } finally {
      setExporting(false);
    }
  }

  function handleReset() {
    if (
      window.confirm(
        "Reset this invoice? All fields will be cleared from this device.",
      )
    ) {
      store.resetInvoice();
    }
  }

  return (
    <aside className="space-y-4 lg:sticky lg:top-6 lg:self-start">
      <Card className="border-border shadow-none">
        <CardContent className="pt-6">
          <Button
            className="w-full bg-emerald-600 text-white hover:bg-emerald-700"
            onClick={handleDownloadPdf}
            disabled={exporting}
          >
            <Download data-icon="inline-start" />
            {exporting ? "Generating PDF…" : "Download PDF"}
          </Button>
          {exportError ? (
            <Alert variant="destructive" className="mt-3">
              <AlertDescription>{exportError}</AlertDescription>
            </Alert>
          ) : null}
        </CardContent>
      </Card>

      <Card className="border-border shadow-none">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
            Template
          </CardTitle>
        </CardHeader>
        <CardContent className="max-h-64 space-y-2 overflow-y-auto">
          {TEMPLATES.map((t) => (
            <button
              key={t.id}
              type="button"
              onClick={() => store.setTemplateId(t.id)}
              className={`w-full rounded-md border px-3 py-2 text-left text-sm transition ${
                store.templateId === t.id
                  ? "border-foreground bg-muted"
                  : "border-border hover:border-foreground/40"
              }`}
            >
              <div className="font-medium">{t.name}</div>
              <div className="text-xs text-muted-foreground">{t.description}</div>
            </button>
          ))}
        </CardContent>
      </Card>

      <Card className="border-border shadow-none">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
            Currency
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Select
            value={store.currencyCode}
            onValueChange={(value) => {
              if (value) store.setField("currencyCode", value);
            }}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Currency" />
            </SelectTrigger>
            <SelectContent>
              {CURRENCIES.map((c) => (
                <SelectItem key={c.code} value={c.code}>
                  {c.symbol} — {c.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </CardContent>
      </Card>

      <Card className="border-border shadow-none">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
            Colors
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <span className="mb-2 block text-xs text-muted-foreground">Accent</span>
            <div className="mb-2 flex flex-wrap gap-2">
              {ACCENT_PRESETS.map((color) => (
                <button
                  key={color}
                  type="button"
                  aria-label={`Accent ${color}`}
                  onClick={() => store.setField("accentColor", color)}
                  className={`size-8 rounded-full border-2 ${
                    store.accentColor === color
                      ? "border-foreground"
                      : "border-transparent"
                  }`}
                  style={{ backgroundColor: color }}
                />
              ))}
            </div>
            <input
              type="color"
              value={store.accentColor}
              onChange={(e) => store.setField("accentColor", e.target.value)}
              className="h-10 w-full cursor-pointer rounded border border-border"
            />
          </div>
          <div>
            <span className="mb-2 block text-xs text-muted-foreground">
              Page color
            </span>
            <input
              type="color"
              value={store.pageColor}
              onChange={(e) => store.setField("pageColor", e.target.value)}
              className="h-10 w-full cursor-pointer rounded border border-border"
            />
          </div>
        </CardContent>
      </Card>

      <Card className="border-border shadow-none">
        <Collapsible open={settingsOpen} onOpenChange={setSettingsOpen}>
          <CollapsibleTrigger className="flex w-full items-center justify-between px-6 py-4 text-sm font-semibold text-foreground">
            Invoice Settings
            <span className="text-muted-foreground">
              {settingsOpen ? "▲" : "▼"}
            </span>
          </CollapsibleTrigger>
          <CollapsibleContent className="space-y-3 px-6 pb-6">
            <FormField label="Document title">
              <Input
                value={store.invoiceTitle}
                onChange={(e) => store.setField("invoiceTitle", e.target.value)}
              />
            </FormField>
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="tax-default"
                checked={store.taxEnabled}
                onChange={(e) => store.setField("taxEnabled", e.target.checked)}
              />
              <label htmlFor="tax-default" className="text-sm">
                Enable tax by default
              </label>
            </div>
            <FormField label="Default tax rate (%)">
              <Input
                type="number"
                min={0}
                value={store.taxRate}
                onChange={(e) =>
                  store.setField("taxRate", Number(e.target.value) || 0)
                }
              />
            </FormField>
          </CollapsibleContent>
        </Collapsible>
      </Card>

      <Button
        variant="destructive"
        className="w-full bg-red-600 text-white hover:bg-red-700"
        onClick={handleReset}
      >
        <RotateCcw data-icon="inline-start" />
        Reset draft
      </Button>

      <p className="text-center text-xs text-muted-foreground">
        Active template:{" "}
        {TEMPLATES.find((t) => t.id === templateData.templateId)?.name ??
          templateData.templateId}
      </p>
    </aside>
  );
}
